-- 主题化CMS数据库设计
-- 创建日期：2026-04-08
-- 数据库：website_builder

-- ============================================
-- 1. 主题表（themes）
-- ============================================
CREATE TABLE IF NOT EXISTS themes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE COMMENT '主题标识：blog, enterprise',
  display_name VARCHAR(100) NOT NULL COMMENT '显示名称：博客主题、企业主题',
  description TEXT COMMENT '主题描述',
  preview_image VARCHAR(255) COMMENT '预览图URL',
  is_active BOOLEAN DEFAULT FALSE COMMENT '是否启用（只能有一个为true）',
  config JSON COMMENT '主题配置：颜色、字体等',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='主题表';

-- 插入初始主题数据
INSERT INTO themes (name, display_name, description, is_active, config) VALUES
('blog', '博客主题', '适合个人博客、技术文档的简洁主题', TRUE, JSON_OBJECT(
  'primaryColor', '#3b82f6',
  'fontFamily', 'system-ui, -apple-system, sans-serif',
  'headerStyle', 'minimal'
)),
('enterprise', '企业主题', '适合公司官网、产品展示的专业主题', FALSE, JSON_OBJECT(
  'primaryColor', '#1e40af',
  'fontFamily', 'system-ui, -apple-system, sans-serif',
  'headerStyle', 'professional'
));

