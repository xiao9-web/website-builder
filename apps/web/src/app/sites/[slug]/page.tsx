import Link from "next/link";
import { LeadForm } from "@/components/public-site/LeadForm";
import { getPublicSiteData } from "@/lib/public-site/api";

interface PublicSitePageProps {
  params: {
    slug: string;
  };
}

export default async function PublicSitePage({ params }: PublicSitePageProps) {
  const { config, products, news, isFallback } = await getPublicSiteData(
    params.slug,
  );

  const brand = config.brandConfig;
  const content = config.contentConfig;
  const navItems = config.navigationConfig.items ?? [];
  const hero = content.hero ?? {};
  const contact = content.contact ?? {};
  const cooperation = content.cooperation ?? {};
  const companyName = brand.companyName || config.name;
  const shortName = brand.shortName || companyName;
  const brandWords = brand.brandWords ?? ["绿色", "健康", "专业", "稳重"];
  const cooperationItems =
    cooperation.items ?? ["企业采购", "经销批发", "渠道合作", "产品咨询"];

  return (
    <main
      id="top"
      className="min-h-screen bg-[#f7f5ee] text-stone-900"
    >
      {isFallback ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900">
          当前使用本地预览数据；后端和数据库启动后会自动读取真实接口内容。
        </div>
      ) : null}

      <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-[#f7f5ee]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="#top" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-800 text-sm font-bold text-white">
              春昌
            </span>
            <span className="text-base font-semibold text-stone-950">
              {shortName}
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-stone-700 md:flex">
            {navItems.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className="transition hover:text-emerald-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="#contact"
            className="rounded-md bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900"
          >
            联系咨询
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-emerald-900/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(217,164,65,0.18),transparent_28%),linear-gradient(135deg,rgba(47,125,74,0.18),rgba(255,248,231,0.55))]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 flex flex-wrap gap-2">
              {brandWords.map((word) => (
                <span
                  key={word}
                  className="rounded-full border border-emerald-800/20 bg-white/70 px-3 py-1 text-xs font-medium text-emerald-900"
                >
                  {word}
                </span>
              ))}
            </div>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-stone-950 sm:text-5xl lg:text-6xl">
              {hero.headline || "绿色健康乳制品供应与合作服务"}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg">
              {hero.subheadline || config.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#contact"
                className="inline-flex h-12 items-center justify-center rounded-md bg-emerald-800 px-6 text-sm font-semibold text-white transition hover:bg-emerald-900"
              >
                {hero.primaryCta || "提交合作咨询"}
              </Link>
              <Link
                href="#products"
                className="inline-flex h-12 items-center justify-center rounded-md border border-emerald-800/30 bg-white/70 px-6 text-sm font-semibold text-emerald-900 transition hover:bg-white"
              >
                {hero.secondaryCta || "查看产品服务"}
              </Link>
            </div>
          </div>

          <div className="relative min-h-[360px] rounded-md border border-emerald-900/10 bg-white/75 p-4 shadow-xl shadow-emerald-950/10">
            <div className="h-full rounded-sm bg-[linear-gradient(145deg,#fff8e7,#eef6e9_55%,#d9a441)] p-6">
              <div className="flex h-full flex-col justify-between rounded-sm border border-white/70 bg-white/60 p-6">
                <div>
                  <p className="text-sm font-semibold text-emerald-900">
                    {companyName}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-stone-950">
                    黄油等乳制品相关产品与食品科技服务
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {["食品加工", "烘焙餐饮", "经销批发", "渠道合作"].map(
                    (item) => (
                      <div
                        key={item}
                        className="rounded-md bg-white/75 p-4 text-sm font-medium text-stone-800"
                      >
                        {item}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-900/10 bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ["快速联系", "电话、微信、留言入口集中呈现，减少客户寻找成本。"],
            ["真实资料优先", "不编造成立年份、产能、资质或客户案例，等待企业资料补齐。"],
            ["合作导向", "围绕采购、渠道、产品咨询和长期合作组织内容。"],
          ].map(([title, text]) => (
            <div key={title} className="border-l-4 border-emerald-800 pl-5">
              <h2 className="text-lg font-semibold text-stone-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold text-emerald-800">产品服务</p>
              <h2 className="mt-2 text-3xl font-bold text-stone-950">
                面向企业客户的乳制品相关服务
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-stone-600">
              当前展示的是已确认的业务方向和可沟通场景，具体规格与资料后续由企业补充。
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-md border border-stone-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-stone-950">
                  {product.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {product.summary}
                </p>
                {product.description ? (
                  <p className="mt-4 text-sm leading-6 text-stone-700">
                    {product.description}
                  </p>
                ) : null}
                {product.scenarios?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {product.scenarios.map((scenario) => (
                      <span
                        key={String(scenario)}
                        className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-900"
                      >
                        {String(scenario)}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-emerald-950 py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-[#d9a441]">关于我们</p>
            <h2 className="mt-3 text-3xl font-bold">{companyName}</h2>
          </div>
          <p className="text-base leading-8 text-emerald-50">
            {content.about?.summary || config.description}
          </p>
        </div>
      </section>

      <section id="cooperation" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-emerald-800">合作机会</p>
            <h2 className="mt-2 text-3xl font-bold text-stone-950">
              {cooperation.title || "合作机会"}
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600">
              {cooperation.description}
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cooperationItems.map((item) => (
              <div
                key={item}
                className="rounded-md border border-emerald-900/10 bg-[#f7f5ee] p-5 text-base font-semibold text-stone-900"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="news" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-sm font-semibold text-emerald-800">最近动态</p>
            <h2 className="mt-2 text-3xl font-bold text-stone-950">
              公司动态与产品知识
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {news.map((item) => (
              <article
                key={item.id}
                className="rounded-md border border-stone-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span>{item.category || "动态"}</span>
                  {item.publishedAt ? (
                    <span>{item.publishedAt.slice(0, 10)}</span>
                  ) : null}
                </div>
                <h3 className="mt-3 text-xl font-semibold text-stone-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {item.summary}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-emerald-800">联系我们</p>
            <h2 className="mt-2 text-3xl font-bold text-stone-950">
              留下需求，我们尽快联系
            </h2>
            <div className="mt-6 space-y-3 text-sm leading-6 text-stone-700">
              <p>电话：{contact.phone || "待企业真实资料补充"}</p>
              <p>微信：{contact.wechat || "待企业真实资料补充"}</p>
              <p>地址：{contact.address || "待企业真实资料补充"}</p>
              {contact.notice ? <p>{contact.notice}</p> : null}
            </div>
          </div>
          <div className="rounded-md border border-stone-200 bg-[#f7f5ee] p-6">
            <LeadForm siteSlug={config.slug} />
          </div>
        </div>
      </section>

      <footer className="border-t border-emerald-900/10 bg-emerald-950 px-4 py-8 text-center text-sm text-emerald-50">
        © {new Date().getFullYear()} {companyName}. 页面内容等待企业真实资料持续补充。
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-emerald-900/10 bg-white p-3 shadow-lg md:hidden">
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="#contact"
            className="flex h-11 items-center justify-center rounded-md bg-emerald-800 text-sm font-semibold text-white"
          >
            提交咨询
          </Link>
          <Link
            href="#products"
            className="flex h-11 items-center justify-center rounded-md border border-emerald-800/30 text-sm font-semibold text-emerald-900"
          >
            产品服务
          </Link>
        </div>
      </div>
    </main>
  );
}
