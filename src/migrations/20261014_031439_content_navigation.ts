import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`videos\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`poster_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`videos_poster_idx\` ON \`videos\` (\`poster_id\`);`)
  await db.run(sql`CREATE INDEX \`videos_updated_at_idx\` ON \`videos\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`videos_created_at_idx\` ON \`videos\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`videos__status_idx\` ON \`videos\` (\`_status\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`videos_filename_idx\` ON \`videos\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`_videos_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_description\` text,
  	\`version_poster_id\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_url\` text,
  	\`version_thumbnail_u_r_l\` text,
  	\`version_filename\` text,
  	\`version_mime_type\` text,
  	\`version_filesize\` numeric,
  	\`version_width\` numeric,
  	\`version_height\` numeric,
  	\`version_focal_x\` numeric,
  	\`version_focal_y\` numeric,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_videos_v_parent_idx\` ON \`_videos_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_version_version_poster_idx\` ON \`_videos_v\` (\`version_poster_id\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_version_version_updated_at_idx\` ON \`_videos_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_version_version_created_at_idx\` ON \`_videos_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_version_version__status_idx\` ON \`_videos_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_version_version_filename_idx\` ON \`_videos_v\` (\`version_filename\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_created_at_idx\` ON \`_videos_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_updated_at_idx\` ON \`_videos_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_latest_idx\` ON \`_videos_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`menus\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`parent_id\` integer,
  	\`display_order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`menus\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`menus_slug_idx\` ON \`menus\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`menus_parent_idx\` ON \`menus\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`menus_updated_at_idx\` ON \`menus\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`menus_created_at_idx\` ON \`menus\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`menus__status_idx\` ON \`menus\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_menus_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_parent_id\` integer,
  	\`version_display_order\` numeric DEFAULT 0,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`menus\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_parent_id\`) REFERENCES \`menus\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_menus_v_parent_idx\` ON \`_menus_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_menus_v_version_version_slug_idx\` ON \`_menus_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_menus_v_version_version_parent_idx\` ON \`_menus_v\` (\`version_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_menus_v_version_version_updated_at_idx\` ON \`_menus_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_menus_v_version_version_created_at_idx\` ON \`_menus_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_menus_v_version_version__status_idx\` ON \`_menus_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_menus_v_created_at_idx\` ON \`_menus_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_menus_v_updated_at_idx\` ON \`_menus_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_menus_v_latest_idx\` ON \`_menus_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`articles\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`menu_id\` integer,
  	\`summary\` text,
  	\`cover_id\` integer,
  	\`content\` text,
  	\`is_demo\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`menu_id\`) REFERENCES \`menus\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`articles_slug_idx\` ON \`articles\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`articles_menu_idx\` ON \`articles\` (\`menu_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_cover_idx\` ON \`articles\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_updated_at_idx\` ON \`articles\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`articles_created_at_idx\` ON \`articles\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`articles__status_idx\` ON \`articles\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_menu_id\` integer,
  	\`version_summary\` text,
  	\`version_cover_id\` integer,
  	\`version_content\` text,
  	\`version_is_demo\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_menu_id\`) REFERENCES \`menus\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_parent_idx\` ON \`_articles_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_slug_idx\` ON \`_articles_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_menu_idx\` ON \`_articles_v\` (\`version_menu_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_cover_idx\` ON \`_articles_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_updated_at_idx\` ON \`_articles_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_created_at_idx\` ON \`_articles_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version__status_idx\` ON \`_articles_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_created_at_idx\` ON \`_articles_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_updated_at_idx\` ON \`_articles_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_latest_idx\` ON \`_articles_v\` (\`latest\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`videos_id\` integer REFERENCES videos(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`menus_id\` integer REFERENCES menus(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`articles_id\` integer REFERENCES articles(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_videos_id_idx\` ON \`payload_locked_documents_rels\` (\`videos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_menus_id_idx\` ON \`payload_locked_documents_rels\` (\`menus_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
  await db.run(sql`ALTER TABLE \`company\` ADD \`home_video_id\` integer REFERENCES videos(id);`)
  await db.run(sql`CREATE INDEX \`company_home_video_idx\` ON \`company\` (\`home_video_id\`);`)
  await db.run(sql`ALTER TABLE \`_company_v\` ADD \`version_home_video_id\` integer REFERENCES videos(id);`)
  await db.run(sql`CREATE INDEX \`_company_v_version_version_home_video_idx\` ON \`_company_v\` (\`version_home_video_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`videos\`;`)
  await db.run(sql`DROP TABLE \`_videos_v\`;`)
  await db.run(sql`DROP TABLE \`menus\`;`)
  await db.run(sql`DROP TABLE \`_menus_v\`;`)
  await db.run(sql`DROP TABLE \`articles\`;`)
  await db.run(sql`DROP TABLE \`_articles_v\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`products_id\` integer,
  	\`media_id\` integer,
  	\`inquiries_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`inquiries_id\`) REFERENCES \`inquiries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "products_id", "media_id", "inquiries_id") SELECT "id", "order", "parent_id", "path", "users_id", "products_id", "media_id", "inquiries_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_inquiries_id_idx\` ON \`payload_locked_documents_rels\` (\`inquiries_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_company\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`brand_name\` text,
  	\`company_name\` text,
  	\`headline\` text,
  	\`intro\` text,
  	\`business_scope\` text,
  	\`phone\` text,
  	\`email\` text,
  	\`address\` text,
  	\`hero_image_id\` integer,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_company\`("id", "brand_name", "company_name", "headline", "intro", "business_scope", "phone", "email", "address", "hero_image_id", "_status", "updated_at", "created_at") SELECT "id", "brand_name", "company_name", "headline", "intro", "business_scope", "phone", "email", "address", "hero_image_id", "_status", "updated_at", "created_at" FROM \`company\`;`)
  await db.run(sql`DROP TABLE \`company\`;`)
  await db.run(sql`ALTER TABLE \`__new_company\` RENAME TO \`company\`;`)
  await db.run(sql`CREATE INDEX \`company_hero_image_idx\` ON \`company\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`company__status_idx\` ON \`company\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__company_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_brand_name\` text,
  	\`version_company_name\` text,
  	\`version_headline\` text,
  	\`version_intro\` text,
  	\`version_business_scope\` text,
  	\`version_phone\` text,
  	\`version_email\` text,
  	\`version_address\` text,
  	\`version_hero_image_id\` integer,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__company_v\`("id", "version_brand_name", "version_company_name", "version_headline", "version_intro", "version_business_scope", "version_phone", "version_email", "version_address", "version_hero_image_id", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest") SELECT "id", "version_brand_name", "version_company_name", "version_headline", "version_intro", "version_business_scope", "version_phone", "version_email", "version_address", "version_hero_image_id", "version__status", "version_updated_at", "version_created_at", "created_at", "updated_at", "latest" FROM \`_company_v\`;`)
  await db.run(sql`DROP TABLE \`_company_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__company_v\` RENAME TO \`_company_v\`;`)
  await db.run(sql`CREATE INDEX \`_company_v_version_version_hero_image_idx\` ON \`_company_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_company_v_version_version__status_idx\` ON \`_company_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_company_v_created_at_idx\` ON \`_company_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_company_v_updated_at_idx\` ON \`_company_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_company_v_latest_idx\` ON \`_company_v\` (\`latest\`);`)
}
