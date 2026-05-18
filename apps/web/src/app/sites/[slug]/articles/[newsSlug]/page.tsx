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

function isHtmlContent(content?: string | null) {
  return Boolean(content && /<\/?[a-z][\s\S]*>/i.test(content));
}

function sanitizeArticleHtml(content?: string | null) {
  const allowedTags = new Set([
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "h2",
    "h3",
    "ul",
    "ol",
    "li",
    "blockquote",
    "hr",
    "a",
    "img",
    "figure",
    "video",
    "source",
  ]);
  const allowedAttrs: Record<string, Set<string>> = {
    a: new Set(["href", "target", "rel"]),
    img: new Set(["src", "alt"]),
    video: new Set(["src", "controls"]),
    source: new Set(["src", "type"]),
  };

  const cleanUrl = (value: string) => {
    const trimmed = value.trim();
    if (/^(https?:|\/uploads\/|data:image\/)/i.test(trimmed)) return trimmed;
    return "";
  };

  const readAttrs = (rawAttrs: string, tag: string) => {
    const attrs = allowedAttrs[tag];
    if (!attrs) return "";
    const result: string[] = [];
    rawAttrs.replace(
      /\s([a-zA-Z][a-zA-Z0-9:-]*)=(?:"([^"]*)"|'([^']*)')/g,
      (_match, attrName: string, doubleValue?: string, singleValue?: string) => {
        const attr = attrName.toLowerCase();
        const value = doubleValue ?? singleValue ?? "";
        if (!attrs.has(attr)) return "";
        if ((attr === "href" || attr === "src") && !cleanUrl(value)) return "";
        if (attr === "target" && value !== "_blank") return "";
        if (attr === "rel" && value !== "noopener noreferrer") return "";
        if (attr === "controls") {
          result.push("controls");
          return "";
        }
        result.push(`${attr}="${value.replace(/"/g, "&quot;")}"`);
        return "";
      },
    );
    if (tag === "a" && !result.some((item) => item.startsWith("rel="))) {
      result.push('rel="noopener noreferrer"');
    }
    if (tag === "a" && !result.some((item) => item.startsWith("target="))) {
      result.push('target="_blank"');
    }
    return result.length ? ` ${result.join(" ")}` : "";
  };

  return (content || "<p>正文内容待补充。</p>")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "")
    .replace(
      /<\/?([a-z][a-z0-9]*)\b([^>]*)>/gi,
      (match, tagName: string, attrs: string) => {
        const tag = tagName.toLowerCase();
        if (!allowedTags.has(tag)) return "";
        if (match.startsWith("</")) return `</${tag}>`;
        const normalizedAttrs =
          tag === "video" && /\scontrols(\s|>|$)/i.test(match)
            ? `${attrs} controls="controls"`
            : attrs;
        return `<${tag}${readAttrs(normalizedAttrs, tag)}>`;
      },
    );
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
        {isHtmlContent(article.content) ? (
          <div
            className="mt-10 rounded-md border border-stone-200 bg-white p-6 text-base leading-8 text-stone-700 shadow-sm sm:p-8 [&_a]:font-semibold [&_a]:text-emerald-800 [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-700 [&_blockquote]:bg-emerald-50 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_figure]:my-6 [&_h2]:mb-4 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-stone-950 [&_h3]:mb-3 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-stone-950 [&_hr]:my-8 [&_hr]:border-stone-200 [&_img]:my-6 [&_img]:w-full [&_img]:rounded-md [&_img]:border [&_img]:border-stone-200 [&_img]:object-cover [&_li]:ml-5 [&_li]:list-disc [&_ol>li]:list-decimal [&_p]:mb-5 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_video]:my-6 [&_video]:w-full [&_video]:rounded-md [&_video]:border [&_video]:border-stone-200"
            dangerouslySetInnerHTML={{
              __html: sanitizeArticleHtml(article.content),
            }}
          />
        ) : (
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
        )}
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
