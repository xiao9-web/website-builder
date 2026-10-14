import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { zh } from '@payloadcms/translations/languages/zh'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Products } from './collections/Products'
import { Media } from './collections/Media'
import { Inquiries } from './collections/Inquiries'
import { Menus } from './collections/Menus'
import { Articles } from './collections/Articles'
import { Videos } from './collections/Videos'
import { Company } from './globals/Company'
import { purchaseInquiry } from './endpoints/inquiry'

const dirname = path.dirname(fileURLToPath(import.meta.url))
function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`缺少环境变量 ${name}，请按照 .env.example 配置。`)
  return value
}
const secret = requiredEnv('PAYLOAD_SECRET')
if (secret.length < 32) throw new Error('PAYLOAD_SECRET 至少需要 32 个字符。')
const databaseURL = requiredEnv('DATABASE_URL')
if (!databaseURL.startsWith('file:')) throw new Error('此交付版本使用本地 SQLite，请将 DATABASE_URL 设置为 file: URL。')
const mediaDir = requiredEnv('MEDIA_DIR')
if (!path.isAbsolute(mediaDir)) throw new Error('MEDIA_DIR 必须是持久化目录的绝对路径。')

export default buildConfig({
  secret,
  telemetry: false,
  email: () => ({
    name: 'disabled',
    defaultFromAddress: 'noreply@chunchang.tech',
    defaultFromName: '春昌网站',
    // No SMTP is included in the MVP, and recovery tokens must never be logged.
    sendEmail: async () => { throw new Error('邮件服务未配置，请联系网站管理员。') },
  }),
  sharp,
  serverURL: process.env.SITE_URL || 'http://127.0.0.1:3001',
  admin: { user: Users.slug, importMap: { baseDir: dirname }, meta: { titleSuffix: ' · 春昌内容管理' } },
  i18n: { supportedLanguages: { zh }, fallbackLanguage: 'zh' },
  collections: [Users, Products, Media, Videos, Menus, Articles, Inquiries],
  globals: [Company],
  endpoints: [purchaseInquiry],
  graphQL: { disable: true },
  upload: { requestSizeLimit: 31 * 1024 * 1024, abortOnLimit: true },
  db: sqliteAdapter({ client: { url: databaseURL }, push: false, busyTimeout: 5000, wal: true, migrationDir: path.resolve(dirname, 'migrations') }),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
