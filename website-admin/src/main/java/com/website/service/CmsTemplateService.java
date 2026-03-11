package com.website.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.website.entity.CmsTemplate;

import java.util.List;

/**
 * 模板服务接口
 */
public interface CmsTemplateService extends IService<CmsTemplate> {

    /**
     * 获取启用的模板列表
     */
    List<CmsTemplate> listEnabledTemplates();

    /**
     * 获取默认模板
     */
    CmsTemplate getDefaultTemplate(Integer templateType);

    /**
     * 设置默认模板
     */
    boolean setDefaultTemplate(Long id);

    /**
     * 复制模板
     */
    CmsTemplate copyTemplate(Long id, String newName);
}
