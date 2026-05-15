package com.xiao9.wb.lead.service;

import com.xiao9.wb.common.exception.BusinessException;
import com.xiao9.wb.lead.dto.CreateLeadRequest;
import com.xiao9.wb.lead.entity.Lead;
import com.xiao9.wb.lead.repository.LeadRepository;
import com.xiao9.wb.site.entity.Site;
import com.xiao9.wb.site.repository.SiteRepository;
import com.xiao9.wb.site.service.SiteService;
import com.xiao9.wb.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class LeadServiceTest {

    private LeadRepository leadRepository;
    private SiteRepository siteRepository;
    private SiteService siteService;
    private LeadService leadService;
    private User user;
    private Site site;

    @BeforeEach
    void setUp() {
        leadRepository = mock(LeadRepository.class);
        siteRepository = mock(SiteRepository.class);
        siteService = mock(SiteService.class);
        leadService = new LeadService(leadRepository, siteRepository, siteService);
        user = User.builder().id(7L).role(User.Role.USER).build();
        site = Site.builder().id(11L).slug("chunchang").owner(user).build();
    }

    @Test
    void submitPublicLeadCreatesNewLeadBySiteSlug() {
        when(siteRepository.findBySlug("chunchang")).thenReturn(Optional.of(site));
        when(leadRepository.save(any(Lead.class))).thenAnswer(invocation -> {
            Lead saved = invocation.getArgument(0);
            saved.setId(101L);
            return saved;
        });

        var response = leadService.submitPublicLead(" Chunchang ", request());

        assertThat(response.id()).isEqualTo(101L);
        assertThat(response.message()).isEqualTo("已收到您的咨询，我们会尽快与您联系。");
        verify(leadRepository).save(argThat(saved ->
                saved.getSite() == site
                        && saved.getPhone().equals("13800000000")
                        && saved.getMessage().equals("想咨询黄油产品")
                        && saved.getStatus() == Lead.Status.NEW
        ));
        verifyNoInteractions(siteService);
    }

    @Test
    void submitPublicLeadRejectsMissingSiteSlug() {
        assertThatThrownBy(() -> leadService.submitPublicLead(" ", request()))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Site slug is required");

        verifyNoInteractions(leadRepository);
    }

    @Test
    void listReturnsAllLeadsWhenStatusFilterIsMissing() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(leadRepository.findBySiteIdOrderByCreatedAtDesc(11L))
                .thenReturn(List.of(lead(1L, site, Lead.Status.NEW), lead(2L, site, Lead.Status.CONTACTED)));

        var result = leadService.list(11L, null, user);

        assertThat(result).extracting("id").containsExactly(1L, 2L);
        verify(leadRepository).findBySiteIdOrderByCreatedAtDesc(11L);
        verify(leadRepository, never()).findBySiteIdAndStatusOrderByCreatedAtDesc(anyLong(), any());
    }

    @Test
    void listAppliesStatusFilterWhenPresent() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(leadRepository.findBySiteIdAndStatusOrderByCreatedAtDesc(11L, Lead.Status.CONTACTED))
                .thenReturn(List.of(lead(2L, site, Lead.Status.CONTACTED)));

        var result = leadService.list(11L, "contacted", user);

        assertThat(result).extracting("status").containsExactly("CONTACTED");
        verify(leadRepository).findBySiteIdAndStatusOrderByCreatedAtDesc(11L, Lead.Status.CONTACTED);
    }

    @Test
    void getRejectsLeadOutsideSiteScope() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(leadRepository.findByIdAndSiteId(99L, 11L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> leadService.get(11L, 99L, user))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Lead not found");
    }

    @Test
    void updateStatusChangesLeadStatus() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        Lead lead = lead(3L, site, Lead.Status.NEW);
        when(leadRepository.findByIdAndSiteId(3L, 11L)).thenReturn(Optional.of(lead));
        when(leadRepository.save(any(Lead.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = leadService.updateStatus(11L, 3L, "closed", user);

        assertThat(result.status()).isEqualTo("CLOSED");
        verify(leadRepository).save(argThat(saved -> saved.getStatus() == Lead.Status.CLOSED));
    }

    @Test
    void updateStatusRejectsInvalidStatus() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(leadRepository.findByIdAndSiteId(3L, 11L)).thenReturn(Optional.of(lead(3L, site, Lead.Status.NEW)));

        assertThatThrownBy(() -> leadService.updateStatus(11L, 3L, "done", user))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Invalid lead status");

        verify(leadRepository, never()).save(any());
    }

    private CreateLeadRequest request() {
        return new CreateLeadRequest(
                "张三",
                "13800000000",
                "某食品公司",
                "企业采购",
                "想咨询黄油产品",
                "/sites/chunchang/contact"
        );
    }

    private Lead lead(Long id, Site site, Lead.Status status) {
        return Lead.builder()
                .id(id)
                .site(site)
                .name("张三")
                .phone("13800000000")
                .companyName("某食品公司")
                .cooperationType("企业采购")
                .message("想咨询黄油产品")
                .sourcePage("/sites/chunchang/contact")
                .status(status)
                .createdAt(LocalDateTime.parse("2026-01-01T00:00:00"))
                .build();
    }
}
