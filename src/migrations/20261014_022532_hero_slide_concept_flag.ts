import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`company_hero_slides\` ADD \`is_concept\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`_company_v_version_hero_slides\` ADD \`is_concept\` integer DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`company_hero_slides\` DROP COLUMN \`is_concept\`;`)
  await db.run(sql`ALTER TABLE \`_company_v_version_hero_slides\` DROP COLUMN \`is_concept\`;`)
}
