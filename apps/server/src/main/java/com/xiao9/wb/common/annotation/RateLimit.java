package com.xiao9.wb.common.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.concurrent.TimeUnit;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimit {

    /**
     * Maximum number of requests allowed within the time window.
     */
    int maxRequests() default 60;

    /**
     * Time window duration.
     */
    long window() default 1;

    /**
     * Time unit for the window.
     */
    TimeUnit timeUnit() default TimeUnit.MINUTES;

    /**
     * Key prefix for rate limiting. Defaults to the method name.
     */
    String key() default "";
}
