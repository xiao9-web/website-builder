package com.website.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 栏目分类实体类
 */
@Data
@TableName("cms_category")
public class CmsCategory implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private Long parentId;

    private String categoryName;

    private String categoryCode;

    private Integer categoryType; // 1-文章分类，2-产品分类

    private String description;

    private String coverImage;

    private Integer sort;

    private Integer status;

    private String seoTitle;

    private String seoKeywords;

    private String seoDescription;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

    @TableLogic
    private Integer isDeleted;
}
