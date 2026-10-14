import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`company_hero_slides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`company\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`company_hero_slides_order_idx\` ON \`company_hero_slides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`company_hero_slides_parent_id_idx\` ON \`company_hero_slides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`company_hero_slides_image_idx\` ON \`company_hero_slides\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_company_v_version_hero_slides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_company_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_company_v_version_hero_slides_order_idx\` ON \`_company_v_version_hero_slides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_company_v_version_hero_slides_parent_id_idx\` ON \`_company_v_version_hero_slides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_company_v_version_hero_slides_image_idx\` ON \`_company_v_version_hero_slides\` (\`image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`company_hero_slides\`;`)
  await db.run(sql`DROP TABLE \`_company_v_version_hero_slides\`;`)
}
