package com.xiao9.wb.lead.service;

import com.xiao9.wb.common.exception.BusinessException;
import com.xiao9.wb.common.exception.ErrorCode;
import com.xiao9.wb.lead.dto.CreateLeadRequest;
import com.xiao9.wb.lead.dto.LeadDTO;
import com.xiao9.wb.lead.dto.PublicLeadResponse;
import com.xiao9.wb.lead.entity.Lead;
import com.xiao9.wb.lead.repository.LeadRepository;
import com.xiao9.wb.site.entity.Site;
import com.xiao9.wb.site.repository.SiteRepository;
import com.xiao9.wb.site.service.SiteService;
import com.xiao9.wb.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeadService {

    private static final String PUBLIC_SUCCESS_MESSAGE = "已收到您的咨询，我们会尽快与您联系。";

    private final LeadRepository leadRepository;
    private final SiteRepository siteRepository;
    private final SiteService siteService;

    @Transactional
    public PublicLeadResponse submitPublicLead(String siteSlug, CreateLeadRequest request) {
        Site site = siteRepository.findBySlug(normalizeSiteSlug(siteSlug))
                .orElseThrow(() -> new BusinessException(ErrorCode.SITE_NOT_FOUND));

        Lead lead = Lead.builder()
                .site(site)
                .name(blankToNull(request.name()))
                .phone(request.phone())
                .companyName(blankToNull(request.companyName()))
                .cooperationType(blankToNull(request.cooperationType()))
                .message(request.message())
                .sourcePage(blankToNull(request.sourcePage()))
                .status(Lead.Status.NEW)
                .build();

        leadRepository.save(lead);
        log.info("Public lead submitted for site {} from {}", site.getId(), lead.getSourcePage());
        return new PublicLeadResponse(lead.getId(), PUBLIC_SUCCESS_MESSAGE);
    }

    @Transactional(readOnly = true)
    public List<LeadDTO> list(Long siteId, String status, User user) {
        Site site = siteService.requireReadableSite(siteId, user);
        List<Lead> leads = status == null || status.isBlank()
                ? leadRepository.findBySiteIdOrderByCreatedAtDesc(site.getId())
                : leadRepository.findBySiteIdAndStatusOrderByCreatedAtDesc(site.getId(), parseStatus(status));

        return leads.stream()
                .map(LeadDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public LeadDTO get(Long siteId, Long leadId, User user) {
        siteService.requireReadableSite(siteId, user);
        return LeadDTO.from(requireLeadInSite(siteId, leadId));
    }

    @Transactional
    public LeadDTO updateStatus(Long siteId, Long leadId, String status, User user) {
        siteService.requireReadableSite(siteId, user);
        Lead lead = requireLeadInSite(siteId, leadId);
        lead.setStatus(parseStatus(status));

        leadRepository.save(lead);
        return LeadDTO.from(lead);
    }

    private Lead requireLeadInSite(Long siteId, Long leadId) {
        return leadRepository.findByIdAndSiteId(leadId, siteId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Lead not found"));
    }

    private Lead.Status parseStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Lead status is required");
        }
        try {
            return Lead.Status.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Invalid lead status");
        }
    }

    private String normalizeSiteSlug(String siteSlug) {
        if (siteSlug == null || siteSlug.isBlank()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Site slug is required");
        }
        return siteSlug.trim().toLowerCase();
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}
