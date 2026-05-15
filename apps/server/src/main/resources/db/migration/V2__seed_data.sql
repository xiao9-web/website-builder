-- ============================================================
-- V2: Seed Data
-- Default admin user and sample templates
-- ============================================================

-- Insert default admin user
-- Password: admin123 (bcrypt hash)
INSERT INTO users (name, email, password, role, enabled)
VALUES (
    'Admin',
    'admin@xiao9.com',
    '$2a$10$G/oP36zRE0l.8F7vJEexB.mThAW9bfeQe36vJeHRfmM7ir2v..ko.',
    'ADMIN',
    TRUE
);

-- Insert sample template: blog-minimal
INSERT INTO templates (name, description, category, schema, status, current_version, author_id)
VALUES (
    'Minimal Blog',
    'A clean, minimalist blog template with focus on readability.',
    'blog',
    '{
        "type": "blog",
        "components": [
            {
                "id": "header",
                "type": "header",
                "props": {
                    "title": {"type": "string", "required": true},
                    "subtitle": {"type": "string"}
                }
            },
            {
                "id": "posts",
                "type": "collection",
                "props": {
                    "title": {"type": "string", "required": true},
                    "content": {"type": "markdown", "required": true},
                    "cover": {"type": "image"}
                }
            },
            {
                "id": "footer",
                "type": "footer",
                "props": {
                    "copyright": {"type": "string"}
                }
            }
        ],
        "styles": {
            "primaryColor": "#1a1a1a",
            "fontFamily": "Inter, sans-serif"
        }
    }'::jsonb,
    'PUBLISHED',
    1,
    1
);

INSERT INTO template_versions (template_id, version, schema, changelog)
VALUES (
    1,
    1,
    '{
        "type": "blog",
        "components": [
            {
                "id": "header",
                "type": "header",
                "props": {
                    "title": {"type": "string", "required": true},
                    "subtitle": {"type": "string"}
                }
            },
            {
                "id": "posts",
                "type": "collection",
                "props": {
                    "title": {"type": "string", "required": true},
                    "content": {"type": "markdown", "required": true},
                    "cover": {"type": "image"}
                }
            },
            {
                "id": "footer",
                "type": "footer",
                "props": {
                    "copyright": {"type": "string"}
                }
            }
        ],
        "styles": {
            "primaryColor": "#1a1a1a",
            "fontFamily": "Inter, sans-serif"
        }
    }'::jsonb,
    'Initial release'
);

-- Insert sample template: corporate-starter
INSERT INTO templates (name, description, category, schema, status, current_version, author_id)
VALUES (
    'Corporate Starter',
    'Professional corporate website template with hero section and services showcase.',
    'corporate',
    '{
        "type": "corporate",
        "components": [
            {
                "id": "hero",
                "type": "hero",
                "props": {
                    "headline": {"type": "string", "required": true},
                    "subheadline": {"type": "string"},
                    "ctaText": {"type": "string"},
                    "backgroundImage": {"type": "image"}
                }
            },
            {
                "id": "services",
                "type": "collection",
                "props": {
                    "title": {"type": "string", "required": true},
                    "description": {"type": "string", "required": true},
                    "icon": {"type": "string"}
                }
            },
            {
                "id": "contact",
                "type": "contact-form",
                "props": {
                    "email": {"type": "string"},
                    "phone": {"type": "string"}
                }
            }
        ],
        "styles": {
            "primaryColor": "#2563eb",
            "fontFamily": "Plus Jakarta Sans, sans-serif"
        }
    }'::jsonb,
    'PUBLISHED',
    1,
    1
);

INSERT INTO template_versions (template_id, version, schema, changelog)
VALUES (
    2,
    1,
    '{
        "type": "corporate",
        "components": [
            {
                "id": "hero",
                "type": "hero",
                "props": {
                    "headline": {"type": "string", "required": true},
                    "subheadline": {"type": "string"},
                    "ctaText": {"type": "string"},
                    "backgroundImage": {"type": "image"}
                }
            },
            {
                "id": "services",
                "type": "collection",
                "props": {
                    "title": {"type": "string", "required": true},
                    "description": {"type": "string", "required": true},
                    "icon": {"type": "string"}
                }
            },
            {
                "id": "contact",
                "type": "contact-form",
                "props": {
                    "email": {"type": "string"},
                    "phone": {"type": "string"}
                }
            }
        ],
        "styles": {
            "primaryColor": "#2563eb",
            "fontFamily": "Plus Jakarta Sans, sans-serif"
        }
    }'::jsonb,
    'Initial release'
);
