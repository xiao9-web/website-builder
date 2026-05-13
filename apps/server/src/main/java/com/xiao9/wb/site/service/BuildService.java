package com.xiao9.wb.site.service;

import com.xiao9.wb.common.exception.BusinessException;
import com.xiao9.wb.common.exception.ErrorCode;
import com.xiao9.wb.site.dto.BuildDTO;
import com.xiao9.wb.site.entity.Build;
import com.xiao9.wb.site.entity.Site;
import com.xiao9.wb.site.repository.BuildRepository;
import com.xiao9.wb.site.repository.SiteRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BuildService {

    private final BuildRepository buildRepository;
    private final SiteRepository siteRepository;
    private final Map<Site.SiteType, BuildStrategy> strategyMap;

    public BuildService(
            BuildRepository buildRepository,
            SiteRepository siteRepository,
            List<BuildStrategy> strategies
    ) {
        this.buildRepository = buildRepository;
        this.siteRepository = siteRepository;
        this.strategyMap = strategies.stream()
                .collect(Collectors.toMap(BuildStrategy::getSiteType, Function.identity()));
    }

    @Transactional
    public BuildDTO triggerBuild(Long siteId, String triggeredBy) {
        Site site = siteRepository.findById(siteId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SITE_NOT_FOUND));

        Build build = Build.builder()
                .site(site)
                .status(Build.Status.PENDING)
                .triggeredBy(triggeredBy)
                .build();
        buildRepository.save(build);

        site.setStatus(Site.Status.BUILDING);
        siteRepository.save(site);

        // Execute build asynchronously
        executeBuild(build.getId());

        return BuildDTO.from(build);
    }

    @Async
    @EventListener
    public void handleBuildTrigger(BuildTriggerEvent event) {
        Site site = event.getSite();
        log.info("Received build trigger event for site: {}", site.getId());
        triggerBuild(site.getId(), event.getTriggeredBy());
    }

    @Transactional
    public void executeBuild(Long buildId) {
        Build build = buildRepository.findById(buildId).orElse(null);
        if (build == null) return;

        Site site = build.getSite();
        long startTime = System.currentTimeMillis();

        build.setStatus(Build.Status.RUNNING);
        buildRepository.save(build);

        try {
            BuildStrategy strategy = strategyMap.get(site.getSiteType());
            if (strategy == null) {
                throw new IllegalStateException("No build strategy for site type: " + site.getSiteType());
            }

            String outputUrl = strategy.build(site);

            build.setStatus(Build.Status.SUCCESS);
            build.setOutputUrl(outputUrl);
            build.setDurationMs(System.currentTimeMillis() - startTime);
            build.setCompletedAt(LocalDateTime.now());
            build.setBuildLog("Build completed successfully");

            site.setStatus(Site.Status.PUBLISHED);
            siteRepository.save(site);

            log.info("Build {} completed successfully in {}ms", buildId, build.getDurationMs());
        } catch (Exception e) {
            build.setStatus(Build.Status.FAILED);
            build.setDurationMs(System.currentTimeMillis() - startTime);
            build.setCompletedAt(LocalDateTime.now());
            build.setBuildLog("Build failed: " + e.getMessage());

            site.setStatus(Site.Status.ERROR);
            siteRepository.save(site);

            log.error("Build {} failed for site {}", buildId, site.getId(), e);
        }

        buildRepository.save(build);
    }

    @Transactional(readOnly = true)
    public BuildDTO getLatestBuild(Long siteId) {
        return buildRepository.findFirstBySiteIdAndStatusOrderByCreatedAtDesc(siteId, Build.Status.SUCCESS)
                .map(BuildDTO::from)
                .orElse(null);
    }
}
