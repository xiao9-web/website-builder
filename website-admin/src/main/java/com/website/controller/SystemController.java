package com.website.controller;

import com.website.result.Result;
import com.website.service.CmsArticleService;
import com.website.service.SysMenuService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * 系统功能控制器
 */
@RestController
@RequestMapping("/system")
@Api(tags = "系统功能接口")
public class SystemController {

    @Resource
    private CmsArticleService articleService;

    @Resource
    private SysMenuService menuService;

    @Resource
    private RedissonClient redissonClient;

    /**
     * 网站发布缓存key
     */
    private static final String WEBSITE_PUBLISH_KEY = "website:publish:time";

    @PostMapping("/publish")
    @ApiOperation("发布网站更新")
    public Result<Long> publishWebsite() {
        // 清除所有相关缓存
        // 1. 清除文章缓存
        // 2. 清除菜单缓存
        // 3. 清除系统配置缓存
        articleService.publishWebsite();
        
        // 返回最新的发布时间戳
        RBucket<Long> publishBucket = redissonClient.getBucket(WEBSITE_PUBLISH_KEY);
        return Result.success(publishBucket.get());
    }

    @PostMapping("/clear-cache")
    @ApiOperation("清除所有缓存")
    public Result<Void> clearCache() {
        // 清除所有Redis缓存
        redissonClient.getKeys().flushdb();
        return Result.success();
    }

    @GetMapping("/publish-time")
    @ApiOperation("获取网站最新发布时间")
    public Result<Long> getPublishTime() {
        RBucket<Long> publishBucket = redissonClient.getBucket(WEBSITE_PUBLISH_KEY);
        Long time = publishBucket.get();
        return Result.success(time != null ? time : 0L);
    }
}
