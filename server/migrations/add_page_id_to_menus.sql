-- 添加 page_id 字段到 menus 表
ALTER TABLE `menus` ADD COLUMN `page_id` INT NULL AFTER `article_id`;
