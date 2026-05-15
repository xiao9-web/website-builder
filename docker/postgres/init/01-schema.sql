-- ============================================================
-- Personal Blog Database Schema
-- ============================================================

-- 1. Admin User
CREATE TABLE admin_user (
    id            bigserial PRIMARY KEY,
    username      varchar(50)  NOT NULL UNIQUE,
    password_hash varchar(200) NOT NULL,
    refresh_token varchar(500),
    created_at    timestamp    DEFAULT now()
);

-- 2. Menus (self-referencing tree; menus ARE categories)
CREATE TABLE menus (
    id          bigserial    PRIMARY KEY,
    name        varchar(50)  NOT NULL,
    slug        varchar(50)  NOT NULL UNIQUE,
    description varchar(200),
    parent_id   bigint       REFERENCES menus(id) ON DELETE SET NULL,
    sort_order  int          DEFAULT 0,
    is_fixed    boolean      DEFAULT false,
    created_at  timestamp    DEFAULT now(),
    updated_at  timestamp    DEFAULT now()
);

CREATE INDEX idx_menus_parent_id ON menus(parent_id);

-- 3. Tags
CREATE TABLE tags (
    id         bigserial   PRIMARY KEY,
    name       varchar(50) NOT NULL UNIQUE,
    slug       varchar(50) NOT NULL UNIQUE,
    created_at timestamp   DEFAULT now()
);

-- 4. Articles
CREATE TABLE articles (
    id            bigserial    PRIMARY KEY,
    title         varchar(200) NOT NULL,
    slug          varchar(200) NOT NULL UNIQUE,
    content       text,
    excerpt       varchar(500),
    cover_image   varchar(500),
    status        varchar(20)  DEFAULT 'draft'
                  CHECK (status IN ('draft', 'published')),
    menu_id       bigint       REFERENCES menus(id) ON DELETE SET NULL,
    published_at  timestamp,
    created_at    timestamp    DEFAULT now(),
    updated_at    timestamp    DEFAULT now(),
    search_vector tsvector
);

CREATE INDEX idx_articles_search_vector ON articles USING GIN (search_vector);
CREATE INDEX idx_articles_status_published ON articles (status, published_at DESC);
CREATE INDEX idx_articles_menu_id ON articles (menu_id);

-- 5. Article-Tags junction
CREATE TABLE article_tags (
    article_id bigint NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    tag_id     bigint NOT NULL REFERENCES tags(id)     ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- 6. Comments (nested via parent_id)
CREATE TABLE comments (
    id         bigserial    PRIMARY KEY,
    article_id bigint       NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    parent_id  bigint       REFERENCES comments(id) ON DELETE CASCADE,
    nickname   varchar(50)  NOT NULL,
    email      varchar(100) NOT NULL,
    content    text         NOT NULL,
    status     varchar(20)  DEFAULT 'pending'
               CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at timestamp    DEFAULT now()
);

CREATE INDEX idx_comments_article_status ON comments (article_id, status);

-- 7. Media
CREATE TABLE media (
    id         bigserial    PRIMARY KEY,
    filename   varchar(200) NOT NULL,
    url        varchar(500) NOT NULL,
    mime_type  varchar(50)  NOT NULL,
    size       bigint       NOT NULL,
    created_at timestamp    DEFAULT now()
);

-- 8. Site Settings (key-value)
CREATE TABLE site_settings (
    key        varchar(50) PRIMARY KEY,
    value      text        NOT NULL,
    updated_at timestamp   DEFAULT now()
);

-- ============================================================
-- Trigger: auto-update search_vector on articles INSERT/UPDATE
-- Uses 'simple' config for Chinese compatibility (zhparser later)
-- ============================================================

CREATE OR REPLACE FUNCTION articles_search_vector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('simple', coalesce(NEW.title, '')), 'A') ||
        setweight(to_tsvector('simple', coalesce(NEW.content, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_articles_search_vector
    BEFORE INSERT OR UPDATE OF title, content ON articles
    FOR EACH ROW
    EXECUTE FUNCTION articles_search_vector_update();
