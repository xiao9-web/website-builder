package com.xiao9.wb.common.exception;

import com.xiao9.wb.common.response.ApiResponse;
import lombok.Getter;

@Getter
public enum ErrorCode implements ApiResponse.ErrorCodeAware {

    // Common
    INTERNAL_ERROR(500, "Internal server error"),
    BAD_REQUEST(400, "Bad request"),
    UNAUTHORIZED(401, "Unauthorized"),
    FORBIDDEN(403, "Forbidden"),
    NOT_FOUND(404, "Resource not found"),
    RATE_LIMITED(429, "Too many requests"),

    // Auth
    INVALID_CREDENTIALS(1001, "Invalid email or password"),
    EMAIL_ALREADY_EXISTS(1002, "Email already registered"),
    TOKEN_EXPIRED(1003, "Token has expired"),
    TOKEN_INVALID(1004, "Invalid token"),
    REFRESH_TOKEN_EXPIRED(1005, "Refresh token has expired"),

    // User
    USER_NOT_FOUND(2001, "User not found"),
    USER_DISABLED(2002, "User account is disabled"),

    // Template
    TEMPLATE_NOT_FOUND(3001, "Template not found"),
    TEMPLATE_SCHEMA_INVALID(3002, "Template schema is invalid"),
    TEMPLATE_VERSION_NOT_FOUND(3003, "Template version not found"),

    // Site
    SITE_NOT_FOUND(4001, "Site not found"),
    SITE_BUILD_FAILED(4002, "Site build failed"),
    SITE_DOMAIN_TAKEN(4003, "Domain is already in use"),

    // Media
    MEDIA_NOT_FOUND(5001, "Media not found"),
    MEDIA_UPLOAD_FAILED(5002, "Media upload failed"),
    MEDIA_TYPE_NOT_SUPPORTED(5003, "Media type not supported");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
