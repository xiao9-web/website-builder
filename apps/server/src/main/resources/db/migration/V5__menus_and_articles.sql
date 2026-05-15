-- ============================================================
-- V5: Editable site menus and menu-scoped articles
-- Adds CMS-style navigation columns with up to three levels and
-- lets news/articles belong to a menu.
-- ============================================================

CREATE TABLE IF NOT EXISTS site_menus (
    id              BIGSERIAL PRIMARY KEY,
    site_id         BIGINT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    parent_id       BIGINT REFERENCES site_menus(id) ON DELETE CASCADE,
    label           VARCHAR(100) NOT NULL,
    slug            VARCHAR(120) NOT NULL,
    menu_type       VARCHAR(20) NOT NULL DEFAULT 'CUSTOM',
    sort_order      INTEGER NOT NULL DEFAULT 0,
    visible         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(site_id, slug)
);

ALTER TABLE news
    ADD COLUMN IF NOT EXISTS menu_id BIGINT REFERENCES site_menus(id) ON DELETE SET NULL;

DO $$
DECLARE
    v_site RECORD;
    v_home_id BIGINT;
BEGIN
    FOR v_site IN SELECT id FROM sites LOOP
        INSERT INTO site_menus (
            site_id,
            parent_id,
            label,
            slug,
            menu_type,
            sort_order,
            visible
        )
        SELECT
            v_site.id,
            NULL,
            '首页',
            'home',
            'HOME',
            0,
            TRUE
        WHERE NOT EXISTS (
            SELECT 1 FROM site_menus WHERE site_id = v_site.id AND slug = 'home'
        );

        SELECT id INTO v_home_id
        FROM site_menus
        WHERE site_id = v_site.id AND slug = 'home'
        LIMIT 1;

        INSERT INTO site_menus (site_id, parent_id, label, slug, menu_type, sort_order, visible)
        SELECT v_site.id, NULL, item.label, item.slug, 'CUSTOM', item.sort_order, TRUE
        FROM (
            VALUES
                ('产品服务', 'products', 10),
                ('关于我们', 'about', 20),
                ('最近动态', 'news', 30),
                ('合作机会', 'cooperation', 40),
                ('联系我们', 'contact', 50)
        ) AS item(label, slug, sort_order)
        WHERE NOT EXISTS (
            SELECT 1 FROM site_menus WHERE site_id = v_site.id AND slug = item.slug
        );
    END LOOP;
END $$;

CREATE INDEX IF NOT EXISTS idx_site_menus_site_parent_sort
    ON site_menus(site_id, parent_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_news_site_menu_status
    ON news(site_id, menu_id, status, created_at DESC);
