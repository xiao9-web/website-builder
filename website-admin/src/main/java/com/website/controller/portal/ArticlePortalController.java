package com.website.controller.portal;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.website.entity.CmsArticle;
import com.website.result.Result;
import com.website.service.CmsArticleService;
import com.website.vo.ArticleQueryVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

/**
 * 前台文章控制器
 */
@RestController
@RequestMapping("/portal/article")
@Api(tags = "前台-文章接口")
public class ArticlePortalController {

    @Resource
    private CmsArticleService articleService;

    @GetMapping("/page")
    @ApiOperation("分页查询文章列表")
    public Result<Page<CmsArticle>> pageArticle(ArticleQueryVO queryVO) {
        Page<CmsArticle> page = articleService.pagePublishedArticle(queryVO);
        return Result.success(page);
    }

    @GetMapping("/detail/{id}")
    @ApiOperation("获取文章详情")
    public Result<CmsArticle> getArticleDetail(@PathVariable Long id) {
        CmsArticle article = articleService.getArticleDetail(id);
        return Result.success(article);
    }

    @GetMapping("/recommend")
    @ApiOperation("获取推荐文章")
    public Result<Page<CmsArticle>> getRecommendArticles(@RequestParam(defaultValue = "1") Integer pageNum,
                                                          @RequestParam(defaultValue = "10") Integer pageSize) {
        ArticleQueryVO queryVO = new ArticleQueryVO();
        queryVO.setPageNum(pageNum);
        queryVO.setPageSize(pageSize);
        queryVO.setIsRecommend(1);
        Page<CmsArticle> page = articleService.pagePublishedArticle(queryVO);
        return Result.success(page);
    }

    @GetMapping("/hot")
    @ApiOperation("获取热门文章（按点击量排序）")
    public Result<Page<CmsArticle>> getHotArticles(@RequestParam(defaultValue = "1") Integer pageNum,
                                                   @RequestParam(defaultValue = "10") Integer pageSize) {
        ArticleQueryVO queryVO = new ArticleQueryVO();
        queryVO.setPageNum(pageNum);
        queryVO.setPageSize(pageSize);
        // 热门文章可以按点击量排序，这里简化处理，实际项目可以单独统计
        Page<CmsArticle> page = articleService.pagePublishedArticle(queryVO);
        return Result.success(page);
    }

    @GetMapping("/search")
    @ApiOperation("搜索文章")
    public Result<Page<CmsArticle>> searchArticle(@RequestParam String keyword,
                                                 @RequestParam(defaultValue = "1") Integer pageNum,
                                                 @RequestParam(defaultValue = "10") Integer pageSize) {
        ArticleQueryVO queryVO = new ArticleQueryVO();
        queryVO.setPageNum(pageNum);
        queryVO.setPageSize(pageSize);
        queryVO.setKeyword(keyword);
        Page<CmsArticle> page = articleService.pagePublishedArticle(queryVO);
        return Result.success(page);
    }
}
