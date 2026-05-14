-- ============================================================
-- V3: Align MVP Schema
-- Adds missing BE-001 MVP tables, columns, and lookup indexes.
-- PostgreSQL-compatible and idempotent for existing V1/V2 schemas.
-- ============================================================

-- Existing table extensions
ALTER TABLE sites
    ADD COLUMN IF NOT EXISTS slug VARCHAR(100),
    ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;

ALTER TABLE templates
    ADD COLUMN IF NOT EXISTS code VARCHAR(100);

ALTER TABLE site_configs
    ADD COLUMN IF NOT EXISTS brand_config JSONB,
    ADD COLUMN IF NOT EXISTS content_config JSONB;

-- Product/service content for corporate sites
CREATE TABLE IF NOT EXISTS product_services (
    id              BIGSERIAL PRIMARY KEY,
    site_id         BIGINT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    summary         VARCHAR(500) NOT NULL,
    description     TEXT,
    image_url       VARCHAR(500),
    scenarios       JSONB,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Site news and announcements
CREATE TABLE IF NOT EXISTS news (
    id              BIGSERIAL PRIMARY KEY,
    site_id         BIGINT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    slug            VARCHAR(150) NOT NULL,
    summary         VARCHAR(500),
    content         TEXT,
    category        VARCHAR(50),
    cover_image     VARCHAR(500),
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    published_at    TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(site_id, slug)
);

-- Public visitor lead submissions
CREATE TABLE IF NOT EXISTS leads (
    id               BIGSERIAL PRIMARY KEY,
    site_id          BIGINT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name             VARCHAR(100) NOT NULL,
    phone            VARCHAR(50) NOT NULL,
    company_name     VARCHAR(150),
    cooperation_type VARCHAR(100),
    message          TEXT NOT NULL,
    source_page      VARCHAR(500),
    status           VARCHAR(20) NOT NULL DEFAULT 'NEW',
    created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Safe constraints for phase-one status values. DO blocks keep the migration
-- re-runnable in local databases that may already have these constraints.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_news_status'
    ) THEN
        ALTER TABLE news
            ADD CONSTRAINT chk_news_status
            CHECK (status IN ('DRAFT', 'PUBLISHED', 'OFFLINE'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_leads_status'
    ) THEN
        ALTER TABLE leads
            ADD CONSTRAINT chk_leads_status
            CHECK (status IN ('NEW', 'CONTACTED', 'CLOSED', 'INVALID'));
    END IF;
END $$;

-- Lookup indexes required by BE-001
CREATE INDEX IF NOT EXISTS idx_sites_slug ON sites(slug);
CREATE UNIQUE INDEX IF NOT EXISTS ux_sites_slug ON sites(slug) WHERE slug IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ux_templates_code ON templates(code) WHERE code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_templates_code ON templates(code);

CREATE INDEX IF NOT EXISTS idx_product_services_site_enabled_sort
    ON product_services(site_id, enabled, sort_order);

CREATE INDEX IF NOT EXISTS idx_news_site_status_slug
    ON news(site_id, status, slug);

CREATE INDEX IF NOT EXISTS idx_leads_site_status_created
    ON leads(site_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_builds_site_created
    ON builds(site_id, created_at DESC);
