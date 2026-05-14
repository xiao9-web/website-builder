-- ============================================================
-- V4: Seed Corporate Site Template And Default Chunchang Data
-- Seeds the first real corporate-site instance without inventing
-- unverified company facts such as founding year, certifications,
-- production capacity, or customer names.
-- ============================================================

DO $$
DECLARE
    v_admin_id BIGINT;
    v_template_id BIGINT;
    v_site_id BIGINT;
    v_template_schema JSONB;
    v_brand_config JSONB;
    v_content_config JSONB;
BEGIN
    SELECT id INTO v_admin_id
    FROM users
    WHERE email = 'admin@xiao9.com'
    ORDER BY id
    LIMIT 1;

    IF v_admin_id IS NULL THEN
        RAISE EXCEPTION 'Default admin user admin@xiao9.com is required before seeding corporate-site data';
    END IF;

    v_template_schema := '{
        "type": "corporate-site",
        "version": 1,
        "sections": [
            {
                "id": "hero",
                "label": "首页首屏",
                "fields": {
                    "headline": {"type": "string", "required": true},
                    "subheadline": {"type": "text", "required": true},
                    "primaryCta": {"type": "string", "required": true},
                    "secondaryCta": {"type": "string", "required": false},
                    "image": {"type": "image", "required": false}
                }
            },
            {
                "id": "advantages",
                "label": "核心优势",
                "fields": {
                    "items": {"type": "list", "required": true}
                }
            },
            {
                "id": "products",
                "label": "产品服务",
                "fields": {
                    "source": {"type": "collection", "collection": "product_services"}
                }
            },
            {
                "id": "about",
                "label": "关于我们",
                "fields": {
                    "summary": {"type": "text", "required": true},
                    "image": {"type": "image", "required": false}
                }
            },
            {
                "id": "cooperation",
                "label": "合作机会",
                "fields": {
                    "title": {"type": "string", "required": true},
                    "description": {"type": "text", "required": true},
                    "items": {"type": "list", "required": true}
                }
            },
            {
                "id": "contact",
                "label": "联系我们",
                "fields": {
                    "phone": {"type": "string", "required": false},
                    "wechat": {"type": "string", "required": false},
                    "address": {"type": "string", "required": false},
                    "messageEnabled": {"type": "boolean", "required": true}
                }
            }
        ],
        "styles": {
            "primaryColor": "#2F7D4A",
            "secondaryColor": "#FFF8E7",
            "accentColor": "#D9A441",
            "fontFamily": "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
        }
    }'::jsonb;

    INSERT INTO templates (
        name,
        description,
        category,
        thumbnail,
        schema,
        status,
        current_version,
        author_id,
        code
    )
    SELECT
        '企业官网模板',
        '适用于食品、乳制品、制造业和渠道合作型企业的官网模板，重点支持产品展示、合作机会和留言获客。',
        'corporate',
        NULL,
        v_template_schema,
        'PUBLISHED',
        1,
        v_admin_id,
        'corporate-site'
    WHERE NOT EXISTS (
        SELECT 1 FROM templates WHERE code = 'corporate-site'
    );

    SELECT id INTO v_template_id
    FROM templates
    WHERE code = 'corporate-site'
    ORDER BY id
    LIMIT 1;

    UPDATE templates
    SET
        name = '企业官网模板',
        description = '适用于食品、乳制品、制造业和渠道合作型企业的官网模板，重点支持产品展示、合作机会和留言获客。',
        category = 'corporate',
        schema = v_template_schema,
        status = 'PUBLISHED',
        current_version = 1,
        updated_at = NOW()
    WHERE id = v_template_id;

    INSERT INTO template_versions (
        template_id,
        version,
        schema,
        changelog
    )
    SELECT
        v_template_id,
        1,
        v_template_schema,
        'Initial corporate-site template for phase-one MVP'
    WHERE NOT EXISTS (
        SELECT 1
        FROM template_versions
        WHERE template_id = v_template_id
          AND version = 1
    );

    INSERT INTO sites (
        name,
        description,
        domain,
        subdomain,
        status,
        site_type,
        owner_id,
        template_id,
        slug
    )
    SELECT
        '山东春昌食品科技股份有限公司官网',
        '山东春昌食品科技股份有限公司企业官网，面向食品加工、烘焙餐饮、经销批发和渠道合作客户。',
        NULL,
        'chunchang',
        'DRAFT',
        'CORPORATE',
        v_admin_id,
        v_template_id,
        'chunchang'
    WHERE NOT EXISTS (
        SELECT 1 FROM sites WHERE slug = 'chunchang'
    );

    SELECT id INTO v_site_id
    FROM sites
    WHERE slug = 'chunchang'
    ORDER BY id
    LIMIT 1;

    UPDATE sites
    SET
        name = '山东春昌食品科技股份有限公司官网',
        description = '山东春昌食品科技股份有限公司企业官网，面向食品加工、烘焙餐饮、经销批发和渠道合作客户。',
        subdomain = 'chunchang',
        site_type = 'CORPORATE',
        template_id = v_template_id,
        updated_at = NOW()
    WHERE id = v_site_id;

    v_brand_config := '{
        "companyName": "山东春昌食品科技股份有限公司",
        "shortName": "春昌食品科技",
        "logoUrl": null,
        "brandWords": ["绿色", "健康", "生态", "专业稳重", "简洁", "亲民"],
        "businessDirection": "黄油等乳制品相关产品与食品科技服务",
        "theme": {
            "primary": "#2F7D4A",
            "cream": "#FFF8E7",
            "butterGold": "#D9A441",
            "text": "#1F2933",
            "muted": "#64748B"
        }
    }'::jsonb;

    v_content_config := '{
        "hero": {
            "headline": "绿色健康乳制品供应与合作服务",
            "subheadline": "面向食品加工、烘焙餐饮、经销批发和渠道合作客户，提供黄油等乳制品相关产品与咨询合作服务。",
            "primaryCta": "电话咨询",
            "secondaryCta": "提交合作咨询",
            "imageUrl": null
        },
        "advantages": [
            {
                "title": "聚焦乳制品相关需求",
                "description": "围绕黄油等乳制品场景，帮助客户快速了解产品与合作方式。"
            },
            {
                "title": "服务企业采购与渠道合作",
                "description": "面向采购、批发、经销和长期合作需求，提供清晰的咨询入口。"
            },
            {
                "title": "绿色健康的品牌表达",
                "description": "网站视觉和内容突出生态、健康、专业、亲民的品牌气质。"
            }
        ],
        "about": {
            "summary": "山东春昌食品科技股份有限公司专注于黄油等乳制品相关产品与食品科技服务。网站当前内容为 MVP 默认资料，后续应根据企业真实资料补充公司介绍、工厂图片、资质证明和合作案例。",
            "imageUrl": null
        },
        "cooperation": {
            "title": "合作机会",
            "description": "欢迎食品加工、烘焙餐饮、经销批发和渠道合作客户留下需求，我们会根据产品、区域和合作方式进一步沟通。",
            "items": ["企业采购", "经销批发", "渠道合作", "产品咨询"]
        },
        "contact": {
            "phone": null,
            "wechat": null,
            "wechatQrUrl": null,
            "address": null,
            "messageEnabled": true,
            "notice": "电话、微信、地址和二维码等待企业真实资料补充。"
        },
        "seo": {
            "title": "山东春昌食品科技股份有限公司官网",
            "description": "山东春昌食品科技股份有限公司企业官网，提供黄油等乳制品相关产品、企业采购和渠道合作咨询。",
            "keywords": ["山东春昌食品科技", "黄油", "乳制品", "食品科技", "企业采购", "渠道合作"]
        }
    }'::jsonb;

    INSERT INTO site_configs (
        site_id,
        seo_config,
        theme_config,
        navigation_config,
        custom_config,
        brand_config,
        content_config
    )
    SELECT
        v_site_id,
        v_content_config -> 'seo',
        v_brand_config -> 'theme',
        '[
            {"label": "首页", "href": "/"},
            {"label": "产品服务", "href": "/products"},
            {"label": "关于我们", "href": "/about"},
            {"label": "最近动态", "href": "/news"},
            {"label": "合作机会", "href": "/cooperation"},
            {"label": "联系我们", "href": "/contact"}
        ]'::jsonb,
        jsonb_build_object(
            'mobileContactBar', true,
            'leadEntryPoints', jsonb_build_array('phone', 'wechat', 'message')
        ),
        v_brand_config,
        v_content_config
    WHERE NOT EXISTS (
        SELECT 1 FROM site_configs WHERE site_id = v_site_id
    );

    UPDATE site_configs
    SET
        seo_config = v_content_config -> 'seo',
        theme_config = v_brand_config -> 'theme',
        navigation_config = '[
            {"label": "首页", "href": "/"},
            {"label": "产品服务", "href": "/products"},
            {"label": "关于我们", "href": "/about"},
            {"label": "最近动态", "href": "/news"},
            {"label": "合作机会", "href": "/cooperation"},
            {"label": "联系我们", "href": "/contact"}
        ]'::jsonb,
        custom_config = jsonb_build_object(
            'mobileContactBar', true,
            'leadEntryPoints', jsonb_build_array('phone', 'wechat', 'message')
        ),
        brand_config = v_brand_config,
        content_config = v_content_config,
        updated_at = NOW()
    WHERE site_id = v_site_id;

    INSERT INTO product_services (
        site_id,
        name,
        summary,
        description,
        image_url,
        scenarios,
        sort_order,
        enabled
    )
    SELECT
        v_site_id,
        item.name,
        item.summary,
        item.description,
        NULL,
        item.scenarios::jsonb,
        item.sort_order,
        TRUE
    FROM (
        VALUES
            (
                '黄油产品',
                '适用于烘焙、餐饮和食品加工等场景的黄油相关产品咨询。',
                '用于展示黄油产品方向、适用场景和合作咨询入口。具体规格、包装和供应信息等待企业真实资料补充。',
                '["烘焙", "餐饮", "食品加工"]',
                10
            ),
            (
                '乳制品原料',
                '面向企业采购客户的乳制品原料相关服务。',
                '用于展示乳制品原料方向和企业采购咨询入口。具体产品清单、指标和供应条件等待企业真实资料补充。',
                '["企业采购", "食品生产", "产品研发"]',
                20
            ),
            (
                '企业采购服务',
                '帮助采购客户快速提交需求并建立业务沟通。',
                '用于承接企业客户的采购咨询、产品匹配和后续沟通。实际报价和合作条款以业务沟通为准。',
                '["采购咨询", "需求沟通", "长期供应"]',
                30
            ),
            (
                '渠道合作',
                '面向经销、批发和区域合作伙伴的合作咨询入口。',
                '用于承接经销批发、渠道拓展和合作机会咨询。合作区域、政策和条件等待企业真实资料补充。',
                '["经销批发", "区域合作", "渠道拓展"]',
                40
            )
    ) AS item(name, summary, description, scenarios, sort_order)
    WHERE NOT EXISTS (
        SELECT 1
        FROM product_services ps
        WHERE ps.site_id = v_site_id
          AND ps.name = item.name
    );

    INSERT INTO news (
        site_id,
        title,
        slug,
        summary,
        content,
        category,
        cover_image,
        status,
        published_at
    )
    SELECT
        v_site_id,
        item.title,
        item.slug,
        item.summary,
        item.content,
        item.category,
        NULL,
        'DRAFT',
        NULL
    FROM (
        VALUES
            (
                '官网内容资料待补充',
                'content-materials-needed',
                '请补充公司介绍、联系方式、产品图片、资质证明和合作案例等真实资料。',
                '这是一条后台占位动态，用于提醒运营人员补充企业真实资料。发布前请替换为真实公司动态。',
                '公司动态'
            ),
            (
                '产品规格资料待补充',
                'product-specs-needed',
                '请补充黄油等乳制品相关产品的真实规格、包装、应用场景和图片。',
                '这是一条后台占位动态，用于提醒运营人员补充真实产品资料。发布前请替换为真实产品知识内容。',
                '产品知识'
            )
    ) AS item(title, slug, summary, content, category)
    WHERE NOT EXISTS (
        SELECT 1
        FROM news n
        WHERE n.site_id = v_site_id
          AND n.slug = item.slug
    );
END $$;
