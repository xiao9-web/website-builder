package com.xiao9.wb.template.service;

import com.xiao9.wb.common.exception.BusinessException;
import com.xiao9.wb.common.exception.ErrorCode;
import com.xiao9.wb.common.response.PageResponse;
import com.xiao9.wb.template.dto.CreateTemplateRequest;
import com.xiao9.wb.template.dto.TemplateDTO;
import com.xiao9.wb.template.entity.Template;
import com.xiao9.wb.template.entity.TemplateVersion;
import com.xiao9.wb.template.repository.TemplateRepository;
import com.xiao9.wb.template.repository.TemplateVersionRepository;
import com.xiao9.wb.user.entity.User;
import com.xiao9.wb.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class TemplateService {

    private final TemplateRepository templateRepository;
    private final TemplateVersionRepository templateVersionRepository;
    private final UserRepository userRepository;
    private final SchemaValidator schemaValidator;

    @Transactional(readOnly = true)
    public PageResponse<TemplateDTO> listPublished(int page, int size, String category) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Template> templates;

        if (category != null && !category.isBlank()) {
            templates = templateRepository.findByStatusAndCategory(Template.Status.PUBLISHED, category, pageRequest);
        } else {
            templates = templateRepository.findByStatus(Template.Status.PUBLISHED, pageRequest);
        }

        List<TemplateDTO> dtos = templates.getContent().stream()
                .map(TemplateDTO::from)
                .toList();

        return PageResponse.of(dtos, page, size, templates.getTotalElements());
    }

    @Transactional(readOnly = true)
    public TemplateDTO getById(Long id) {
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.TEMPLATE_NOT_FOUND));
        return TemplateDTO.from(template);
    }

    @Transactional
    public TemplateDTO create(CreateTemplateRequest request, Long authorId) {
        List<String> validationErrors = schemaValidator.validate(request.schema());
        if (!validationErrors.isEmpty()) {
            throw new BusinessException(ErrorCode.TEMPLATE_SCHEMA_INVALID,
                    "Schema validation failed: " + String.join("; ", validationErrors));
        }

        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Template template = Template.builder()
                .name(request.name())
                .description(request.description())
                .category(request.category())
                .thumbnail(request.thumbnail())
                .schema(request.schema())
                .status(Template.Status.DRAFT)
                .currentVersion(1)
                .author(author)
                .build();

        templateRepository.save(template);

        // Save initial version
        TemplateVersion version = TemplateVersion.builder()
                .template(template)
                .version(1)
                .schema(request.schema())
                .changelog("Initial version")
                .build();
        templateVersionRepository.save(version);

        log.info("Template created: {} by user {}", template.getName(), authorId);
        return TemplateDTO.from(template);
    }

    @Transactional
    public TemplateDTO updateSchema(Long id, Map<String, Object> schema, String changelog, Long userId) {
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.TEMPLATE_NOT_FOUND));

        if (!template.getAuthor().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "You can only update your own templates");
        }

        List<String> validationErrors = schemaValidator.validate(schema);
        if (!validationErrors.isEmpty()) {
            throw new BusinessException(ErrorCode.TEMPLATE_SCHEMA_INVALID,
                    "Schema validation failed: " + String.join("; ", validationErrors));
        }

        int newVersion = template.getCurrentVersion() + 1;
        template.setSchema(schema);
        template.setCurrentVersion(newVersion);
        templateRepository.save(template);

        TemplateVersion version = TemplateVersion.builder()
                .template(template)
                .version(newVersion)
                .schema(schema)
                .changelog(changelog)
                .build();
        templateVersionRepository.save(version);

        log.info("Template {} updated to version {}", id, newVersion);
        return TemplateDTO.from(template);
    }

    @Transactional
    public TemplateDTO publish(Long id, Long userId) {
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.TEMPLATE_NOT_FOUND));

        if (!template.getAuthor().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "You can only publish your own templates");
        }

        template.setStatus(Template.Status.PUBLISHED);
        templateRepository.save(template);

        log.info("Template {} published", id);
        return TemplateDTO.from(template);
    }
}
