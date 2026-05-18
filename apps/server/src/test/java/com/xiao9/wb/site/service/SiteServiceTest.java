package com.xiao9.wb.site.service;

import com.xiao9.wb.common.exception.BusinessException;
import com.xiao9.wb.site.entity.Site;
import com.xiao9.wb.site.repository.SiteConfigRepository;
import com.xiao9.wb.site.repository.SiteRepository;
import com.xiao9.wb.template.repository.TemplateRepository;
import com.xiao9.wb.user.entity.User;
import com.xiao9.wb.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationEventPublisher;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class SiteServiceTest {

    private SiteRepository siteRepository;
    private SiteConfigRepository siteConfigRepository;
    private UserRepository userRepository;
    private TemplateRepository templateRepository;
    private ApplicationEventPublisher eventPublisher;
    private SiteService siteService;
    private User user;

    @BeforeEach
    void setUp() {
        siteRepository = mock(SiteRepository.class);
        siteConfigRepository = mock(SiteConfigRepository.class);
        userRepository = mock(UserRepository.class);
        templateRepository = mock(TemplateRepository.class);
        eventPublisher = mock(ApplicationEventPublisher.class);
        siteService = new SiteService(
                siteRepository,
                siteConfigRepository,
                userRepository,
                templateRepository,
                eventPublisher
        );
        user = User.builder().id(7L).role(User.Role.USER).build();
    }

    @Test
    void offlineChangesStatusWithoutDeletingSite() {
        Site site = site(11L, Site.Status.PUBLISHED);
        site.setPublishedAt(LocalDateTime.parse("2026-01-01T00:00:00"));
        when(siteRepository.findById(11L)).thenReturn(Optional.of(site));
        when(siteRepository.save(any(Site.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = siteService.offline(11L, user);

        assertThat(result.status()).isEqualTo("OFFLINE");
        assertThat(site.getStatus()).isEqualTo(Site.Status.OFFLINE);
        assertThat(site.getPublishedAt()).isNull();
        verify(siteRepository).save(site);
        verify(siteRepository, never()).delete(any());
    }

    @Test
    void offlineRejectsSitesOutsideOwnerScope() {
        User other = User.builder().id(9L).role(User.Role.USER).build();
        Site site = site(11L, Site.Status.PUBLISHED);
        site.setOwner(other);
        when(siteRepository.findById(11L)).thenReturn(Optional.of(site));

        assertThatThrownBy(() -> siteService.offline(11L, user))
                .isInstanceOf(BusinessException.class)
                .hasMessage("You can only modify your own sites");

        verify(siteRepository, never()).save(any());
        verify(siteRepository, never()).delete(any());
    }

    @Test
    void updateAllowsOfflineSiteToReturnToDraftForRepublishing() {
        Site site = site(11L, Site.Status.OFFLINE);
        when(siteRepository.findById(11L)).thenReturn(Optional.of(site));
        when(siteRepository.save(any(Site.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = siteService.updateStatus(11L, "DRAFT", user);

        assertThat(result.status()).isEqualTo("DRAFT");
        assertThat(site.getStatus()).isEqualTo(Site.Status.DRAFT);
        verify(siteRepository).save(site);
    }

    private Site site(Long id, Site.Status status) {
        return Site.builder()
                .id(id)
                .name("Test Site")
                .slug("test-site")
                .status(status)
                .siteType(Site.SiteType.CORPORATE)
                .owner(user)
                .build();
    }
}
