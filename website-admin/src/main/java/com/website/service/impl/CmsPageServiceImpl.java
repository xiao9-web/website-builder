package com.website.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.website.entity.CmsPage;
import com.website.mapper.CmsPageMapper;
import com.website.service.CmsPageService;
import com.website.service.CmsArticleService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDateTime;

/**
 * 自定义页面服务实现类
 */
@Service
public class CmsPageServiceImpl extends ServiceImpl<CmsPageMapper, CmsPage> implements CmsPageService {

    @Resource
    private CmsArticleService articleService;

    @Override
    public Page<CmsPage> pagePage(Integer pageNum, Integer pageSize, String keyword) {
        Page<CmsPage> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<CmsPage> queryWrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            queryWrapper.like(CmsPage::getPageName, keyword)
                    .or().like(CmsPage::getTitle, keyword)
                    .or().like(CmsPage::getPageCode, keyword);
        }
        queryWrapper.orderByDesc(CmsPage::getCreateTime);
        return baseMapper.selectPage(page, queryWrapper);
    }

    @Override
    public CmsPage getByPageCode(String pageCode) {
        LambdaQueryWrapper<CmsPage> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(CmsPage::getPageCode, pageCode)
                .eq(CmsPage::getStatus, 1);
        return baseMapper.selectOne(queryWrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean publishPage(Long id) {
        CmsPage page = baseMapper.selectById(id);
        if (page == null) {
            return false;
        }
        
        page.setStatus(1);
        page.setPublishTime(LocalDateTime.now());
        page.setUpdateTime(LocalDateTime.now());
        boolean success = baseMapper.updateById(page) > 0;
        
        if (success) {
            // 发布成功，触发网站更新
            articleService.publishWebsite();
        }
        
        return success;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean offlinePage(Long id) {
        CmsPage page = new CmsPage();
        page.setId(id);
        page.setStatus(0);
        page.setUpdateTime(LocalDateTime.now());
        boolean success = baseMapper.updateById(page) > 0;
        
        if (success) {
            // 下架成功，触发网站更新
            articleService.publishWebsite();
        }
        
        return success;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CmsPage copyPage(Long id, String newName, String newCode) {
        CmsPage sourcePage = baseMapper.selectById(id);
        if (sourcePage == null) {
            return null;
        }
        
        // 检查pageCode是否已存在
        LambdaQueryWrapper<CmsPage> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(CmsPage::getPageCode, newCode);
        CmsPage existPage = baseMapper.selectOne(queryWrapper);
        if (existPage != null) {
            throw new RuntimeException("页面编码已存在");
        }
        
        CmsPage newPage = new CmsPage();
        BeanUtils.copyProperties(sourcePage, newPage);
        newPage.setId(null);
        newPage.setPageName(newName);
        newPage.setPageCode(newCode);
        newPage.setStatus(0); // 草稿状态
        newPage.setPublishTime(null);
        newPage.setCreateTime(LocalDateTime.now());
        newPage.setUpdateTime(LocalDateTime.now());
        newPage.setIsDeleted(0);
        
        baseMapper.insert(newPage);
        return newPage;
    }
}
