package com.website.controller.admin;

import com.website.entity.SysMenu;
import com.website.result.Result;
import com.website.service.SysMenuService;
import com.website.vo.RouterVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 后台菜单管理控制器
 */
@RestController
@RequestMapping("/admin/menu")
@Api(tags = "后台-菜单管理接口")
public class SysMenuController {

    @Resource
    private SysMenuService menuService;

    @GetMapping("/tree")
    @ApiOperation("获取菜单树")
    public Result<List<SysMenu>> getMenuTree() {
        List<SysMenu> menuTree = menuService.listMenuTree();
        return Result.success(menuTree);
    }

    @GetMapping("/routers")
    @ApiOperation("获取当前用户的路由")
    public Result<List<RouterVO>> getRouters() {
        // 简化处理，获取所有菜单
        List<SysMenu> menus = menuService.listByUserId(1L);
        List<RouterVO> routers = menuService.buildRouters(menus);
        return Result.success(routers);
    }

    @GetMapping("/{id}")
    @ApiOperation("获取菜单详情")
    public Result<SysMenu> getMenu(@PathVariable Long id) {
        SysMenu menu = menuService.getById(id);
        return Result.success(menu);
    }

    @PostMapping
    @ApiOperation("新增菜单")
    public Result<Boolean> addMenu(@RequestBody SysMenu menu) {
        boolean success = menuService.addMenu(menu);
        return Result.success(success);
    }

    @PutMapping
    @ApiOperation("修改菜单")
    public Result<Boolean> updateMenu(@RequestBody SysMenu menu) {
        boolean success = menuService.updateMenu(menu);
        return Result.success(success);
    }

    @DeleteMapping("/{id}")
    @ApiOperation("删除菜单")
    public Result<Boolean> deleteMenu(@PathVariable Long id) {
        boolean success = menuService.deleteMenu(id);
        return Result.success(success);
    }
}
