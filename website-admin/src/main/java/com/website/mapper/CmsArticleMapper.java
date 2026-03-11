package com.website.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.website.entity.CmsArticle;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 文章Mapper
 */
@Mapper
public interface CmsArticleMapper extends BaseMapper<CmsArticle> {

    /**
     * 增加点击量
     */
    int increaseClickCount(@Param("id") Long id);
}
