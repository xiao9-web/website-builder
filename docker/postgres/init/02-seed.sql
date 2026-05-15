-- ============================================================
-- Seed Data
-- ============================================================

-- Admin user (password: admin123)
INSERT INTO admin_user (username, password_hash)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

-- Fixed menu: home page
INSERT INTO menus (name, slug, is_fixed, sort_order)
VALUES ('首页', 'home', true, 0);

-- Default site settings
INSERT INTO site_settings (key, value) VALUES
    ('blog_name',        'My Blog'),
    ('blog_description', 'A personal tech blog'),
    ('theme_color',      '#3b82f6');
