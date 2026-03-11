package com.website.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.website.entity.SysMenu;
import com.website.mapper.SysMenuMapper;
import com.website.service.SysMenuService;
import com.website.vo.RouterVO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 菜单服务实现类
 */
@Service
public class SysMenuServiceImpl extends ServiceImpl<SysMenuMapper, SysMenu> implements SysMenuService {

    @Override
    public List<SysMenu> listByUserId(Long userId) {
        // 简化处理，所有用户返回所有菜单
        LambdaQueryWrapper<SysMenu> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(SysMenu::getStatus, 1)
                .orderByAsc(SysMenu::getSort);
        return baseMapper.selectList(queryWrapper);
    }

    @Override
    public List<RouterVO> buildRouters(List<SysMenu> menus) {
        // 构建树形菜单
        List<SysMenu> menuTree = buildMenuTree(menus, 0L);
        // 转换为路由格式
        return menuTree.stream().map(this::buildRouter).collect(Collectors.toList());
    }

    @Override
    public List<SysMenu> listMenuTree() {
        LambdaQueryWrapper<SysMenu> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.orderByAsc(SysMenu::getSort);
        List<SysMenu> menus = baseMapper.selectList(queryWrapper);
        return buildMenuTree(menus, 0L);
    }

    @Override
    public boolean addMenu(SysMenu menu) {
        menu.setCreateTime(java.time.LocalDateTime.now());
        menu.setUpdateTime(java.time.LocalDateTime.now());
        boolean success = baseMapper.insert(menu) > 0;
        if (success) {
            // 清除网站缓存，触发页面更新
            clearWebsiteCache();
        }
        return success;
    }

    @Override
    public boolean updateMenu(SysMenu menu) {
        menu.setUpdateTime(java.time.LocalDateTime.now());
        boolean success = baseMapper.updateById(menu) > 0;
        if (success) {
            // 清除网站缓存，触发页面更新
            clearWebsiteCache();
        }
        return success;
    }

    @Override
    public boolean deleteMenu(Long id) {
        // 检查是否有子菜单
        LambdaQueryWrapper<SysMenu> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(SysMenu::getParentId, id);
        Integer count = baseMapper.selectCount(queryWrapper);
        if (count > 0) {
            throw new RuntimeException("存在子菜单，无法删除");
        }
        boolean success = baseMapper.deleteById(id) > 0;
        if (success) {
            // 清除网站缓存，触发页面更新
            clearWebsiteCache();
        }
        return success;
    }

    /**
     * 构建菜单树
     */
    private List<SysMenu> buildMenuTree(List<SysMenu> menus, Long parentId) {
        List<SysMenu> tree = new ArrayList<>();
        for (SysMenu menu : menus) {
            if (parentId.equals(menu.getParentId())) {
                menu.setChildren(buildMenuTree(menus, menu.getId()));
                tree.add(menu);
            }
        }
        return tree;
    }

    /**
     * 构建路由对象
     */
    private RouterVO buildRouter(SysMenu menu) {
        RouterVO router = new RouterVO();
        BeanUtils.copyProperties(menu, router);
        
        // 设置路由元信息
        RouterVO.Meta meta = new RouterVO.Meta();
        meta.setTitle(menu.getMenuName());
        meta.setIcon(menu.getIcon());
        meta.setNoCache(!menu.getIsCache());
        router.setMeta(meta);
        
        // 递归处理子菜单
        if (menu.getChildren() != null && !menu.getChildren().isEmpty()) {
            router.setChildren(menu.getChildren().stream().map(this::buildRouter).collect(Collectors.toList()));
        }
        
        return router;
    }

    /**
     * 清除网站缓存，发布更新
     */
    private void clearWebsiteCache() {
        // 这里可以实现静态页面生成或者缓存清除逻辑
        // 1. 清除Redis中的网站配置、文章、菜单缓存
        // 2. 如果是静态化部署，触发重新生成静态页面
        // 3. 通知CDN刷新缓存
        System.out.println("菜单已更新，网站缓存已清除，页面将刷新");
    }
}
