package com.website.controller.admin;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.website.entity.SysUser;
import com.website.result.Result;
import com.website.service.SysUserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.time.LocalDateTime;

/**
 * 后台用户管理控制器
 */
@RestController
@RequestMapping("/admin/user")
@Api(tags = "后台-用户管理接口")
public class SysUserController {

    @Resource
    private SysUserService userService;

    @GetMapping("/page")
    @ApiOperation("分页查询用户列表")
    public Result<Page<SysUser>> pageUser(@RequestParam(defaultValue = "1") Integer pageNum,
                                         @RequestParam(defaultValue = "10") Integer pageSize,
                                         @RequestParam(required = false) String username) {
        Page<SysUser> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<SysUser> queryWrapper = new LambdaQueryWrapper<>();
        if (username != null && !username.isEmpty()) {
            queryWrapper.like(SysUser::getUsername, username);
        }
        queryWrapper.orderByDesc(SysUser::getCreateTime);
        Page<SysUser> userPage = userService.page(page, queryWrapper);
        // 移除敏感信息
        userPage.getRecords().forEach(user -> user.setPassword(null));
        return Result.success(userPage);
    }

    @GetMapping("/{id}")
    @ApiOperation("获取用户详情")
    public Result<SysUser> getUser(@PathVariable Long id) {
        SysUser user = userService.getById(id);
        if (user != null) {
            user.setPassword(null);
        }
        return Result.success(user);
    }

    @PostMapping
    @ApiOperation("新增用户")
    public Result<Boolean> addUser(@RequestBody SysUser user) {
        // 检查用户名是否存在
        LambdaQueryWrapper<SysUser> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(SysUser::getUsername, user.getUsername());
        SysUser existUser = userService.getOne(queryWrapper);
        if (existUser != null) {
            return Result.fail("用户名已存在");
        }
        
        // 密码加密
        String encryptedPassword = DigestUtils.md5DigestAsHex(user.getPassword().getBytes());
        user.setPassword(encryptedPassword);
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        user.setStatus(1);
        
        boolean success = userService.save(user);
        return Result.success(success);
    }

    @PutMapping
    @ApiOperation("修改用户")
    public Result<Boolean> updateUser(@RequestBody SysUser user) {
        user.setUpdateTime(LocalDateTime.now());
        // 如果密码不为空，就修改密码
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            String encryptedPassword = DigestUtils.md5DigestAsHex(user.getPassword().getBytes());
            user.setPassword(encryptedPassword);
        } else {
            // 不修改密码
            user.setPassword(null);
        }
        boolean success = userService.updateById(user);
        return Result.success(success);
    }

    @DeleteMapping("/{id}")
    @ApiOperation("删除用户")
    public Result<Boolean> deleteUser(@PathVariable Long id) {
        // 不能删除超级管理员
        if (id == 1L) {
            return Result.fail("超级管理员不能删除");
        }
        boolean success = userService.removeById(id);
        return Result.success(success);
    }

    @PutMapping("/{id}/status")
    @ApiOperation("修改用户状态")
    public Result<Boolean> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        // 不能禁用超级管理员
        if (id == 1L && status == 0) {
            return Result.fail("超级管理员不能禁用");
        }
        SysUser user = new SysUser();
        user.setId(id);
        user.setStatus(status);
        user.setUpdateTime(LocalDateTime.now());
        boolean success = userService.updateById(user);
        return Result.success(success);
    }

    @PostMapping("/reset-password/{id}")
    @ApiOperation("重置密码")
    public Result<Boolean> resetPassword(@PathVariable Long id, @RequestParam String newPassword) {
        if (newPassword == null || newPassword.length() < 6) {
            return Result.fail("密码长度不能少于6位");
        }
        SysUser user = new SysUser();
        user.setId(id);
        String encryptedPassword = DigestUtils.md5DigestAsHex(newPassword.getBytes());
        user.setPassword(encryptedPassword);
        user.setUpdateTime(LocalDateTime.now());
        boolean success = userService.updateById(user);
        return Result.success(success);
    }
}
