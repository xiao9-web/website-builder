package com.website.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.website.entity.CmsTemplate;
import com.website.mapper.CmsTemplateMapper;
import com.website.service.CmsTemplateService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 模板服务实现类
 */
@Service
public class CmsTemplateServiceImpl extends ServiceImpl<CmsTemplateMapper, CmsTemplate> implements CmsTemplateService {

    @Override
    public List<CmsTemplate> listEnabledTemplates() {
        LambdaQueryWrapper<CmsTemplate> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(CmsTemplate::getStatus, 1)
                .orderByDesc(CmsTemplate::getIsDefault)
                .orderByAsc(CmsTemplate::getCreateTime);
        return baseMapper.selectList(queryWrapper);
    }

    @Override
    public CmsTemplate getDefaultTemplate(Integer templateType) {
        LambdaQueryWrapper<CmsTemplate> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(CmsTemplate::getTemplateType, templateType)
                .eq(CmsTemplate::getIsDefault, true)
                .eq(CmsTemplate::getStatus, 1);
        return baseMapper.selectOne(queryWrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean setDefaultTemplate(Long id) {
        CmsTemplate template = baseMapper.selectById(id);
        if (template == null) {
            return false;
        }
        
        // 先取消同类型的其他默认模板
        LambdaQueryWrapper<CmsTemplate> updateWrapper = new LambdaQueryWrapper<>();
        updateWrapper.eq(CmsTemplate::getTemplateType, template.getTemplateType())
                .eq(CmsTemplate::getIsDefault, true);
        CmsTemplate updateTemplate = new CmsTemplate();
        updateTemplate.setIsDefault(false);
        baseMapper.update(updateTemplate, updateWrapper);
        
        // 设置新的默认模板
        template.setIsDefault(true);
        template.setUpdateTime(LocalDateTime.now());
        return baseMapper.updateById(template) > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CmsTemplate copyTemplate(Long id, String newName) {
        CmsTemplate sourceTemplate = baseMapper.selectById(id);
        if (sourceTemplate == null) {
            return null;
        }
        
        CmsTemplate newTemplate = new CmsTemplate();
        BeanUtils.copyProperties(sourceTemplate, newTemplate);
        newTemplate.setId(null);
        newTemplate.setTemplateName(newName);
        newTemplate.setTemplateCode(sourceTemplate.getTemplateCode() + "_copy_" + System.currentTimeMillis());
        newTemplate.setIsDefault(false);
        newTemplate.setCreateTime(LocalDateTime.now());
        newTemplate.setUpdateTime(LocalDateTime.now());
        newTemplate.setIsDeleted(0);
        
        baseMapper.insert(newTemplate);
        return newTemplate;
    }
}
