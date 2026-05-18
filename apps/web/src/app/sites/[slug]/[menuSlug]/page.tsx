import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicSiteHeader } from "@/components/public-site/PublicSiteHeader";
import {
  getPublicMenuPageData,
  PublicApiError,
} from "@/lib/public-site/api";

interface PublicMenuPageProps {
  params: {
    slug: string;
    menuSlug: string;
  };
}

export default async function PublicMenuPage({ params }: PublicMenuPageProps) {
  let data: Awaited<ReturnType<typeof getPublicMenuPageData>>;
  try {
    data = await getPublicMenuPageData(params.slug, params.menuSlug);
  } catch (error) {
    if (error instanceof PublicApiError) {
      notFound();
    }
    throw error;
  }

  const { config, menus, menu, news, isFallback } = data;
  const companyName = config.brandConfig.companyName || config.name;

  return (
    <main className="min-h-screen bg-[#f7f5ee] text-stone-900">
      {isFallback ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900">
          当前使用本地预览数据；后端和数据库启动后会自动读取真实接口内容。
        </div>
      ) : null}

      <PublicSiteHeader config={config} menus={menus} />

      <section className="border-b border-emerald-900/10 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`/sites/${config.slug}`}
            className="text-sm font-semibold text-emerald-800 transition hover:text-emerald-950"
          >
            返回首页
          </Link>
          <p className="mt-8 text-sm font-semibold text-emerald-800">
            {companyName}
          </p>
          <h1 className="mt-3 text-4xl font-bold text-stone-950">
            {menu.label}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600">
            这里展示该栏目下已发布的内容。后台编辑菜单和文章后，公开站会同步读取最新数据。
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {news.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="rounded-md border border-stone-200 bg-white p-6 shadow-sm"
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
                    <span>{item.category || menu.label}</span>
                    {item.publishedAt ? (
                      <span>{item.publishedAt.slice(0, 10)}</span>
                    ) : null}
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-stone-950">
                    <Link
                      href={`/sites/${config.slug}/articles/${item.slug}`}
                      className="transition hover:text-emerald-800"
                    >
                      {item.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {item.summary || "该文章暂无摘要。"}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-emerald-900/20 bg-white p-8">
              <h2 className="text-xl font-semibold text-stone-950">
                栏目内容待发布
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
                当前栏目还没有已发布文章。可以先通过后台维护文章，或直接通过联系入口提交合作咨询。
              </p>
              <Link
                href={`/sites/${config.slug}#contact`}
                className="mt-6 inline-flex h-11 items-center rounded-md bg-emerald-800 px-5 text-sm font-semibold text-white transition hover:bg-emerald-900"
              >
                联系咨询
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