-- ============================================
-- 2. 页面配置表（page_configs）
-- ============================================
CREATE TABLE IF NOT EXISTS page_configs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  theme_id INT NOT NULL COMMENT '关联主题ID',
  page_type VARCHAR(50) NOT NULL COMMENT '页面类型：home, about, contact, product_list',
  config JSON NOT NULL COMMENT '页面配置数据（JSON格式）',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE,
  UNIQUE KEY uk_theme_page (theme_id, page_type),
  INDEX idx_theme_id (theme_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='页面配置表';

-- 插入博客主题首页默认配置
INSERT INTO page_configs (theme_id, page_type, config) VALUES
(1, 'home', JSON_OBJECT(
  'siteTitle', '我的博客',
  'siteDescription', '记录技术与生活',
  'avatar', '',
  'socialLinks', JSON_ARRAY(
    JSON_OBJECT('platform', 'github', 'url', ''),
    JSON_OBJECT('platform', 'twitter', 'url', '')
  ),
  'featuredArticles', JSON_ARRAY()
));

-- 插入企业主题首页默认配置
INSERT INTO page_configs (theme_id, page_type, config) VALUES
(2, 'home', JSON_OBJECT(
  'carousel', JSON_OBJECT(
    'enabled', TRUE,
    'autoplay', TRUE,
    'interval', 5000,
    'images', JSON_ARRAY()
  ),
  'videoSection', JSON_OBJECT(
    'enabled', FALSE,
    'title', '公司介绍',
    'videoUrl', '',
    'description', ''
  ),
  'productSection', JSON_OBJECT(
    'enabled', TRUE,
    'title', '我们的产品',
    'productIds', JSON_ARRAY(),
    'displayCount', 6
  ),
  'contactSection', JSON_OBJECT(
    'enabled', TRUE,
    'address', '',
    'phone', '',
    'email', '',
    'mapCoordinates', JSON_OBJECT('lat', 0, 'lng', 0)
  )
));

-- ============================================
-- 3. 产品表（products）
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL COMMENT '产品名称',
  image VARCHAR(255) COMMENT '产品主图URL',
  description TEXT COMMENT '产品简介',
  content TEXT COMMENT '产品详细介绍（富文本）',
  category VARCHAR(100) COMMENT '产品分类',
  price DECIMAL(10, 2) COMMENT '产品价格',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态：上架/下架',
  sort_order INT DEFAULT 0 COMMENT '排序权重',
  view_count INT DEFAULT 0 COMMENT '浏览次数',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='产品表';

-- 插入示例产品数据
INSERT INTO products (name, image, description, category, price, status, sort_order) VALUES
('产品A', '', '这是产品A的简介', '分类1', 999.00, 'active', 1),
('产品B', '', '这是产品B的简介', '分类1', 1999.00, 'active', 2),
('产品C', '', '这是产品C的简介', '分类2', 2999.00, 'active', 3);

-- ============================================
-- 4. 媒体库表（media）
-- ============================================
CREATE TABLE IF NOT EXISTS media (
  id INT PRIMARY KEY AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL COMMENT '存储文件名（UUID）',
  original_name VARCHAR(255) NOT NULL COMMENT '原始文件名',
  file_path VARCHAR(500) NOT NULL COMMENT '文件路径',
  file_type ENUM('image', 'video', 'document') NOT NULL COMMENT '文件类型',
  mime_type VARCHAR(100) COMMENT 'MIME类型',
  file_size INT COMMENT '文件大小（字节）',
  width INT COMMENT '图片宽度',
  height INT COMMENT '图片高度',
  thumbnail_path VARCHAR(500) COMMENT '缩略图路径',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_file_type (file_type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='媒体库表';

-- ============================================
-- 5. 修改现有表（如果需要）
-- ============================================

-- 为 articles 表添加索引（如果还没有）
ALTER TABLE articles ADD INDEX IF NOT EXISTS idx_status (status);
ALTER TABLE articles ADD INDEX IF NOT EXISTS idx_created_at (created_at);

-- 为 menus 表添加索引（如果还没有）
ALTER TABLE menus ADD INDEX IF NOT EXISTS idx_parent_id (parent_id);
ALTER TABLE menus ADD INDEX IF NOT EXISTS idx_sort_order (sort_order);

-- ============================================
-- 6. 视图（可选）
-- ============================================

-- 创建活跃主题视图
CREATE OR REPLACE VIEW v_active_theme AS
SELECT
  id,
  name,
  display_name,
  description,
  preview_image,
  config
FROM themes
WHERE is_active = TRUE
LIMIT 1;

-- 创建产品统计视图
CREATE OR REPLACE VIEW v_product_stats AS
SELECT
  category,
  COUNT(*) as product_count,
  AVG(price) as avg_price,
  SUM(view_count) as total_views
FROM products
WHERE status = 'active'
GROUP BY category;

-- ============================================
-- 7. 存储过程
-- ============================================

-- 激活主题（确保只有一个主题被激活）
DELIMITER //
CREATE PROCEDURE sp_activate_theme(IN theme_id INT)
BEGIN
  -- 开启事务
  START TRANSACTION;

  -- 将所有主题设为未激活
  UPDATE themes SET is_active = FALSE;

  -- 激活指定主题
  UPDATE themes SET is_active = TRUE WHERE id = theme_id;

  -- 提交事务
  COMMIT;
END //
DELIMITER ;

-- ============================================
-- 8. 触发器
-- ============================================

-- 产品创建时自动设置排序
DELIMITER //
CREATE TRIGGER tr_product_before_insert
BEFORE INSERT ON products
FOR EACH ROW
BEGIN
  IF NEW.sort_order = 0 THEN
    SET NEW.sort_order = (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM products);
  END IF;
END //
DELIMITER ;

-- ============================================
-- 9. 数据完整性检查
-- ============================================

-- 确保只有一个主题被激活
-- （通过存储过程 sp_activate_theme 来保证）

-- ============================================
-- 10. 性能优化建议
-- ============================================

-- 为 JSON 字段创建虚拟列索引（MySQL 5.7+）
-- ALTER TABLE page_configs ADD COLUMN page_type_virtual VARCHAR(50)
--   AS (JSON_UNQUOTE(JSON_EXTRACT(config, '$.pageType'))) VIRTUAL;
-- CREATE INDEX idx_page_type_virtual ON page_configs(page_type_virtual);

-- ============================================
-- 11. 备份和恢复
-- ============================================

-- 备份命令（在终端执行）
-- mysqldump -u root -p website_builder > backup_$(date +%Y%m%d).sql

-- 恢复命令（在终端执行）
-- mysql -u root -p website_builder < backup_20260408.sql

-- ============================================
-- 12. 数据字典
-- ============================================

/*
表名：themes
说明：存储主题信息，包括主题配置和激活状态
主键：id
外键：无
索引：is_active

表名：page_configs
说明：存储每个主题的页面配置（JSON格式）
主键：id
外键：theme_id -> themes(id)
索引：theme_id, (theme_id, page_type)

表名：products
说明：存储产品信息
主键：id
外键：无
索引：status, category, sort_order

表名：media
说明：存储上传的媒体文件信息
主键：id
外键：无
索引：file_type, created_at
*/
