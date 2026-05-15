import Link from "next/link";
import {
  fallbackNews,
  fallbackProducts,
  fallbackSiteConfig,
} from "@/lib/public-site/fallback";

const leads = [
  {
    id: 1,
    name: "采购负责人",
    company: "食品加工企业",
    type: "企业采购",
    phone: "待真实线索提交",
    status: "待跟进",
    message: "希望了解黄油产品规格、包装和批量采购方式。",
    createdAt: "2026-05-15 09:30",
  },
  {
    id: 2,
    name: "渠道客户",
    company: "区域经销商",
    type: "渠道合作",
    phone: "待真实线索提交",
    status: "已记录",
    message: "咨询区域合作政策和供货稳定性。",
    createdAt: "2026-05-15 11:10",
  },
];

const missingMaterials = [
  "企业 Logo 图片和标准色",
  "电话、微信、二维码、地址",
  "产品规格、包装、保质期、储运条件",
  "资质证书、生产能力、合作案例",
  "真实公司动态和产品知识文章",
];

const statusClass: Record<string, string> = {
  待跟进: "bg-amber-50 text-amber-700 ring-amber-200",
  已记录: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default function ChunchangManagePage() {
  const companyName =
    fallbackSiteConfig.brandConfig.companyName || fallbackSiteConfig.name;
  const cooperationItems =
    fallbackSiteConfig.contentConfig.cooperation?.items ?? [];
  const contact = fallbackSiteConfig.contentConfig.contact;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              小九建站 · 本地运营管理台
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              {companyName}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              用于本地验收的免登录演示后台，后续可接入真实账号和数据库。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/sites/chunchang"
              className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              查看前台官网
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              进入正式后台
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-4">
          {[
            ["站点状态", "本地预览可访问", "前台页面已中文化"],
            ["产品服务", `${fallbackProducts.length} 项`, "黄油、乳制品原料、采购、渠道"],
            ["最近动态", `${fallbackNews.length} 篇`, "当前为占位内容，等待真实资料"],
            ["咨询线索", `${leads.length} 条演示`, "真实留言接口已预留"],
          ].map(([label, value, hint]) => (
            <div
              key={label}
              className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-3 text-2xl font-bold text-slate-950">{value}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{hint}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-semibold">站点配置总览</h2>
              <p className="mt-1 text-sm text-slate-500">
                前台官网的核心内容结构已经确定，真实资料补齐后即可替换占位内容。
              </p>
            </div>
            <div className="grid gap-5 p-5 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-slate-500">品牌定位</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {fallbackSiteConfig.brandConfig.brandWords?.map((word) => (
                    <span
                      key={word}
                      className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">合作方向</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {cooperationItems.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-slate-500">联系方式</p>
                <dl className="mt-3 grid gap-3 text-sm md:grid-cols-3">
                  <div className="rounded-md bg-slate-50 p-3">
                    <dt className="text-slate-500">电话</dt>
                    <dd className="mt-1 font-medium">
                      {contact?.phone || "待企业真实资料补充"}
                    </dd>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <dt className="text-slate-500">微信</dt>
                    <dd className="mt-1 font-medium">
                      {contact?.wechat || "待企业真实资料补充"}
                    </dd>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <dt className="text-slate-500">地址</dt>
                    <dd className="mt-1 font-medium">
                      {contact?.address || "待企业真实资料补充"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-semibold">资料补齐清单</h2>
              <p className="mt-1 text-sm text-slate-500">
                这些内容不应该凭空编造，需要企业确认后再上线。
              </p>
            </div>
            <ul className="divide-y divide-slate-100">
              {missingMaterials.map((item) => (
                <li key={item} className="flex items-center gap-3 px-5 py-3">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-sm text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-6 rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">产品服务管理</h2>
              <p className="mt-1 text-sm text-slate-500">
                当前内容来自本地预览数据，字段结构已和公开接口对齐。
              </p>
            </div>
            <button className="h-9 rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700">
              新增产品服务
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
                <tr>
                  <th className="px-5 py-3">名称</th>
                  <th className="px-5 py-3">摘要</th>
                  <th className="px-5 py-3">适用场景</th>
                  <th className="px-5 py-3">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fallbackProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="whitespace-nowrap px-5 py-4 font-medium">
                      {product.name}
                    </td>
                    <td className="max-w-lg px-5 py-4 text-slate-600">
                      {product.summary}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {product.scenarios?.map(String).join("、") || "待补充"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        前台展示
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-semibold">最近动态</h2>
              <p className="mt-1 text-sm text-slate-500">
                已保留栏目结构，避免发布虚假企业新闻。
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {fallbackNews.map((item) => (
                <article key={item.id} className="px-5 py-4">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{item.category}</span>
                    <span>{item.publishedAt?.slice(0, 10)}</span>
                  </div>
                  <h3 className="mt-2 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.summary}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-semibold">留言线索</h2>
              <p className="mt-1 text-sm text-slate-500">
                演示后台跟进视图；正式环境会读取真实提交记录。
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <article key={lead.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{lead.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {lead.company} · {lead.type}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusClass[lead.status]}`}
                    >
                      {lead.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {lead.message}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>{lead.phone}</span>
                    <span>{lead.createdAt}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
