package com.website.controller.admin;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.website.entity.CmsTemplate;
import com.website.result.Result;
import com.website.service.CmsTemplateService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 后台模板管理控制器
 */
@RestController
@RequestMapping("/admin/template")
@Api(tags = "后台-模板管理接口")
public class TemplateController {

    @Resource
    private CmsTemplateService templateService;

    @GetMapping("/page")
    @ApiOperation("分页查询模板列表")
    public Result<Page<CmsTemplate>> pageTemplate(@RequestParam(defaultValue = "1") Integer pageNum,
                                                  @RequestParam(defaultValue = "10") Integer pageSize,
                                                  @RequestParam(required = false) Integer templateType) {
        Page<CmsTemplate> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<CmsTemplate> queryWrapper = new LambdaQueryWrapper<>();
        if (templateType != null) {
            queryWrapper.eq(CmsTemplate::getTemplateType, templateType);
        }
        queryWrapper.orderByDesc(CmsTemplate::getIsDefault)
                .orderByDesc(CmsTemplate::getCreateTime);
        Page<CmsTemplate> templatePage = templateService.page(page, queryWrapper);
        return Result.success(templatePage);
    }

    @GetMapping("/list/enabled")
    @ApiOperation("获取启用的模板列表")
    public Result<List<CmsTemplate>> listEnabledTemplates() {
        List<CmsTemplate> templates = templateService.listEnabledTemplates();
        return Result.success(templates);
    }

    @GetMapping("/{id}")
    @ApiOperation("获取模板详情")
    public Result<CmsTemplate> getTemplate(@PathVariable Long id) {
        CmsTemplate template = templateService.getById(id);
        return Result.success(template);
    }

    @PostMapping
    @ApiOperation("新增模板")
    public Result<Boolean> addTemplate(@RequestBody CmsTemplate template) {
        // 检查模板编码是否存在
        LambdaQueryWrapper<CmsTemplate> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(CmsTemplate::getTemplateCode, template.getTemplateCode());
        CmsTemplate existTemplate = templateService.getOne(queryWrapper);
        if (existTemplate != null) {
            return Result.fail("模板编码已存在");
        }
        
        template.setCreateTime(LocalDateTime.now());
        template.setUpdateTime(LocalDateTime.now());
        template.setIsDefault(false);
        template.setStatus(1);
        boolean success = templateService.save(template);
        return Result.success(success);
    }

    @PutMapping
    @ApiOperation("修改模板")
    public Result<Boolean> updateTemplate(@RequestBody CmsTemplate template) {
        template.setUpdateTime(LocalDateTime.now());
        boolean success = templateService.updateById(template);
        return Result.success(success);
    }

    @DeleteMapping("/{id}")
    @ApiOperation("删除模板")
    public Result<Boolean> deleteTemplate(@PathVariable Long id) {
        CmsTemplate template = templateService.getById(id);
        if (template != null && template.getIsDefault()) {
            return Result.fail("默认模板不能删除");
        }
        boolean success = templateService.removeById(id);
        return Result.success(success);
    }

    @PostMapping("/set-default/{id}")
    @ApiOperation("设置为默认模板")
    public Result<Boolean> setDefaultTemplate(@PathVariable Long id) {
        boolean success = templateService.setDefaultTemplate(id);
        return Result.success(success);
    }

    @PostMapping("/copy/{id}")
    @ApiOperation("复制模板")
    public Result<CmsTemplate> copyTemplate(@PathVariable Long id, @RequestParam String newName) {
        CmsTemplate template = templateService.copyTemplate(id, newName);
        return Result.success(template);
    }

    @PutMapping("/{id}/status")
    @ApiOperation("修改模板状态")
    public Result<Boolean> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        CmsTemplate template = templateService.getById(id);
        if (template != null && template.getIsDefault() && status == 0) {
            return Result.fail("默认模板不能禁用");
        }
        CmsTemplate updateTemplate = new CmsTemplate();
        updateTemplate.setId(id);
        updateTemplate.setStatus(status);
        updateTemplate.setUpdateTime(LocalDateTime.now());
        boolean success = templateService.updateById(updateTemplate);
        return Result.success(success);
    }
}
