package com.website.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.website.entity.CmsArticle;
import com.website.mapper.CmsArticleMapper;
import com.website.service.CmsArticleService;
import com.website.utils.SensitiveWordFilter;
import com.website.vo.ArticleQueryVO;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

/**
 * 文章服务实现类
 */
@Service
public class CmsArticleServiceImpl extends ServiceImpl<CmsArticleMapper, CmsArticle> implements CmsArticleService {

    @Resource
    private RedissonClient redissonClient;

    @Resource
    private SensitiveWordFilter sensitiveWordFilter;

    /**
     * 文章缓存前缀
     */
    private static final String ARTICLE_CACHE_PREFIX = "article:detail:";
    
    /**
     * 网站发布缓存key
     */
    private static final String WEBSITE_PUBLISH_KEY = "website:publish:time";

    /**
     * 缓存过期时间，单位小时
     */
    private static final int CACHE_EXPIRE_HOURS = 24;

    @Override
    public Page<CmsArticle> pageArticle(ArticleQueryVO queryVO) {
        Page<CmsArticle> page = new Page<>(queryVO.getPageNum(), queryVO.getPageSize());
        LambdaQueryWrapper<CmsArticle> queryWrapper = new LambdaQueryWrapper<>();
        
        // 条件查询
        if (StringUtils.hasText(queryVO.getTitle())) {
            queryWrapper.like(CmsArticle::getTitle, queryVO.getTitle());
        }
        if (queryVO.getCategoryId() != null) {
            queryWrapper.eq(CmsArticle::getCategoryId, queryVO.getCategoryId());
        }
        if (queryVO.getStatus() != null) {
            queryWrapper.eq(CmsArticle::getStatus, queryVO.getStatus());
        }
        if (queryVO.getIsTop() != null) {
            queryWrapper.eq(CmsArticle::getIsTop, queryVO.getIsTop());
        }
        if (queryVO.getIsRecommend() != null) {
            queryWrapper.eq(CmsArticle::getIsRecommend, queryVO.getIsRecommend());
        }
        
        // 排序：置顶在前，然后按发布时间倒序
        queryWrapper.orderByDesc(CmsArticle::getIsTop)
                .orderByDesc(CmsArticle::getPublishTime)
                .orderByDesc(CmsArticle::getCreateTime);
        
        return baseMapper.selectPage(page, queryWrapper);
    }

    @Override
    public Page<CmsArticle> pagePublishedArticle(ArticleQueryVO queryVO) {
        Page<CmsArticle> page = new Page<>(queryVO.getPageNum(), queryVO.getPageSize());
        LambdaQueryWrapper<CmsArticle> queryWrapper = new LambdaQueryWrapper<>();
        
        // 只查询已发布的文章
        queryWrapper.eq(CmsArticle::getStatus, 1);
        
        if (queryVO.getCategoryId() != null) {
            queryWrapper.eq(CmsArticle::getCategoryId, queryVO.getCategoryId());
        }
        if (StringUtils.hasText(queryVO.getKeyword())) {
            queryWrapper.and(wrapper -> 
                    wrapper.like(CmsArticle::getTitle, queryVO.getKeyword())
                            .or().like(CmsArticle::getSummary, queryVO.getKeyword())
                            .or().like(CmsArticle::getContent, queryVO.getKeyword())
            );
        }
        if (queryVO.getIsRecommend() != null) {
            queryWrapper.eq(CmsArticle::getIsRecommend, queryVO.getIsRecommend());
        }
        
        // 排序：置顶在前，然后按发布时间倒序
        queryWrapper.orderByDesc(CmsArticle::getIsTop)
                .orderByDesc(CmsArticle::getPublishTime);
        
        return baseMapper.selectPage(page, queryWrapper);
    }

