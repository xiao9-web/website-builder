package com.website.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 页面模板实体类
 */
@Data
@TableName("cms_template")
public class CmsTemplate implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String templateName; // 模板名称

    private String templateCode; // 模板编码，唯一标识

    private Integer templateType; // 模板类型：1-首页模板，2-列表页模板，3-详情页模板，4-自定义页面

    private String content; // 模板内容（HTML/Vue代码）

    private String config; // 模板配置（JSON格式，包含可配置项）

    private String previewImage; // 预览图

    private Boolean isDefault; // 是否默认模板

    private Integer status; // 0-禁用，1-启用

    private String remark; // 备注

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

    @TableLogic
    private Integer isDeleted;
}
