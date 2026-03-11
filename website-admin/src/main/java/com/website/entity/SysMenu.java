package com.website.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 菜单实体类
 */
@Data
@TableName("sys_menu")
public class SysMenu implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private Long parentId;

    private String menuName;

    private String menuCode;

    private Integer menuType; // 0-目录，1-菜单，2-按钮

    private String path;

    private String component;

    private String perms;

    private String icon;

    private Integer sort;

    private Integer status;

    private Boolean isExternal; // 是否外链

    private Boolean isCache; // 是否缓存

    private Boolean visible; // 是否可见

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

    @TableLogic
    private Integer isDeleted;
}
