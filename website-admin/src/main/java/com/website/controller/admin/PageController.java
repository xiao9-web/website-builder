package com.website.controller.admin;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.website.entity.CmsPage;
import com.website.result.Result;
import com.website.service.CmsPageService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.time.LocalDateTime;

/**
 * 后台页面管理控制器
 */
@RestController
@RequestMapping("/admin/page")
@Api(tags = "后台-页面管理接口")
public class PageController {

    @Resource
    private CmsPageService pageService;

    @GetMapping("/page")
    @ApiOperation("分页查询页面列表")
    public Result<Page<CmsPage>> pagePage(@RequestParam(defaultValue = "1") Integer pageNum,
                                         @RequestParam(defaultValue = "10") Integer pageSize,
                                         @RequestParam(required = false) String keyword) {
        Page<CmsPage> page = pageService.pagePage(pageNum, pageSize, keyword);
        return Result.success(page);
    }

    @GetMapping("/{id}")
    @ApiOperation("获取页面详情")
    public Result<CmsPage> getPage(@PathVariable Long id) {
        CmsPage page = pageService.getById(id);
        return Result.success(page);
    }

    @GetMapping("/code/{pageCode}")
    @ApiOperation("根据编码获取页面详情")
    public Result<CmsPage> getPageByCode(@PathVariable String pageCode) {
        CmsPage page = pageService.getByPageCode(pageCode);
        return Result.success(page);
    }

    @PostMapping
    @ApiOperation("新增页面")
    public Result<Boolean> addPage(@RequestBody CmsPage page) {
        // 检查pageCode是否已存在
        CmsPage existPage = pageService.getByPageCode(page.getPageCode());
        if (existPage != null) {
            return Result.fail("页面编码已存在");
        }
        
        page.setCreateTime(LocalDateTime.now());
        page.setUpdateTime(LocalDateTime.now());
        page.setStatus(0); // 默认草稿
        boolean success = pageService.save(page);
        return Result.success(success);
    }

    @PutMapping
    @ApiOperation("修改页面")
    public Result<Boolean> updatePage(@RequestBody CmsPage page) {
        page.setUpdateTime(LocalDateTime.now());
        boolean success = pageService.updateById(page);
        return Result.success(success);
    }

    @DeleteMapping("/{id}")
    @ApiOperation("删除页面")
    public Result<Boolean> deletePage(@PathVariable Long id) {
        boolean success = pageService.removeById(id);
        return Result.success(success);
    }

    @PostMapping("/publish/{id}")
    @ApiOperation("发布页面")
    public Result<Boolean> publishPage(@PathVariable Long id) {
        boolean success = pageService.publishPage(id);
        return Result.success(success);
    }

    @PostMapping("/offline/{id}")
    @ApiOperation("下架页面")
    public Result<Boolean> offlinePage(@PathVariable Long id) {
        boolean success = pageService.offlinePage(id);
        return Result.success(success);
    }

    @PostMapping("/copy/{id}")
    @ApiOperation("复制页面")
    public Result<CmsPage> copyPage(@PathVariable Long id, 
                                    @RequestParam String newName, 
                                    @RequestParam String newCode) {
        CmsPage page = pageService.copyPage(id, newName, newCode);
        return Result.success(page);
    }
}
