import Link from "next/link";
import type { Metadata } from "next";
import { LeadForm } from "@/components/public-site/LeadForm";
import { PublicSiteHeader } from "@/components/public-site/PublicSiteHeader";
import { getPublicSiteData } from "@/lib/public-site/api";

interface PublicSitePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PublicSitePageProps): Promise<Metadata> {
  const { config } = await getPublicSiteData(params.slug);
  const seoTitle =
    typeof config.seoConfig?.title === "string" ? config.seoConfig.title : "";
  const seoDescription =
    typeof config.seoConfig?.description === "string"
      ? config.seoConfig.description
      : "";
  return {
    title:
      seoTitle ||
      config.brandConfig.companyName ||
      "春昌（山东）健康科技有限公司",
    description:
      seoDescription ||
      config.description ||
      "春昌（山东）健康科技有限公司官网",
  };
}

export default async function PublicSitePage({ params }: PublicSitePageProps) {
  const { config, menus, products, news, isFallback } = await getPublicSiteData(
    params.slug,
  );

  const brand = config.brandConfig;
  const content = config.contentConfig;
  const hero = content.hero ?? {};
  const contact = content.contact ?? {};
  const cooperation = content.cooperation ?? {};
  const companyName = brand.companyName || config.name;
  const brandWords = brand.brandWords ?? ["绿色", "健康", "专业", "稳重"];
  const cooperationItems =
    cooperation.items ?? ["企业采购", "经销批发", "渠道合作", "产品咨询"];
  const contactMethods = [
    {
      label: "电话咨询",
      value: contact.phone || "待企业真实资料补充",
      available: Boolean(contact.phone),
    },
    {
      label: "微信沟通",
      value: contact.wechat || "待企业真实资料补充",
      available: Boolean(contact.wechat),
    },
    {
      label: "到访地址",
      value: contact.address || "待企业真实资料补充",
      available: Boolean(contact.address),
    },
  ];
  const trustItems = [
    ["资料真实", "只展示已确认内容，未核实的资质、产能和案例不会编造。"],
    ["合作优先", "围绕采购、经销、渠道和产品咨询组织客户转化路径。"],
    ["持续维护", "后台可维护菜单、文章、服务、线索和发布状态。"],
  ];
  const heroStats = [
    ["4类", "重点合作方向"],
    ["3级", "菜单栏目维护"],
    ["24h", "留言线索可跟进"],
  ];

  return (
    <main
      id="top"
      className="min-h-screen bg-[#f7f5ee] pb-20 text-stone-900 md:pb-0"
    >
      {isFallback ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900">
          当前使用本地预览数据；后端和数据库启动后会自动读取真实接口内容。
        </div>
      ) : null}

      <PublicSiteHeader config={config} menus={menus} />

      <section className="relative overflow-hidden border-b border-emerald-900/10">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f7f5ee_0%,#eef6e9_48%,#fff8e7_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-white/45" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.04fr_0.96fr] lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 flex flex-wrap gap-2">
              {brandWords.map((word) => (
                <span
                  key={word}
                  className="rounded-md border border-emerald-800/20 bg-white/75 px-3 py-1 text-xs font-medium text-emerald-900"
                >
                  {word}
                </span>
              ))}
            </div>
            <p className="mb-4 text-sm font-semibold text-emerald-800">
              {companyName}
            </p>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-stone-950 sm:text-5xl">
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
            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {heroStats.map(([value, label]) => (
                <div key={label} className="border-l border-emerald-900/20 pl-4">
                  <p className="text-2xl font-bold text-emerald-900">
                    {value}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-stone-600">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[390px] rounded-md border border-emerald-900/10 bg-white p-4 shadow-xl shadow-emerald-950/10">
            <div className="flex h-full flex-col rounded-sm bg-[#f7f5ee]">
              <div className="border-b border-emerald-900/10 bg-white p-6">
                <p className="text-sm font-semibold text-emerald-900">
                  企业客户合作看板
                </p>
                <p className="mt-2 text-2xl font-bold leading-snug text-stone-950">
                  黄油等乳制品相关产品与食品科技服务
                </p>
              </div>
              <div className="grid flex-1 gap-3 p-6 sm:grid-cols-2">
                {["食品加工", "烘焙餐饮", "经销批发", "渠道合作"].map(
                  (item, index) => (
                    <div
                      key={item}
                      className="flex min-h-28 flex-col justify-between rounded-md border border-emerald-900/10 bg-white p-4"
                    >
                      <span className="text-xs font-semibold text-[#9b6b19]">
                        0{index + 1}
                      </span>
                      <span className="text-base font-semibold text-stone-900">
                        {item}
                      </span>
                    </div>
                  ),
                )}
              </div>
              <div className="border-t border-emerald-900/10 bg-emerald-950 p-5 text-sm leading-6 text-emerald-50">
                客户可通过留言提交采购量、用途、合作区域和联系方式，后台统一沉淀线索。
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-900/10 bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {trustItems.map(([title, text]) => (
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
              当前展示的是已确认的业务方向和可沟通场景，具体规格、包装、资质和合作政策后续由企业补充。
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-md border border-stone-200 bg-white p-6 shadow-sm transition hover:border-emerald-800/30 hover:shadow-md"
              >
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="mb-5 aspect-[16/9] w-full rounded-md border border-stone-200 object-cover"
                  />
                ) : null}
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold text-stone-950">
                    {product.name}
                  </h3>
                  <span className="shrink-0 rounded-md bg-[#fff8e7] px-3 py-1 text-xs font-semibold text-[#8a5a10]">
                    可咨询
                  </span>
                </div>
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
                        className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-900"
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
          <div>
            <p className="text-base leading-8 text-emerald-50">
              {content.about?.summary || config.description}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["企业资料", "产品资料", "合作案例"].map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-white/15 bg-white/5 p-4"
                >
                  <p className="text-base font-semibold text-white">{item}</p>
                  <p className="mt-2 text-xs leading-5 text-emerald-100">
                    待真实材料补齐后发布
                  </p>
                </div>
              ))}
            </div>
          </div>
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
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold text-emerald-800">最近动态</p>
              <h2 className="mt-2 text-3xl font-bold text-stone-950">
                公司动态与产品知识
              </h2>
            </div>
            <Link
              href={`/sites/${config.slug}/news`}
              className="inline-flex h-11 items-center justify-center rounded-md border border-emerald-800/30 bg-white px-5 text-sm font-semibold text-emerald-900 transition hover:border-emerald-800 hover:bg-emerald-50"
            >
              查看动态栏目
            </Link>
          </div>
          {news.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="rounded-md border border-stone-200 bg-white p-6 shadow-sm transition hover:border-emerald-800/30 hover:shadow-md"
                >
                  {item.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="mb-5 aspect-[16/9] w-full rounded-md border border-stone-200 object-cover"
                    />
                  ) : null}
                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <span>{item.category || "动态"}</span>
                    {item.publishedAt ? (
                      <span>{item.publishedAt.slice(0, 10)}</span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-stone-950">
                    <Link
                      href={`/sites/${config.slug}/articles/${item.slug}`}
                      className="transition hover:text-emerald-800"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {item.summary}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-emerald-900/20 bg-white p-8">
              <h3 className="text-xl font-semibold text-stone-950">
                真实动态待发布
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
                当前没有已发布文章。后台可以先维护公司动态、产品知识、合作说明等内容；未核实的新闻、案例和资质不会出现在公开站。
              </p>
              <Link
                href="#contact"
                className="mt-6 inline-flex h-11 items-center rounded-md bg-emerald-800 px-5 text-sm font-semibold text-white transition hover:bg-emerald-900"
              >
                先提交合作咨询
              </Link>
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-emerald-800">联系我们</p>
            <h2 className="mt-2 text-3xl font-bold text-stone-950">
              留下需求，我们尽快联系
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600">
              电话、微信和地址等资料确认前，留言表单是当前最稳定的客户入口。可填写采购需求、合作区域、产品用途或想了解的服务。
            </p>
            <div className="mt-6 space-y-3">
              {contactMethods.map((method) => (
                <div
                  key={method.label}
                  className="rounded-md border border-stone-200 bg-[#f7f5ee] p-4"
                >
                  <p className="text-sm font-semibold text-stone-950">
                    {method.label}
                  </p>
                  <p
                    className={`mt-1 text-sm leading-6 ${
                      method.available ? "text-stone-700" : "text-stone-500"
                    }`}
                  >
                    {method.value}
                  </p>
                </div>
              ))}
              {contact.notice ? (
                <p className="text-sm leading-6 text-stone-600">
                  {contact.notice}
                </p>
              ) : null}
            </div>
            {contact.wechatQrUrl ? (
              <div className="mt-6 inline-block rounded-md border border-stone-200 bg-white p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={contact.wechatQrUrl}
                  alt="微信二维码"
                  className="h-32 w-32 rounded object-cover"
                />
                <p className="mt-2 text-center text-xs text-stone-500">
                  扫码添加微信
                </p>
              </div>
            ) : null}
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
