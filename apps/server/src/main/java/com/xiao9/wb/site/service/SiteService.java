package com.xiao9.wb.site.service;

import com.xiao9.wb.common.exception.BusinessException;
import com.xiao9.wb.common.exception.ErrorCode;
import com.xiao9.wb.common.response.PageResponse;
import com.xiao9.wb.site.dto.CreateSiteRequest;
import com.xiao9.wb.site.dto.SiteDTO;
import com.xiao9.wb.site.entity.Site;
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

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SiteService {

    private final SiteRepository siteRepository;
    private final UserRepository userRepository;
    private final TemplateRepository templateRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional(readOnly = true)
    public PageResponse<SiteDTO> listByOwner(Long ownerId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Site> sites = siteRepository.findByOwnerId(ownerId, pageRequest);

        List<SiteDTO> dtos = sites.getContent().stream()
                .map(SiteDTO::from)
                .toList();

        return PageResponse.of(dtos, page, size, sites.getTotalElements());
    }

    @Transactional(readOnly = true)
    public SiteDTO getById(Long id) {
        Site site = siteRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.SITE_NOT_FOUND));
        return SiteDTO.from(site);
    }

    @Transactional
    public SiteDTO create(CreateSiteRequest request, Long ownerId) {
        if (request.subdomain() != null && siteRepository.existsBySubdomain(request.subdomain())) {
            throw new BusinessException(ErrorCode.SITE_DOMAIN_TAKEN);
        }

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Template template = null;
        if (request.templateId() != null) {
            template = templateRepository.findById(request.templateId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.TEMPLATE_NOT_FOUND));
        }

        Site.SiteType siteType = Site.SiteType.BLOG;
        if (request.siteType() != null) {
            try {
                siteType = Site.SiteType.valueOf(request.siteType().toUpperCase());
            } catch (IllegalArgumentException e) {
                // Default to BLOG
            }
        }

        Site site = Site.builder()
                .name(request.name())
                .description(request.description())
                .subdomain(request.subdomain())
                .siteType(siteType)
                .status(Site.Status.DRAFT)
                .owner(owner)
                .template(template)
                .build();

        siteRepository.save(site);
        log.info("Site created: {} by user {}", site.getName(), ownerId);
        return SiteDTO.from(site);
    }

    @Transactional
    public SiteDTO publish(Long id, Long userId) {
        Site site = siteRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.SITE_NOT_FOUND));

        if (!site.getOwner().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "You can only publish your own sites");
        }

        // Trigger build via event
        eventPublisher.publishEvent(new BuildTriggerEvent(this, site, "user:" + userId));

        return SiteDTO.from(site);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Site site = siteRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.SITE_NOT_FOUND));

        if (!site.getOwner().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "You can only delete your own sites");
        }

        siteRepository.delete(site);
        log.info("Site deleted: {} by user {}", id, userId);
    }
}
