package com.xiao9.wb.site.service;

import com.xiao9.wb.common.exception.BusinessException;
import com.xiao9.wb.common.exception.ErrorCode;
import com.xiao9.wb.common.response.PageResponse;
import com.xiao9.wb.site.dto.CreateSiteRequest;
import com.xiao9.wb.site.dto.SiteConfigDTO;
import com.xiao9.wb.site.dto.SiteDTO;
import com.xiao9.wb.site.dto.UpdateSiteConfigRequest;
import com.xiao9.wb.site.dto.UpdateSiteRequest;
import com.xiao9.wb.site.entity.Site;
import com.xiao9.wb.site.entity.SiteConfig;
import com.xiao9.wb.site.repository.SiteConfigRepository;
import com.xiao9.wb.site.repository.SiteRepository;
import com.xiao9.wb.template.entity.Template;
import com.xiao9.wb.template.repository.TemplateRepository;
import com.xiao9.wb.user.entity.User;
import com.xiao9.wb.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class SiteService {

    private final SiteRepository siteRepository;
    private final SiteConfigRepository siteConfigRepository;
    private final UserRepository userRepository;
    private final TemplateRepository templateRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional(readOnly = true)
    public PageResponse<SiteDTO> list(User user, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Site> sites = isAdmin(user)
                ? siteRepository.findAll(pageRequest)
                : siteRepository.findByOwnerId(user.getId(), pageRequest);

        List<SiteDTO> dtos = sites.getContent().stream()
                .map(SiteDTO::from)
                .toList();

        return PageResponse.of(dtos, page, size, sites.getTotalElements());
    }

    @Transactional(readOnly = true)
    public SiteDTO getById(Long id, User user) {
        Site site = requireReadableSite(id, user);
        return SiteDTO.from(site);
    }

    @Transactional
    public SiteDTO create(CreateSiteRequest request, Long ownerId) {
        String slug = normalizeSlug(request.slug() != null ? request.slug() : request.subdomain());
        validateSlugAvailable(slug, null);

        String subdomain = normalizeOptionalSlug(request.subdomain());
        validateSubdomainAvailable(subdomain, null);

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Template template = resolveTemplate(request.templateId(), request.templateCode());

        Site.SiteType siteType = resolveSiteType(request.siteType(), template);

        Site site = Site.builder()
                .name(request.name())
                .description(request.description())
                .slug(slug)
                .subdomain(subdomain)
                .siteType(siteType)
                .status(Site.Status.DRAFT)
                .owner(owner)
                .template(template)
                .build();

        siteRepository.save(site);
        ensureDefaultConfig(site);
        log.info("Site created: {} by user {}", site.getName(), ownerId);
        return SiteDTO.from(site);
    }

    @Transactional
    public SiteDTO update(Long id, UpdateSiteRequest request, User user) {
        Site site = requireWritableSite(id, user);

        if (request.name() != null && !request.name().isBlank()) {
            site.setName(request.name());
        }
        if (request.description() != null) {
            site.setDescription(request.description());
        }
        if (request.slug() != null) {
            String slug = normalizeSlug(request.slug());
            validateSlugAvailable(slug, site.getId());
            site.setSlug(slug);
        }
        if (request.subdomain() != null) {
            String subdomain = normalizeOptionalSlug(request.subdomain());
            validateSubdomainAvailable(subdomain, site.getId());
            site.setSubdomain(subdomain);
        }
        if (request.status() != null) {
            try {
                site.setStatus(Site.Status.valueOf(request.status().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "Invalid site status");
            }
        }

        siteRepository.save(site);
        return SiteDTO.from(site);
    }

    @Transactional(readOnly = true)
    public SiteConfigDTO getConfig(Long siteId, User user) {
        Site site = requireReadableSite(siteId, user);
        SiteConfig config = siteConfigRepository.findBySiteId(site.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Site config not found"));
        return SiteConfigDTO.from(config);
    }

    @Transactional
    public SiteConfigDTO updateConfig(Long siteId, UpdateSiteConfigRequest request, User user) {
        Site site = requireWritableSite(siteId, user);
        SiteConfig config = siteConfigRepository.findBySiteId(site.getId())
                .orElseGet(() -> buildDefaultConfig(site));

        Map<String, Object> seoConfig = request.seoConfig() != null ? request.seoConfig() : config.getSeoConfig();
        Map<String, Object> themeConfig = request.themeConfig() != null ? request.themeConfig() : config.getThemeConfig();
        Map<String, Object> navigationConfig = request.navigationConfig() != null ? request.navigationConfig() : config.getNavigationConfig();
        Map<String, Object> customConfig = request.customConfig() != null ? request.customConfig() : config.getCustomConfig();
        Map<String, Object> brandConfig = request.brandConfig() != null ? request.brandConfig() : config.getBrandConfig();
        Map<String, Object> contentConfig = request.contentConfig() != null ? request.contentConfig() : config.getContentConfig();

        validateSiteConfig(seoConfig, navigationConfig, brandConfig, contentConfig);

        config.setSeoConfig(seoConfig);
        config.setThemeConfig(themeConfig);
        config.setNavigationConfig(navigationConfig);
        config.setCustomConfig(customConfig);
        config.setBrandConfig(brandConfig);
        config.setContentConfig(contentConfig);

        siteConfigRepository.save(config);
        return SiteConfigDTO.from(config);
    }

    @Transactional
    public SiteDTO publish(Long id, User user) {
        Site site = requireWritableSite(id, user);
        // Trigger build via event
        eventPublisher.publishEvent(new BuildTriggerEvent(this, site, "user:" + user.getId()));

        return SiteDTO.from(site);
    }

    @Transactional
    public void delete(Long id, User user) {
        Site site = requireWritableSite(id, user);
        siteRepository.delete(site);
        log.info("Site deleted: {} by user {}", id, user.getId());
    }

    @Transactional(readOnly = true)
    public Site requireReadableSite(Long id, User user) {
        Site site = siteRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.SITE_NOT_FOUND));
        if (!isAdmin(user) && !site.getOwner().getId().equals(user.getId())) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "You can only access your own sites");
        }
        return site;
    }

    private Site requireWritableSite(Long id, User user) {
        Site site = siteRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.SITE_NOT_FOUND));
        if (!isAdmin(user) && !site.getOwner().getId().equals(user.getId())) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "You can only modify your own sites");
        }
        return site;
    }

    private boolean isAdmin(User user) {
        return user != null && user.getRole() == User.Role.ADMIN;
    }

    private Template resolveTemplate(Long templateId, String templateCode) {
        if (templateId != null) {
            return templateRepository.findById(templateId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.TEMPLATE_NOT_FOUND));
        }
        if (templateCode != null && !templateCode.isBlank()) {
            return templateRepository.findByCode(templateCode.trim())
                    .orElseThrow(() -> new BusinessException(ErrorCode.TEMPLATE_NOT_FOUND));
        }
        return null;
    }

    private Site.SiteType resolveSiteType(String requestedSiteType, Template template) {
        if (requestedSiteType != null && !requestedSiteType.isBlank()) {
            try {
                return Site.SiteType.valueOf(requestedSiteType.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "Invalid site type");
            }
        }
        if (template != null && (
                "corporate-site".equals(template.getCode()) || "corporate".equalsIgnoreCase(template.getCategory())
        )) {
            return Site.SiteType.CORPORATE;
        }
        return Site.SiteType.BLOG;
    }

    private String normalizeSlug(String slug) {
        if (slug == null || slug.isBlank()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Site slug is required");
        }
        String normalized = slug.trim().toLowerCase();
        if (!normalized.matches("^[a-z0-9][a-z0-9-]{1,98}[a-z0-9]$")) {
            throw new BusinessException(
                    ErrorCode.BAD_REQUEST,
                    "Slug can only contain lowercase letters, numbers, and hyphens, and must be 3 to 100 characters"
            );
        }
        return normalized;
    }

    private String normalizeOptionalSlug(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return normalizeSlug(value);
    }

    private void validateSlugAvailable(String slug, Long currentSiteId) {
        siteRepository.findBySlug(slug)
                .filter(site -> !Objects.equals(site.getId(), currentSiteId))
                .ifPresent(site -> {
                    throw new BusinessException(ErrorCode.SITE_DOMAIN_TAKEN, "Slug is already in use");
                });
    }

    private void validateSubdomainAvailable(String subdomain, Long currentSiteId) {
        if (subdomain == null) {
            return;
        }
        siteRepository.findBySubdomain(subdomain)
                .filter(site -> !Objects.equals(site.getId(), currentSiteId))
                .ifPresent(site -> {
                    throw new BusinessException(ErrorCode.SITE_DOMAIN_TAKEN, "Subdomain is already in use");
                });
    }

    private SiteConfig ensureDefaultConfig(Site site) {
        if (siteConfigRepository.findBySiteId(site.getId()).isPresent()) {
            return siteConfigRepository.findBySiteId(site.getId()).get();
        }

        SiteConfig config = buildDefaultConfig(site);
        return siteConfigRepository.save(config);
    }

    private SiteConfig buildDefaultConfig(Site site) {
        Template template = site.getTemplate();
        Map<String, Object> brandConfig = defaultBrandConfig(site);
        Map<String, Object> contentConfig = defaultContentConfig(site);

        return SiteConfig.builder()
                .site(site)
                .seoConfig(Map.of(
                        "title", site.getName(),
                        "description", site.getDescription() != null ? site.getDescription() : site.getName()
                ))
                .themeConfig(defaultThemeConfig(template))
                .navigationConfig(defaultNavigationConfig())
                .customConfig(Map.of(
                        "mobileContactBar", true,
                        "leadEntryPoints", List.of("phone", "wechat", "message")
                ))
                .brandConfig(brandConfig)
                .contentConfig(contentConfig)
                .build();
    }

    private Map<String, Object> defaultThemeConfig(Template template) {
        if (template != null && "corporate-site".equals(template.getCode())) {
            return Map.of(
                    "primary", "#2F7D4A",
                    "cream", "#FFF8E7",
                    "butterGold", "#D9A441",
                    "text", "#1F2933",
                    "muted", "#64748B"
            );
        }
        return Map.of(
                "primary", "#2563EB",
                "background", "#F6F8FB",
                "surface", "#FFFFFF",
                "text", "#111827"
        );
    }

    private Map<String, Object> defaultNavigationConfig() {
        return Map.of(
                "items", List.of(
                        Map.of("label", "首页", "href", "/"),
                        Map.of("label", "产品服务", "href", "/products"),
                        Map.of("label", "关于我们", "href", "/about"),
                        Map.of("label", "最近动态", "href", "/news"),
                        Map.of("label", "合作机会", "href", "/cooperation"),
                        Map.of("label", "联系我们", "href", "/contact")
                )
        );
    }

    private Map<String, Object> defaultBrandConfig(Site site) {
        Map<String, Object> brand = new LinkedHashMap<>();
        brand.put("companyName", site.getName());
        brand.put("shortName", site.getName());
        brand.put("logoUrl", null);
        brand.put("brandWords", List.of("绿色", "健康", "生态", "专业稳重", "简洁", "亲民"));
        brand.put("businessDirection", "黄油等乳制品相关产品与食品科技服务");
        return brand;
    }

    private Map<String, Object> defaultContentConfig(Site site) {
        Map<String, Object> contact = new LinkedHashMap<>();
        contact.put("phone", null);
        contact.put("wechat", null);
        contact.put("wechatQrUrl", null);
        contact.put("address", null);
        contact.put("messageEnabled", true);
        contact.put("notice", "电话、微信、地址和二维码等待企业真实资料补充。");

        Map<String, Object> content = new LinkedHashMap<>();
        content.put("hero", Map.of(
                "headline", "绿色健康乳制品供应与合作服务",
                "subheadline", "面向食品加工、烘焙餐饮、经销批发和渠道合作客户，提供黄油等乳制品相关产品与咨询合作服务。",
                "primaryCta", "电话咨询",
                "secondaryCta", "提交合作咨询"
        ));
        content.put("about", Map.of(
                "summary", site.getDescription() != null ? site.getDescription() : "企业介绍等待真实资料补充。"
        ));
        content.put("cooperation", Map.of(
                "title", "合作机会",
                "description", "欢迎食品加工、烘焙餐饮、经销批发和渠道合作客户留下需求。",
                "items", List.of("企业采购", "经销批发", "渠道合作", "产品咨询")
        ));
        content.put("contact", contact);
        return content;
    }

    private void validateSiteConfig(
            Map<String, Object> seoConfig,
            Map<String, Object> navigationConfig,
            Map<String, Object> brandConfig,
            Map<String, Object> contentConfig
    ) {
        requireMap(seoConfig, "seoConfig");
        requireText(seoConfig, "title", "seoConfig.title");
        requireText(seoConfig, "description", "seoConfig.description");

        requireMap(navigationConfig, "navigationConfig");
        Object navItems = navigationConfig.get("items");
        if (!(navItems instanceof List<?> navList) || navList.isEmpty()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "navigationConfig.items is required");
        }

        requireMap(brandConfig, "brandConfig");
        requireText(brandConfig, "companyName", "brandConfig.companyName");
        requireText(brandConfig, "shortName", "brandConfig.shortName");
        requireText(brandConfig, "businessDirection", "brandConfig.businessDirection");
        Object brandWords = brandConfig.get("brandWords");
        if (!(brandWords instanceof List<?> words) || words.isEmpty()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "brandConfig.brandWords is required");
        }

        requireMap(contentConfig, "contentConfig");
        requireNestedMap(contentConfig, "hero", "contentConfig.hero");
        requireNestedMap(contentConfig, "contact", "contentConfig.contact");
        requireNestedMap(contentConfig, "about", "contentConfig.about");
        requireNestedMap(contentConfig, "cooperation", "contentConfig.cooperation");

        @SuppressWarnings("unchecked")
        Map<String, Object> hero = (Map<String, Object>) contentConfig.get("hero");
        requireText(hero, "headline", "contentConfig.hero.headline");
        requireText(hero, "subheadline", "contentConfig.hero.subheadline");
        requireText(hero, "primaryCta", "contentConfig.hero.primaryCta");

        @SuppressWarnings("unchecked")
        Map<String, Object> about = (Map<String, Object>) contentConfig.get("about");
        requireText(about, "summary", "contentConfig.about.summary");

        @SuppressWarnings("unchecked")
        Map<String, Object> cooperation = (Map<String, Object>) contentConfig.get("cooperation");
        requireText(cooperation, "title", "contentConfig.cooperation.title");
        requireText(cooperation, "description", "contentConfig.cooperation.description");
        Object cooperationItems = cooperation.get("items");
        if (!(cooperationItems instanceof List<?> cooperationList) || cooperationList.isEmpty()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "contentConfig.cooperation.items is required");
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> contact = (Map<String, Object>) contentConfig.get("contact");
        if (!(contact.get("messageEnabled") instanceof Boolean)) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "contentConfig.contact.messageEnabled is required");
        }
    }

    private void requireMap(Map<String, Object> value, String label) {
        if (value == null || value.isEmpty()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, label + " is required");
        }
    }

    private void requireNestedMap(Map<String, Object> parent, String key, String label) {
        Object value = parent.get(key);
        if (!(value instanceof Map<?, ?> nested) || nested.isEmpty()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, label + " is required");
        }
    }

    private void requireText(Map<String, Object> map, String key, String label) {
        Object value = map.get(key);
        if (!(value instanceof String text) || text.isBlank()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, label + " is required");
        }
    }
}
