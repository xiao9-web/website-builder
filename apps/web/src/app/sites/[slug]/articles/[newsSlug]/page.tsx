import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicSiteHeader } from "@/components/public-site/PublicSiteHeader";
import {
  getPublicArticleData,
  PublicApiError,
} from "@/lib/public-site/api";

interface PublicArticlePageProps {
  params: {
    slug: string;
    newsSlug: string;
  };
}

export default async function PublicArticlePage({
  params,
}: PublicArticlePageProps) {
  let data: Awaited<ReturnType<typeof getPublicArticleData>>;
  try {
    data = await getPublicArticleData(params.slug, params.newsSlug);
  } catch (error) {
    if (error instanceof PublicApiError) {
      notFound();
    }
    throw error;
  }

  const { config, menus, article, isFallback } = data;
  const companyName = config.brandConfig.companyName || config.name;

  return (
    <main className="min-h-screen bg-[#f7f5ee] text-stone-900">
      {isFallback ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900">
          当前使用本地预览数据；后端和数据库启动后会自动读取真实接口内容。
        </div>
      ) : null}

      <PublicSiteHeader config={config} menus={menus} />

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Link
          href={`/sites/${config.slug}`}
          className="text-sm font-semibold text-emerald-800 transition hover:text-emerald-950"
        >
          返回首页
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-stone-500">
          <span>{article.category || companyName}</span>
          {article.publishedAt ? (
            <span>{article.publishedAt.slice(0, 10)}</span>
          ) : null}
        </div>
        <h1 className="mt-4 text-4xl font-bold leading-tight text-stone-950 sm:text-5xl">
          {article.title}
        </h1>
        {article.summary ? (
          <p className="mt-6 text-lg leading-8 text-stone-600">
            {article.summary}
          </p>
        ) : null}
        {article.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverImage}
            alt={article.title}
            className="mt-8 aspect-[16/9] w-full rounded-md border border-stone-200 object-cover shadow-sm"
          />
        ) : null}
        <div className="mt-10 rounded-md border border-stone-200 bg-white p-6 text-base leading-8 text-stone-700 shadow-sm sm:p-8">
          {(article.content || "正文内容待补充。")
            .split("\n")
            .filter(Boolean)
            .map((paragraph) => (
              <p key={paragraph} className="mb-5 last:mb-0">
                {paragraph}
              </p>
            ))}
        </div>
        <div className="mt-10 rounded-md bg-emerald-950 p-6 text-white">
          <h2 className="text-xl font-semibold">需要进一步沟通？</h2>
          <p className="mt-3 text-sm leading-6 text-emerald-50">
            如果你关注该内容对应的产品、采购或合作机会，可以通过联系入口提交需求。
          </p>
          <Link
            href={`/sites/${config.slug}#contact`}
            className="mt-6 inline-flex h-11 items-center rounded-md bg-white px-5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-50"
          >
            联系咨询
          </Link>
        </div>
      </article>
    </main>
  );
}
