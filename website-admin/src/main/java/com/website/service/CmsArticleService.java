package com.website.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.website.entity.CmsArticle;
import com.website.vo.ArticleQueryVO;

/**
 * 文章服务接口
 */
public interface CmsArticleService extends IService<CmsArticle> {

    /**
     * 分页查询文章列表（后台）
     */
    Page<CmsArticle> pageArticle(ArticleQueryVO queryVO);

    /**
     * 分页查询已发布文章列表（前台）
     */
    Page<CmsArticle> pagePublishedArticle(ArticleQueryVO queryVO);

    /**
     * 获取文章详情（前台，增加点击量）
     */
    CmsArticle getArticleDetail(Long id);

    /**
     * 发布文章
     */
    boolean publishArticle(Long id);

    /**
     * 下架文章
     */
    boolean offlineArticle(Long id);

    /**
     * 置顶/取消置顶
     */
    boolean setTop(Long id, Integer isTop);

    /**
     * 推荐/取消推荐
     */
    boolean setRecommend(Long id, Integer isRecommend);

    /**
     * 刷新文章缓存
     */
    void refreshArticleCache(Long id);

    /**
     * 删除文章缓存
     */
    void deleteArticleCache(Long id);

    /**
     * 发布网站更新（清除所有缓存，触发页面刷新）
     */
    void publishWebsite();
}
