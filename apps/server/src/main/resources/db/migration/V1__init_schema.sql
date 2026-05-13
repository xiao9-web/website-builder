-- ============================================================
-- V1: Initial Schema
-- Website Builder Platform - Core Tables
-- ============================================================

-- Users table
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(50) NOT NULL,
    email           VARCHAR(100) UNIQUE NOT NULL,
    password        VARCHAR(255) NOT NULL,
    avatar          VARCHAR(255),
    role            VARCHAR(20) NOT NULL DEFAULT 'USER',
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Templates table
CREATE TABLE templates (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    description     VARCHAR(500),
    category        VARCHAR(50),
    thumbnail       VARCHAR(255),
    schema          JSONB,
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    current_version INTEGER NOT NULL DEFAULT 1,
    author_id       BIGINT NOT NULL REFERENCES users(id),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Template versions table
CREATE TABLE template_versions (
    id              BIGSERIAL PRIMARY KEY,
    template_id     BIGINT NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    version         INTEGER NOT NULL,
    schema          JSONB,
    changelog       VARCHAR(500),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(template_id, version)
);

-- Sites table
CREATE TABLE sites (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    description     VARCHAR(500),
    domain          VARCHAR(100) UNIQUE,
    subdomain       VARCHAR(100) UNIQUE,
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    site_type       VARCHAR(20) NOT NULL DEFAULT 'BLOG',
    owner_id        BIGINT NOT NULL REFERENCES users(id),
    template_id     BIGINT REFERENCES templates(id),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Site configs table
CREATE TABLE site_configs (
    id              BIGSERIAL PRIMARY KEY,
    site_id         BIGINT NOT NULL UNIQUE REFERENCES sites(id) ON DELETE CASCADE,
    seo_config      JSONB,
    theme_config    JSONB,
    navigation_config JSONB,
    custom_config   JSONB,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Builds table
CREATE TABLE builds (
    id              BIGSERIAL PRIMARY KEY,
    site_id         BIGINT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    output_url      VARCHAR(255),
    build_log       TEXT,
    duration_ms     BIGINT NOT NULL DEFAULT 0,
    triggered_by    VARCHAR(50),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMP
);

-- Media table
CREATE TABLE media (
    id              BIGSERIAL PRIMARY KEY,
    filename        VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    content_type    VARCHAR(100) NOT NULL,
    file_size       BIGINT NOT NULL,
    url             VARCHAR(500) NOT NULL,
    thumbnail_url   VARCHAR(500),
    storage_key     VARCHAR(100),
    uploaded_by     BIGINT NOT NULL REFERENCES users(id),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_templates_status ON templates(status);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_author ON templates(author_id);
CREATE INDEX idx_sites_owner ON sites(owner_id);
CREATE INDEX idx_sites_status ON sites(status);
CREATE INDEX idx_builds_site ON builds(site_id, status);
CREATE INDEX idx_builds_created ON builds(site_id, created_at DESC);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);
