package com.xiao9.wb.common.annotation;

import com.xiao9.wb.common.exception.BusinessException;
import com.xiao9.wb.common.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.concurrent.TimeUnit;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class RateLimitAspect {

    private final RedisTemplate<String, Object> redisTemplate;

    @Around("@annotation(com.xiao9.wb.common.annotation.RateLimit)")
    public Object enforce(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RateLimit rateLimit = method.getAnnotation(RateLimit.class);

        String key = resolveKey(rateLimit, method);
        long windowMs = rateLimit.timeUnit().toMillis(rateLimit.window());

        String redisKey = "rate_limit:" + key;
        Long currentCount = redisTemplate.opsForValue().increment(redisKey);

        if (currentCount != null && currentCount == 1) {
            redisTemplate.expire(redisKey, windowMs, TimeUnit.MILLISECONDS);
        }

        if (currentCount != null && currentCount > rateLimit.maxRequests()) {
            log.warn("Rate limit exceeded for key: {}", redisKey);
            throw new BusinessException(ErrorCode.RATE_LIMITED);
        }

        return joinPoint.proceed();
    }

    private String resolveKey(RateLimit rateLimit, Method method) {
        String prefix = rateLimit.key().isEmpty() ? method.getName() : rateLimit.key();
        String clientIp = getClientIp();
        return prefix + ":" + clientIp;
    }

    private String getClientIp() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            return "unknown";
        }
        HttpServletRequest request = attrs.getRequest();
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isEmpty()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
