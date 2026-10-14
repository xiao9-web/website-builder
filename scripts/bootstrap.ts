import { getPayload } from 'payload'
import config from '../src/payload.config'

const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD
if (!email || !password || password.length < 14) throw new Error('请设置 ADMIN_EMAIL 及至少 14 字符的 ADMIN_PASSWORD。')
const payload = await getPayload({ config })
try {
  const users = await payload.find({ collection: 'users', limit: 1, depth: 0 })
  if (users.totalDocs === 0) {
    await payload.create({ collection: 'users', context: { bootstrap: true }, data: { email, password, name: '公司管理员' } })
    console.log('首个管理员已创建。后续运行不会更改已有账号或密码。')
  } else console.log('已有管理员，保留现有账号。')

  const company = await payload.findGlobal({ slug: 'company', draft: false })
  if (!company.brandName) {
    await payload.updateGlobal({ slug: 'company', data: {
      brandName: '春昌食品',
      headline: '好原料，\n成就每一份好味道。',
      intro: '专注黄油与乳制品原料，面向食品加工与烘焙企业，连接您的产品需求与乳脂风味。',
      businessScope: '黄油及其他乳制品；面向食品加工、烘焙等企业采购。',
      advantages: [
        { title: '按需求选品', description: '围绕用途、规格与采购需求沟通产品选择。' },
        { title: '企业采购沟通', description: '提交需求后，由商务人员核实产品、价格和供货条件。' },
      ],
      _status: 'published',
    } })
    console.log('已初始化已确认的主营业务；法定名称、联系信息和资质待填写。')
  }
  if (process.env.DEMO_MODE === 'true') {
    const existing = await payload.find({ collection: 'products', limit: 1, where: { slug: { equals: 'demo-butter' } } })
    if (existing.totalDocs === 0) await payload.create({ collection: 'products', data: {
      name: '黄油产品展示示例', slug: 'demo-butter', category: 'butter',
      summary: '此条目仅用于演示官网和后台发布流程，并非实际在售产品。请在交付前替换为已核实的产品资料。',
      applications: [{ label: '烘焙企业采购' }, { label: '食品加工采购' }],
      isDemo: true, displayOrder: 0, _status: 'published',
    } })
    console.log('演示产品已准备，前台明确显示示例标识。')
  }
} finally { await payload.destroy() }
