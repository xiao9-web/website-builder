package com.website.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.website.entity.CmsPage;

/**
 * 自定义页面服务接口
 */
public interface CmsPageService extends IService<CmsPage> {

    /**
     * 分页查询页面列表
     */
    Page<CmsPage> pagePage(Integer pageNum, Integer pageSize, String keyword);

    /**
     * 根据pageCode获取页面详情
     */
    CmsPage getByPageCode(String pageCode);

    /**
     * 发布页面
     */
    boolean publishPage(Long id);

    /**
     * 下架页面
     */
    boolean offlinePage(Long id);

    /**
     * 复制页面
     */
    CmsPage copyPage(Long id, String newName, String newCode);
}
