import { getPayload } from 'payload'
import { fileURLToPath } from 'node:url'
import { join, sep } from 'node:path'
import config from '../src/payload.config'

const databaseURL = process.env.DATABASE_URL
const siteURL = process.env.SITE_URL
if (!databaseURL?.startsWith('file:') || !/^http:\/\/(127\.0\.0\.1|localhost):3001\/?$/.test(siteURL || '') ||
    !fileURLToPath(databaseURL).startsWith(join(process.cwd(), 'data') + sep)) {
  throw new Error('此工具只能用于项目 data 目录中的本地试用库。')
}

const input = await new Promise<string>((resolve, reject) => {
  let text = ''
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', (chunk: string) => { text += chunk })
  process.stdin.on('end', () => resolve(text))
  process.stdin.on('error', reject)
})
const [email, password] = input.split('\n')
if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !password || password.length < 14) {
  throw new Error('请输入有效邮箱和至少 14 字符的密码。')
}

const payload = await getPayload({ config })
try {
  const users = await payload.find({ collection: 'users', limit: 2, depth: 0, overrideAccess: true })
  if (users.totalDocs !== 1) throw new Error('仅支持单管理员的本地试用库，未修改账号。')
  await payload.update({ collection: 'users', id: users.docs[0].id, data: { email, password }, overrideAccess: true })
  console.log('本地管理员账号已设置。现在可以打开 /admin 登录。')
} finally {
  await payload.destroy()
}
