package com.xiao9.wb.site.service;

import com.xiao9.wb.site.entity.Build;
import com.xiao9.wb.site.entity.Site;
import com.xiao9.wb.site.repository.BuildRepository;
import com.xiao9.wb.site.repository.SiteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class BuildServiceTest {

    private BuildRepository buildRepository;
    private SiteRepository siteRepository;
    private BuildService buildService;
    private Site site;

    @BeforeEach
    void setUp() {
        buildRepository = mock(BuildRepository.class);
        siteRepository = mock(SiteRepository.class);
        site = Site.builder()
                .id(11L)
                .name("春昌官网")
                .subdomain("chunchang")
                .siteType(Site.SiteType.CORPORATE)
                .status(Site.Status.DRAFT)
                .build();
        buildService = new BuildService(
                buildRepository,
                siteRepository,
                List.of(new SuccessfulCorporateBuildStrategy())
        );
    }

    @Test
    void executeBuildMarksSitePublishedAndSetsPublishedAt() {
        Build build = Build.builder()
                .id(31L)
                .site(site)
                .status(Build.Status.PENDING)
                .triggeredBy("user:7")
                .build();
        when(buildRepository.findById(31L)).thenReturn(Optional.of(build));

        buildService.executeBuild(31L);

        assertThat(build.getStatus()).isEqualTo(Build.Status.SUCCESS);
        assertThat(build.getOutputUrl()).isEqualTo("https://chunchang.xiao9.com");
        assertThat(build.getCompletedAt()).isNotNull();
        assertThat(site.getStatus()).isEqualTo(Site.Status.PUBLISHED);
        assertThat(site.getPublishedAt()).isEqualTo(build.getCompletedAt());
        verify(siteRepository).save(site);
        verify(buildRepository, atLeastOnce()).save(build);
    }

    @Test
    void getLatestBuildReturnsMostRecentBuildRegardlessOfStatus() {
        Build failed = Build.builder()
                .id(32L)
                .site(site)
                .status(Build.Status.FAILED)
                .triggeredBy("user:7")
                .build();
        when(buildRepository.findFirstBySiteIdOrderByCreatedAtDesc(11L))
                .thenReturn(Optional.of(failed));

        var result = buildService.getLatestBuild(11L);

        assertThat(result.id()).isEqualTo(32L);
        assertThat(result.status()).isEqualTo("FAILED");
        verify(buildRepository).findFirstBySiteIdOrderByCreatedAtDesc(11L);
        verify(buildRepository, never())
                .findFirstBySiteIdAndStatusOrderByCreatedAtDesc(anyLong(), any());
    }

    private static class SuccessfulCorporateBuildStrategy implements BuildStrategy {
        @Override
        public Site.SiteType getSiteType() {
            return Site.SiteType.CORPORATE;
        }

        @Override
        public String build(Site site) {
            return "https://chunchang.xiao9.com";
        }
    }
}
