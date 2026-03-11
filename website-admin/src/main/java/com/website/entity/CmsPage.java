package com.website.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 自定义页面实体类
 */
@Data
@TableName("cms_page")
public class CmsPage implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String pageName; // 页面名称

    private String pageCode; // 页面编码，URL路径

    private String title; // 页面标题

    private Long templateId; // 使用的模板ID

    private String content; // 页面自定义内容

    private String seoTitle; // SEO标题

    private String seoKeywords; // SEO关键词

    private String seoDescription; // SEO描述

    private Integer status; // 0-草稿，1-已发布

    private LocalDateTime publishTime; // 发布时间

    private Long createBy;

    private Long updateBy;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

    @TableLogic
    private Integer isDeleted;
}
