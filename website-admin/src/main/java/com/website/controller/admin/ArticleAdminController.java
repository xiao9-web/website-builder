package com.website.controller.admin;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.website.entity.CmsArticle;
import com.website.result.Result;
import com.website.service.CmsArticleService;
import com.website.utils.SensitiveWordFilter;
import com.website.vo.ArticleQueryVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.time.LocalDateTime;

/**
 * 后台文章管理控制器
 */
@RestController
@RequestMapping("/admin/article")
@Api(tags = "后台-文章管理接口")
public class ArticleAdminController {

    @Resource
    private CmsArticleService articleService;

    @Resource
    private SensitiveWordFilter sensitiveWordFilter;

    @GetMapping("/page")
    @ApiOperation("分页查询文章列表")
    public Result<Page<CmsArticle>> pageArticle(ArticleQueryVO queryVO) {
        Page<CmsArticle> page = articleService.pageArticle(queryVO);
        return Result.success(page);
    }

    @GetMapping("/{id}")
    @ApiOperation("获取文章详情")
    public Result<CmsArticle> getArticle(@PathVariable Long id) {
        CmsArticle article = articleService.getById(id);
        return Result.success(article);
    }

    @PostMapping
    @ApiOperation("新增文章")
    public Result<Boolean> addArticle(@RequestBody CmsArticle article) {
        // 敏感词检查
        if (sensitiveWordFilter.containsSensitiveWord(article.getTitle()) 
                || sensitiveWordFilter.containsSensitiveWord(article.getContent())) {
            return Result.fail("文章包含敏感词，请修改后提交");
        }
        
        article.setCreateTime(LocalDateTime.now());
        article.setUpdateTime(LocalDateTime.now());
        article.setClickCount(0);
        boolean success = articleService.save(article);
        return Result.success(success);
    }

    @PutMapping
    @ApiOperation("修改文章")
    public Result<Boolean> updateArticle(@RequestBody CmsArticle article) {
        // 敏感词检查
        if (sensitiveWordFilter.containsSensitiveWord(article.getTitle()) 
                || sensitiveWordFilter.containsSensitiveWord(article.getContent())) {
            return Result.fail("文章包含敏感词，请修改后提交");
        }
        
        article.setUpdateTime(LocalDateTime.now());
        boolean success = articleService.updateById(article);
        
        if (success && article.getStatus() == 1) {
            // 如果是已发布状态，更新后触发网站更新
            articleService.refreshArticleCache(article.getId());
        }
        
        return Result.success(success);
    }

    @DeleteMapping("/{id}")
    @ApiOperation("删除文章")
    public Result<Boolean> deleteArticle(@PathVariable Long id) {
        boolean success = articleService.removeById(id);
        if (success) {
            // 删除缓存
            articleService.deleteArticleCache(id);
        }
        return Result.success(success);
    }

    @PostMapping("/publish/{id}")
    @ApiOperation("发布文章")
    public Result<Boolean> publishArticle(@PathVariable Long id) {
        boolean success = articleService.publishArticle(id);
        return Result.success(success);
    }

    @PostMapping("/offline/{id}")
    @ApiOperation("下架文章")
    public Result<Boolean> offlineArticle(@PathVariable Long id) {
        boolean success = articleService.offlineArticle(id);
        return Result.success(success);
    }

    @PostMapping("/top/{id}")
    @ApiOperation("置顶/取消置顶")
    public Result<Boolean> setTop(@PathVariable Long id, @RequestParam Integer isTop) {
        boolean success = articleService.setTop(id, isTop);
        return Result.success(success);
    }

    @PostMapping("/recommend/{id}")
    @ApiOperation("推荐/取消推荐")
    public Result<Boolean> setRecommend(@PathVariable Long id, @RequestParam Integer isRecommend) {
        boolean success = articleService.setRecommend(id, isRecommend);
        return Result.success(success);
    }
}
