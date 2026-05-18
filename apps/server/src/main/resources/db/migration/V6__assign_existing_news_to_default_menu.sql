-- ============================================================
-- V6: Assign Existing News To Default Menu
-- Keeps earlier seed/imported articles visible in the public
-- "最近动态" column once they are published.
-- ============================================================

UPDATE news n
SET menu_id = m.id
FROM site_menus m
WHERE n.site_id = m.site_id
  AND m.slug = 'news'
  AND n.menu_id IS NULL;
