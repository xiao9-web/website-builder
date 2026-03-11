package com.website.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.website.entity.SysMenu;
import com.website.vo.RouterVO;

import java.util.List;

/**
 * 菜单服务接口
 */
public interface SysMenuService extends IService<SysMenu> {

    /**
     * 获取用户菜单列表
     */
    List<SysMenu> listByUserId(Long userId);

    /**
     * 构建前端路由
     */
    List<RouterVO> buildRouters(List<SysMenu> menus);

    /**
     * 获取菜单树
     */
    List<SysMenu> listMenuTree();

    /**
     * 新增菜单
     */
    boolean addMenu(SysMenu menu);

    /**
     * 修改菜单
     */
    boolean updateMenu(SysMenu menu);

    /**
     * 删除菜单
     */
    boolean deleteMenu(Long id);
}
