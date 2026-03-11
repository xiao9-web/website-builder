package com.website.controller;

import com.website.entity.SysUser;
import com.website.result.Result;
import com.website.security.JwtUtils;
import com.website.service.SysUserService;
import com.website.vo.LoginVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * 用户登录控制器
 */
@RestController
@RequestMapping("/sys/user")
@Api(tags = "管理员用户接口")
public class SysUserController {

    @Resource
    private SysUserService userService;

    @Resource
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    @ApiOperation("登录")
    public Result<Map<String, Object>> login(@RequestBody LoginVO loginVO, HttpServletRequest request) {
        SysUser user = userService.getByUsername(loginVO.getUsername());
        if (user == null) {
            return Result.fail("用户名不存在");
        }
        
        if (user.getStatus() == 0) {
            return Result.fail("用户已被禁用");
        }
        
        // 验证密码
        String encryptedPassword = DigestUtils.md5DigestAsHex(loginVO.getPassword().getBytes());
        if (!encryptedPassword.equals(user.getPassword())) {
            return Result.fail("密码错误");
        }
        
        // 生成token
        String token = jwtUtils.generateToken(user.getId(), user.getUsername());
        
        // 更新登录信息
        user.setLastLoginTime(java.time.LocalDateTime.now());
        user.setLastLoginIp(request.getRemoteAddr());
        userService.updateById(user);
        
        // 返回数据
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("userInfo", user);
        result.put("permissions", new String[]{"*"}); // 权限控制，简化处理
        
        return Result.success(result);
    }

    @GetMapping("/info")
    @ApiOperation("获取用户信息")
    public Result<SysUser> getUserInfo(@RequestHeader("Authorization") String token) {
        String username = jwtUtils.getUsernameFromToken(token.replace("Bearer ", ""));
        SysUser user = userService.getByUsername(username);
        user.setPassword(null);
        return Result.success(user);
    }

    @PostMapping("/logout")
    @ApiOperation("登出")
    public Result<Void> logout() {
        // 可以将token加入黑名单，这里简化处理
        return Result.success();
    }
}
