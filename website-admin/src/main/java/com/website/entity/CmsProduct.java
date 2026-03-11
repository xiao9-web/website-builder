package com.website.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 产品实体类
 */
@Data
@TableName("cms_product")
public class CmsProduct implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String productName;

    private String productCode;

    private Long categoryId;

    private String coverImage;

    private String bannerImages; // 多张图片用逗号分隔

    private String summary;

    private String description;

    private BigDecimal price;

    private String specifications; // JSON格式的规格参数

    private String tags;

    private Integer clickCount;

    private Integer isTop;

    private Integer isRecommend;

    private Integer status; // 0-下架，1-上架

    private String seoTitle;

    private String seoKeywords;

    private String seoDescription;

    private Long createBy;

    private Long updateBy;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

    @TableLogic
    private Integer isDeleted;
}
