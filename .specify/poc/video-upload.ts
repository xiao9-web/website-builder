// 一次性可行性试验：隔离库与目录，不接入正式官网配置。
import { randomBytes } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { buildConfig, getPayload } from 'payload'

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const scratch = path.join(site, 'data', 'verification-video-poc')
const uploads = path.join(scratch, 'uploads')
const sample = path.join(scratch, 'sample.mp4')
mkdirSync(uploads, { recursive: true })
execFileSync('ffmpeg', ['-y', '-f', 'lavfi', '-i', 'color=c=yellow:s=320x180:d=1', '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', sample], { stdio: 'ignore' })

const config = buildConfig({
  secret: randomBytes(32).toString('hex'),
  telemetry: false,
  serverURL: 'http://127.0.0.1:3001',
  collections: [{ slug: 'poc-videos', upload: { staticDir: uploads, mimeTypes: ['video/mp4'] }, fields: [{ name: 'title', type: 'text' }] }],
  db: sqliteAdapter({ client: { url: `file:${path.join(scratch, 'video.sqlite')}` }, push: true }),
})
const payload = await getPayload({ config })
const video = await payload.create({ collection: 'poc-videos', data: { title: '一分钟内的上传试验' }, filePath: sample })
console.log(JSON.stringify({ mimeType: video.mimeType, url: video.url, stored: existsSync(path.join(uploads, video.filename || '')) }))
await payload.destroy()