    @Override
    public CmsArticle getArticleDetail(Long id) {
        // 先查缓存
        String cacheKey = ARTICLE_CACHE_PREFIX + id;
        RBucket<CmsArticle> bucket = redissonClient.getBucket(cacheKey);
        if (bucket.isExists()) {
            // 异步增加点击量，不影响主流程
            baseMapper.increaseClickCount(id);
            return bucket.get();
        }
        
        // 缓存不存在，查数据库
        CmsArticle article = baseMapper.selectById(id);
        if (article != null && article.getStatus() == 1) {
            // 增加点击量
            baseMapper.increaseClickCount(id);
            article.setClickCount(article.getClickCount() + 1);
            
            // 存入缓存
            bucket.set(article, CACHE_EXPIRE_HOURS, TimeUnit.HOURS);
        }
        
        return article;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean publishArticle(Long id) {
        CmsArticle article = baseMapper.selectById(id);
        if (article == null) {
            return false;
        }
        
        // 敏感词检查
        if (sensitiveWordFilter.containsSensitiveWord(article.getTitle()) 
                || sensitiveWordFilter.containsSensitiveWord(article.getContent())) {
            throw new RuntimeException("文章包含敏感词，请修改后再发布");
        }
        
        article.setStatus(1);
        article.setPublishTime(LocalDateTime.now());
        boolean success = baseMapper.updateById(article) > 0;
        
        if (success) {
            // 刷新缓存
            refreshArticleCache(id);
            // 触发网站更新
            publishWebsite();
        }
        
        return success;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean offlineArticle(Long id) {
        CmsArticle article = new CmsArticle();
        article.setId(id);
        article.setStatus(2);
        boolean success = baseMapper.updateById(article) > 0;
        
        if (success) {
            // 删除缓存
            deleteArticleCache(id);
            // 触发网站更新
            publishWebsite();
        }
        
        return success;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean setTop(Long id, Integer isTop) {
        CmsArticle article = new CmsArticle();
        article.setId(id);
        article.setIsTop(isTop);
        boolean success = baseMapper.updateById(article) > 0;
        
        if (success) {
            // 刷新缓存
            refreshArticleCache(id);
            // 触发网站更新
            publishWebsite();
        }
        
        return success;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean setRecommend(Long id, Integer isRecommend) {
        CmsArticle article = new CmsArticle();
        article.setId(id);
        article.setIsRecommend(isRecommend);
        boolean success = baseMapper.updateById(article) > 0;
        
        if (success) {
            // 刷新缓存
            refreshArticleCache(id);
            // 触发网站更新
            publishWebsite();
        }
        
        return success;
    }

    @Override
    public void refreshArticleCache(Long id) {
        // 删除旧缓存
        deleteArticleCache(id);
        // 重新查询并存入缓存
        CmsArticle article = baseMapper.selectById(id);
        if (article != null && article.getStatus() == 1) {
            String cacheKey = ARTICLE_CACHE_PREFIX + id;
            RBucket<CmsArticle> bucket = redissonClient.getBucket(cacheKey);
            bucket.set(article, CACHE_EXPIRE_HOURS, TimeUnit.HOURS);
        }
    }

    @Override
    public void deleteArticleCache(Long id) {
        String cacheKey = ARTICLE_CACHE_PREFIX + id;
        redissonClient.getBucket(cacheKey).delete();
    }

    @Override
    public void publishWebsite() {
        // 更新网站发布时间戳，前端可以通过这个时间戳判断是否需要刷新页面
        RBucket<Long> publishBucket = redissonClient.getBucket(WEBSITE_PUBLISH_KEY);
        publishBucket.set(System.currentTimeMillis(), 24, TimeUnit.HOURS);
        
        // 这里可以实现静态页面生成逻辑
        // 1. 清除首页、列表页等缓存
        // 2. 如果是静态化部署，调用静态页面生成器重新生成页面
        // 3. 通知CDN刷新缓存
        // 4. 可以通过WebSocket通知在线用户页面已更新
        
        System.out.println("网站已发布更新，时间戳：" + System.currentTimeMillis());
    }
}
