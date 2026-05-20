"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Loading } from "@/components/ui/Loading";
import { useSiteStore } from "@/stores/siteStore";
import { showErrorToast } from "@/lib/toast";
import { getErrorMessage, shouldShowInlineError } from "@/lib/api";
import { slugify, formatDate } from "@/lib/utils";
import {
  createNews,
  createProductService,
  createSiteMenu,
  deleteProductService,
  deleteSiteMenu,
  getSiteConfig,
  listSiteMenus,
  listLeads,
  listNews,
  listProductServices,
  updateLeadStatus,
  updateNews,
  updateNewsStatus,
  updateProductEnabled,
  updateProductService,
  updateSiteMenu,
  updateSiteConfig,
  uploadMedia,
  offlineNews,
} from "@/lib/content-management/api";
import type {
  LeadDTO,
  NewsDTO,
  ProductServiceDTO,
  SiteMenuDTO,
  SiteConfigDTO,
} from "@/lib/content-management/types";

type TabKey = "config" | "menus" | "products" | "news" | "leads";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "config", label: "站点配置" },
  { key: "menus", label: "菜单栏目" },
  { key: "products", label: "产品服务" },
  { key: "news", label: "栏目文章" },
  { key: "leads", label: "留言线索" },
];

const leadStatusLabels: Record<LeadDTO["status"], string> = {
  NEW: "新线索",
  CONTACTED: "已联系",
  CLOSED: "已成交/关闭",
  INVALID: "无效",
};

const newsStatusLabels: Record<NewsDTO["status"], string> = {
  DRAFT: "草稿",
  PUBLISHED: "已发布",
  OFFLINE: "已下线",
};

function textValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function mapItems(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function splitList(value: string): string[] {
  return value
    .split(/[、,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function menuLabel(menus: SiteMenuDTO[], menuId?: number | null): string {
  if (!menuId) return "未选择栏目";
  return menus.find((menu) => menu.id === menuId)?.label ?? "未知栏目";
}

function sortMenusForDisplay(menus: SiteMenuDTO[]): SiteMenuDTO[] {
  const byParent = new Map<number | null, SiteMenuDTO[]>();
  menus.forEach((menu) => {
    const parentId = menu.parentId ?? null;
    byParent.set(parentId, [...(byParent.get(parentId) ?? []), menu]);
  });

  byParent.forEach((items) => {
    items.sort(
      (a, b) =>
        a.sortOrder - b.sortOrder ||
        a.createdAt.localeCompare(b.createdAt) ||
        a.id - b.id,
    );
  });

  const result: SiteMenuDTO[] = [];
  const appendChildren = (parentId: number | null) => {
    (byParent.get(parentId) ?? []).forEach((menu) => {
      result.push(menu);
      appendChildren(menu.id);
    });
  };

  appendChildren(null);
  return result;
}

function menuPath(menus: SiteMenuDTO[], menuId?: number | null): string {
  if (!menuId) return "未选择栏目";
  const byId = new Map(menus.map((menu) => [menu.id, menu]));
  const labels: string[] = [];
  let current = byId.get(menuId);
  while (current) {
    labels.unshift(current.label);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }
  return labels.length ? labels.join(" / ") : "未知栏目";
}

function countChildren(menus: SiteMenuDTO[], menuId: number): number {
  return menus.filter((menu) => menu.parentId === menuId).length;
}

function countMenuNews(news: NewsDTO[], menuId: number): number {
  return news.filter((item) => item.menuId === menuId).length;
}

function plainTextFromHtml(value?: string | null): string {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function charCount(value?: string | null): number {
  return plainTextFromHtml(value).length;
}

function isLeafMenu(menus: SiteMenuDTO[], menuId?: number | null): boolean {
  if (!menuId) return false;
  return !menus.some((menu) => menu.parentId === menuId);
}

function articleMenuWarning(
  menus: SiteMenuDTO[],
  menuId?: number | null,
): string | null {
  if (!menuId) return "未选择最后一级栏目";
  const menu = menus.find((item) => item.id === menuId);
  if (!menu) return "栏目不存在";
  if (menu.menuType === "HOME") return "首页不能挂文章";
  if (!isLeafMenu(menus, menu.id)) return "请选择最后一级栏目";
  return null;
}

function newsReadinessWarnings(
  menus: SiteMenuDTO[],
  item: Pick<NewsDTO, "menuId" | "summary" | "content">,
): string[] {
  const warnings: string[] = [];
  const menuWarning = articleMenuWarning(menus, item.menuId);
  if (menuWarning) warnings.push(menuWarning);
  if (charCount(item.summary) < 20) warnings.push("摘要偏短");
  if (charCount(item.content) < 80) warnings.push("正文偏短");
  return warnings;
}

function ImagePreview({
  url,
  label,
  compact = false,
}: {
  url?: string | null;
  label: string;
  compact?: boolean;
}) {
  const trimmedUrl = url?.trim();
  if (!trimmedUrl) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="mb-2 text-xs font-medium text-gray-500">{label}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={trimmedUrl}
        alt={label}
        className={
          compact
            ? "h-24 w-24 rounded-md border border-gray-200 bg-white object-cover"
            : "aspect-video w-full rounded-md border border-gray-200 bg-white object-cover"
        }
      />
    </div>
  );
}

function safeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^(https?:|\/uploads\/|data:image\/)/i.test(trimmed)) return trimmed;
  return "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function MediaUploadButton({
  accept,
  label,
  onUploaded,
  onError,
}: {
  accept: string;
  label: string;
  onUploaded: (url: string) => void;
  onError?: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file?: File) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const media = await uploadMedia(file);
      onUploaded(media.url);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "文件上传失败。");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => handleUpload(event.target.files?.[0])}
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        isLoading={isUploading}
      >
        {label}
      </Button>
    </>
  );
}

function RichTextEditor({
  value,
  onChange,
  label,
  onError,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  onError?: (message: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || isFocused || editor.innerHTML === value) return;
    editor.innerHTML = value;
  }, [isFocused, value]);

  const syncValue = () => {
    onChange(editorRef.current?.innerHTML ?? "");
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const editor = editorRef.current;
    const range = selection.getRangeAt(0);
    if (editor?.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
    }
  };

  const restoreSelection = () => {
    const editor = editorRef.current;
    editor?.focus();
    const selection = window.getSelection();
    const range = savedRangeRef.current;
    if (!selection || !range) return;
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const runCommand = (command: string, argument?: string) => {
    restoreSelection();
    document.execCommand(command, false, argument);
    syncValue();
    saveSelection();
  };

  const insertHtml = (html: string) => {
    restoreSelection();
    document.execCommand("insertHTML", false, html);
    syncValue();
    saveSelection();
  };

  const insertLink = () => {
    const url = safeUrl(window.prompt("请输入链接 URL，例如 https://example.com") ?? "");
    if (!url) return;
    restoreSelection();
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    const text =
      selectedText || window.prompt("请输入链接文字", url) || url;
    insertHtml(
      `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`,
    );
  };

  const insertImageUrl = () => {
    const url = safeUrl(window.prompt("请输入图片 URL，或先点击上传图片获取 URL") ?? "");
    if (!url) return;
    const alt = window.prompt("请输入图片说明", "") ?? "";
    insertHtml(
      `<figure><img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" /></figure>`,
    );
  };

  const insertVideoUrl = () => {
    const url = safeUrl(window.prompt("请输入视频 URL，或先点击上传视频获取 URL") ?? "");
    if (!url) return;
    insertHtml(`<video controls src="${escapeHtml(url)}"></video>`);
  };

  const handleUpload = async (file: File | undefined, type: "image" | "video") => {
    if (!file) return;
    setIsUploading(true);
    try {
      const media = await uploadMedia(file);
      if (type === "image") {
        insertHtml(
          `<figure><img src="${escapeHtml(media.url)}" alt="${escapeHtml(media.originalFilename)}" /></figure>`,
        );
      } else {
        insertHtml(
          `<video controls src="${escapeHtml(media.url)}"></video>`,
        );
      }
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "文件上传失败。");
    } finally {
      setIsUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  const toolbar = [
    { label: "B", title: "加粗", command: "bold" },
    { label: "I", title: "斜体", command: "italic" },
    { label: "H2", title: "二级标题", command: "formatBlock", argument: "h2" },
    { label: "H3", title: "三级标题", command: "formatBlock", argument: "h3" },
    { label: "•", title: "无序列表", command: "insertUnorderedList" },
    { label: "1.", title: "有序列表", command: "insertOrderedList" },
    { label: "P", title: "正文段落", command: "formatBlock", argument: "p" },
    { label: "❝", title: "引用", command: "formatBlock", argument: "blockquote" },
    { label: "HR", title: "分隔线", command: "insertHorizontalRule" },
    { label: "清", title: "清除格式", command: "removeFormat" },
  ];

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </span>
      <div className="rounded-lg border border-gray-300 bg-white">
        <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
          {toolbar.map((item) => (
            <button
              key={`${item.command}-${item.label}`}
              type="button"
              title={item.title}
              onMouseDown={(event) => {
                event.preventDefault();
                saveSelection();
              }}
              onClick={() => runCommand(item.command, item.argument)}
              className="h-8 min-w-8 rounded border border-gray-200 bg-white px-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            title="插入链接"
            onMouseDown={(event) => {
              event.preventDefault();
              saveSelection();
            }}
            onClick={insertLink}
            className="h-8 min-w-8 rounded border border-gray-200 bg-white px-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
          >
            链接
          </button>
          <button
            type="button"
            title="插入图片 URL"
            onMouseDown={(event) => {
              event.preventDefault();
              saveSelection();
            }}
            onClick={insertImageUrl}
            className="h-8 min-w-8 rounded border border-gray-200 bg-white px-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
          >
            图URL
          </button>
          <button
            type="button"
            title="上传图片并插入"
            disabled={isUploading}
            onMouseDown={(event) => {
              event.preventDefault();
              saveSelection();
            }}
            onClick={() => imageInputRef.current?.click()}
            className="h-8 min-w-8 rounded border border-gray-200 bg-white px-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? "上传中" : "上传图"}
          </button>
          <button
            type="button"
            title="插入视频 URL"
            onMouseDown={(event) => {
              event.preventDefault();
              saveSelection();
            }}
            onClick={insertVideoUrl}
            className="h-8 min-w-8 rounded border border-gray-200 bg-white px-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
          >
            视频URL
          </button>
          <button
            type="button"
            title="上传视频并插入"
            disabled={isUploading}
            onMouseDown={(event) => {
              event.preventDefault();
              saveSelection();
            }}
            onClick={() => videoInputRef.current?.click()}
            className="h-8 min-w-8 rounded border border-gray-200 bg-white px-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? "上传中" : "上传视频"}
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
            className="hidden"
            onChange={(event) => handleUpload(event.target.files?.[0], "image")}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm"
            className="hidden"
            onChange={(event) => handleUpload(event.target.files?.[0], "video")}
          />
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-48 w-full px-3 py-3 text-sm leading-7 text-gray-900 focus:outline-none"
          onFocus={() => {
            setIsFocused(true);
            saveSelection();
          }}
          onBlur={() => {
            setIsFocused(false);
            syncValue();
          }}
          onInput={() => {
            syncValue();
            saveSelection();
          }}
          onKeyUp={saveSelection}
          onMouseUp={saveSelection}
        />
      </div>
      <p className="mt-1 text-sm text-gray-500">
        支持标题、列表、引用、分隔线、链接、图片和视频；上传后会自动插入可访问 URL。
      </p>
    </div>
  );
}

function descendantIds(menus: SiteMenuDTO[], menuId: number): Set<number> {
  const result = new Set<number>();
  const collect = (parentId: number) => {
    menus
      .filter((menu) => menu.parentId === parentId)
      .forEach((menu) => {
        result.add(menu.id);
        collect(menu.id);
      });
  };
  collect(menuId);
  return result;
}

function publicMenuHref(siteSlug: string, menu: SiteMenuDTO): string {
  const baseHref = `/sites/${siteSlug}`;
  if (menu.menuType === "HOME") return baseHref;
  return `${baseHref}/${menu.slug}`;
}

function heroFrom(config: SiteConfigDTO | null) {
  const content = config?.contentConfig ?? {};
  const hero =
    typeof content.hero === "object" && content.hero !== null
      ? (content.hero as Record<string, unknown>)
      : {};
  return hero;
}

function aboutFrom(config: SiteConfigDTO | null) {
  const content = config?.contentConfig ?? {};
  const about =
    typeof content.about === "object" && content.about !== null
      ? (content.about as Record<string, unknown>)
      : {};
  return about;
}

function contactFrom(config: SiteConfigDTO | null) {
  const content = config?.contentConfig ?? {};
  const contact =
    typeof content.contact === "object" && content.contact !== null
      ? (content.contact as Record<string, unknown>)
      : {};
  return contact;
}

function cooperationFrom(config: SiteConfigDTO | null) {
  const content = config?.contentConfig ?? {};
  const cooperation =
    typeof content.cooperation === "object" && content.cooperation !== null
      ? (content.cooperation as Record<string, unknown>)
      : {};
  return cooperation;
}

function materialReadinessItems(
  config: SiteConfigDTO | null,
  products: ProductServiceDTO[],
  news: NewsDTO[],
): Array<{ label: string; ready: boolean; detail: string }> {
  const brand = config?.brandConfig ?? {};
  const contact = contactFrom(config);
  const enabledProducts = products.filter((item) => item.enabled);
  const publishedNews = news.filter((item) => item.status === "PUBLISHED");

  return [
    {
      label: "公司名称",
      ready: Boolean(textValue(brand.companyName)),
      detail: textValue(brand.companyName) || "缺少公司全称",
    },
    {
      label: "业务方向",
      ready: Boolean(textValue(brand.businessDirection)),
      detail: textValue(brand.businessDirection) || "缺少主营业务说明",
    },
    {
      label: "联系电话",
      ready: Boolean(textValue(contact.phone)),
      detail: textValue(contact.phone) || "缺少真实电话",
    },
    {
      label: "微信",
      ready: Boolean(textValue(contact.wechat)),
      detail: textValue(contact.wechat) || "缺少微信或企业微信",
    },
    {
      label: "地址",
      ready: Boolean(textValue(contact.address)),
      detail: textValue(contact.address) || "缺少企业地址",
    },
    {
      label: "前台产品",
      ready: enabledProducts.length > 0,
      detail: enabledProducts.length
        ? `${enabledProducts.length} 个产品服务已展示`
        : "缺少可展示产品服务",
    },
    {
      label: "已发布文章",
      ready: publishedNews.length > 0,
      detail: publishedNews.length
        ? `${publishedNews.length} 篇文章已发布`
        : "缺少已发布文章或案例内容",
    },
  ];
}

export default function SiteContentPage() {
  const params = useParams();
  const siteId = params.id as string;
  const { currentSite, fetchSite } = useSiteStore();
  const [activeTab, setActiveTab] = useState<TabKey>("config");
  const [config, setConfig] = useState<SiteConfigDTO | null>(null);
  const [menus, setMenus] = useState<SiteMenuDTO[]>([]);
  const [products, setProducts] = useState<ProductServiceDTO[]>([]);
  const [news, setNews] = useState<NewsDTO[]>([]);
  const [leads, setLeads] = useState<LeadDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const [configForm, setConfigForm] = useState({
    seoTitle: "",
    seoDescription: "",
    companyName: "",
    shortName: "",
    logoUrl: "",
    businessDirection: "",
    brandWords: "",
    heroHeadline: "",
    heroSubheadline: "",
    heroPrimaryCta: "",
    heroSecondaryCta: "",
    aboutSummary: "",
    cooperationTitle: "",
    cooperationDescription: "",
    cooperationItems: "",
    phone: "",
    wechat: "",
    wechatQrUrl: "",
    address: "",
    contactNotice: "",
  });

  const [productForm, setProductForm] = useState({
    name: "",
    summary: "",
    description: "",
    imageUrl: "",
    scenarios: "",
  });
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productEditForm, setProductEditForm] = useState({
    name: "",
    summary: "",
    description: "",
    imageUrl: "",
    scenarios: "",
  });

  const [menuForm, setMenuForm] = useState({
    parentId: "",
    label: "",
    slug: "",
    sortOrder: "",
    visible: true,
  });
  const [editingMenuId, setEditingMenuId] = useState<number | null>(null);
  const [menuEditForm, setMenuEditForm] = useState({
    parentId: "",
    label: "",
    slug: "",
    sortOrder: "",
    visible: true,
  });

  const [newsForm, setNewsForm] = useState({
    menuId: "",
    title: "",
    slug: "",
    summary: "",
    content: "",
    category: "公司动态",
    coverImage: "",
  });
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [newsEditForm, setNewsEditForm] = useState({
    menuId: "",
    title: "",
    slug: "",
    summary: "",
    content: "",
    category: "",
    coverImage: "",
  });
  const [newsMenuFilter, setNewsMenuFilter] = useState("all");
  const [newsStatusFilter, setNewsStatusFilter] = useState<
    "ALL" | NewsDTO["status"]
  >("ALL");

  const orderedMenus = useMemo(() => sortMenusForDisplay(menus), [menus]);
  const filterMenus = useMemo(
    () => orderedMenus.filter((menu) => menu.menuType !== "HOME"),
    [orderedMenus],
  );
  const articleMenus = useMemo(
    () => filterMenus.filter((menu) => isLeafMenu(menus, menu.id)),
    [filterMenus, menus],
  );
  const filteredNews = useMemo(
    () =>
      news.filter((item) => {
        const menuMatched =
          newsMenuFilter === "all"
            ? true
            : newsMenuFilter === "none"
              ? !item.menuId
              : item.menuId === Number(newsMenuFilter);
        const statusMatched =
          newsStatusFilter === "ALL" ? true : item.status === newsStatusFilter;
        return menuMatched && statusMatched;
      }),
    [news, newsMenuFilter, newsStatusFilter],
  );

  const stats = useMemo(
    () => ({
      products: products.length,
      menus: menus.length,
      publishedProducts: products.filter((item) => item.enabled).length,
      news: news.length,
      publishedNews: news.filter((item) => item.status === "PUBLISHED").length,
      newLeads: leads.filter((item) => item.status === "NEW").length,
    }),
    [menus, products, news, leads],
  );
  const readinessItems = useMemo(
    () => materialReadinessItems(config, products, news),
    [config, products, news],
  );
  const readinessReadyCount = readinessItems.filter((item) => item.ready).length;
  const readinessPercent =
    readinessItems.length > 0
      ? Math.round((readinessReadyCount / readinessItems.length) * 100)
      : 0;

  const notifyError = useCallback((message: string) => {
    showErrorToast(message);
  }, []);

  const notifyUnknownError = useCallback((error: unknown, fallback: string) => {
    if (!shouldShowInlineError(error)) return;
    notifyError(getErrorMessage(error, fallback));
  }, [notifyError]);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [siteConfig, menuList, productList, newsList, leadList] = await Promise.all([
          getSiteConfig(siteId),
          listSiteMenus(siteId),
          listProductServices(siteId),
          listNews(siteId),
          listLeads(siteId),
          fetchSite(siteId),
        ]);

        setConfig(siteConfig);
        setMenus(menuList);
        setProducts(productList);
        setNews(newsList);
        setLeads(leadList);

        const hero = heroFrom(siteConfig);
        const about = aboutFrom(siteConfig);
        const contact = contactFrom(siteConfig);
        const cooperation = cooperationFrom(siteConfig);
        const seo = siteConfig.seoConfig ?? {};
        const brand = siteConfig.brandConfig ?? {};

        setConfigForm({
          seoTitle: textValue(seo.title),
          seoDescription: textValue(seo.description),
          companyName: textValue(brand.companyName),
          shortName: textValue(brand.shortName),
          logoUrl: textValue(brand.logoUrl),
          businessDirection: textValue(brand.businessDirection),
          brandWords: mapItems(brand.brandWords).join("、"),
          heroHeadline: textValue(hero.headline),
          heroSubheadline: textValue(hero.subheadline),
          heroPrimaryCta: textValue(hero.primaryCta),
          heroSecondaryCta: textValue(hero.secondaryCta),
          aboutSummary: textValue(about.summary),
          cooperationTitle: textValue(cooperation.title),
          cooperationDescription: textValue(cooperation.description),
          cooperationItems: mapItems(cooperation.items).join("、"),
          phone: textValue(contact.phone),
          wechat: textValue(contact.wechat),
          wechatQrUrl: textValue(contact.wechatQrUrl),
          address: textValue(contact.address),
          contactNotice: textValue(contact.notice),
        });
      } catch (err) {
        notifyUnknownError(
          err,
          "内容管理数据加载失败，请确认后端已启动且已登录。",
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (siteId) {
      load();
    }
  }, [siteId, fetchSite, notifyUnknownError]);

  const handleConfigSave = async () => {
    if (!config) return;
    setIsSaving(true);
    setSuccess("");
    try {
      const nextConfig = await updateSiteConfig(siteId, {
        seoConfig: {
          ...config.seoConfig,
          title: configForm.seoTitle,
          description: configForm.seoDescription,
        },
        themeConfig: config.themeConfig,
        navigationConfig: config.navigationConfig,
        customConfig: config.customConfig,
        brandConfig: {
          ...config.brandConfig,
          companyName: configForm.companyName,
          shortName: configForm.shortName,
          logoUrl: configForm.logoUrl || null,
          businessDirection: configForm.businessDirection,
          brandWords: configForm.brandWords
            ? splitList(configForm.brandWords)
            : [],
        },
        contentConfig: {
          ...config.contentConfig,
          hero: {
            ...heroFrom(config),
            headline: configForm.heroHeadline,
            subheadline: configForm.heroSubheadline,
            primaryCta: configForm.heroPrimaryCta,
            secondaryCta: configForm.heroSecondaryCta,
          },
          about: {
            ...aboutFrom(config),
            summary: configForm.aboutSummary,
          },
          cooperation: {
            ...cooperationFrom(config),
            title: configForm.cooperationTitle,
            description: configForm.cooperationDescription,
            items: configForm.cooperationItems
              ? splitList(configForm.cooperationItems)
              : [],
          },
          contact: {
            ...contactFrom(config),
            phone: configForm.phone || null,
            wechat: configForm.wechat || null,
            wechatQrUrl: configForm.wechatQrUrl || null,
            address: configForm.address || null,
            notice: configForm.contactNotice,
          },
        },
      });
      setConfig(nextConfig);
      setSuccess("站点配置已保存。");
    } catch (err) {
      notifyUnknownError(err, "站点配置保存失败。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!productForm.name || !productForm.summary) {
      notifyError("请填写产品名称和摘要。");
      return;
    }
    setIsSaving(true);
    setSuccess("");
    try {
      const created = await createProductService(siteId, {
        name: productForm.name,
        summary: productForm.summary,
        description: productForm.description,
        imageUrl: productForm.imageUrl || undefined,
        scenarios: splitList(productForm.scenarios),
        sortOrder: products.length + 1,
        enabled: true,
      });
      setProducts((items) => [...items, created]);
      setProductForm({
        name: "",
        summary: "",
        description: "",
        imageUrl: "",
        scenarios: "",
      });
      setSuccess("产品服务已新增。");
    } catch (err) {
      notifyUnknownError(err, "产品服务新增失败。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm("确定删除这个产品服务吗？")) return;
    await deleteProductService(siteId, productId);
    setProducts((items) => items.filter((item) => item.id !== productId));
  };

  const handleToggleProduct = async (product: ProductServiceDTO) => {
    const updated = await updateProductEnabled(siteId, product.id, !product.enabled);
    setProducts((items) =>
      items.map((item) => (item.id === updated.id ? updated : item)),
    );
  };

  const startEditProduct = (product: ProductServiceDTO) => {
    setEditingProductId(product.id);
    setProductEditForm({
      name: product.name,
      summary: product.summary,
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      scenarios: (product.scenarios ?? []).map(String).join("、"),
    });
    setSuccess("");
  };

  const cancelEditProduct = () => {
    setEditingProductId(null);
    setProductEditForm({
      name: "",
      summary: "",
      description: "",
      imageUrl: "",
      scenarios: "",
    });
  };

  const handleUpdateProduct = async (product: ProductServiceDTO) => {
    if (!productEditForm.name || !productEditForm.summary) {
      notifyError("请填写产品名称和摘要。");
      return;
    }

    setIsSaving(true);
    setSuccess("");
    try {
      const updated = await updateProductService(siteId, product.id, {
        name: productEditForm.name,
        summary: productEditForm.summary,
        description: productEditForm.description,
        imageUrl: productEditForm.imageUrl || undefined,
        scenarios: splitList(productEditForm.scenarios),
        sortOrder: product.sortOrder,
        enabled: product.enabled,
      });
      setProducts((items) =>
        items.map((item) => (item.id === updated.id ? updated : item)),
      );
      cancelEditProduct();
      setSuccess("产品服务已更新。");
    } catch (err) {
      notifyUnknownError(err, "产品服务更新失败。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateMenu = async () => {
    if (!menuForm.label || !menuForm.slug) {
      notifyError("请填写菜单名称和访问标识。");
      return;
    }
    setIsSaving(true);
    setSuccess("");
    try {
      const created = await createSiteMenu(siteId, {
        parentId: menuForm.parentId ? Number(menuForm.parentId) : null,
        label: menuForm.label,
        slug: menuForm.slug,
        sortOrder: menuForm.sortOrder ? Number(menuForm.sortOrder) : menus.length + 1,
        visible: menuForm.visible,
      });
      setMenus((items) => sortMenusForDisplay([...items, created]));
      setMenuForm({
        parentId: "",
        label: "",
        slug: "",
        sortOrder: "",
        visible: true,
      });
      setSuccess("菜单栏目已新增。");
    } catch (err) {
      notifyUnknownError(err, "菜单栏目新增失败。");
    } finally {
      setIsSaving(false);
    }
  };

  const startEditMenu = (menu: SiteMenuDTO) => {
    setEditingMenuId(menu.id);
    setMenuEditForm({
      parentId: menu.parentId ? String(menu.parentId) : "",
      label: menu.label,
      slug: menu.slug,
      sortOrder: String(menu.sortOrder),
      visible: menu.visible,
    });
    setSuccess("");
  };

  const cancelEditMenu = () => {
    setEditingMenuId(null);
    setMenuEditForm({
      parentId: "",
      label: "",
      slug: "",
      sortOrder: "",
      visible: true,
    });
  };

  const handleUpdateMenu = async (menu: SiteMenuDTO) => {
    if (!menuEditForm.label || !menuEditForm.slug) {
      notifyError("请填写菜单名称和访问标识。");
      return;
    }
    setIsSaving(true);
    setSuccess("");
    try {
      const updated = await updateSiteMenu(siteId, menu.id, {
        parentId: menuEditForm.parentId ? Number(menuEditForm.parentId) : null,
        label: menuEditForm.label,
        slug: menuEditForm.slug,
        sortOrder: menuEditForm.sortOrder ? Number(menuEditForm.sortOrder) : menu.sortOrder,
        visible: menuEditForm.visible,
      });
      setMenus((items) =>
        items
          .map((item) => (item.id === updated.id ? updated : item))
          .sort(
            (a, b) =>
              a.sortOrder - b.sortOrder ||
              a.createdAt.localeCompare(b.createdAt) ||
              a.id - b.id,
          ),
      );
      cancelEditMenu();
      setSuccess("菜单栏目已更新。");
    } catch (err) {
      notifyUnknownError(err, "菜单栏目更新失败。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMenu = async (menu: SiteMenuDTO) => {
    if (!window.confirm(`确定删除菜单“${menu.label}”吗？`)) return;
    setSuccess("");
    try {
      await deleteSiteMenu(siteId, menu.id);
      setMenus((items) => items.filter((item) => item.id !== menu.id));
      setNews((items) =>
        items.map((item) =>
          item.menuId === menu.id ? { ...item, menuId: null } : item,
        ),
      );
      setSuccess("菜单栏目已删除。");
    } catch (err) {
      notifyUnknownError(err, "菜单栏目删除失败。");
    }
  };

  const startCreateNewsForMenu = (menu: SiteMenuDTO) => {
    if (menu.menuType === "HOME") {
      notifyError("首页菜单不能直接挂文章，请选择其他栏目。");
      return;
    }
    if (!isLeafMenu(menus, menu.id)) {
      notifyError("这个菜单下面还有子菜单，文章只能挂在最后一级菜单下。");
      return;
    }
    setActiveTab("news");
    setNewsMenuFilter(String(menu.id));
    setNewsStatusFilter("ALL");
    setNewsForm((form) => ({
      ...form,
      menuId: String(menu.id),
      category: menu.label,
    }));
    setSuccess(`已切换到文章编辑，并预选栏目：${menuPath(menus, menu.id)}。`);
  };

  const handleCreateNews = async () => {
    if (!newsForm.title || !newsForm.slug) {
      notifyError("请填写文章标题和访问标识。");
      return;
    }
    const menuWarning = articleMenuWarning(
      menus,
      newsForm.menuId ? Number(newsForm.menuId) : null,
    );
    if (menuWarning) {
      notifyError(`请选择可挂文章的栏目：${menuWarning}。`);
      return;
    }
    setIsSaving(true);
    setSuccess("");
    try {
      const created = await createNews(siteId, {
        ...newsForm,
        menuId: newsForm.menuId ? Number(newsForm.menuId) : null,
        status: "DRAFT",
      });
      setNews((items) => [created, ...items]);
      setNewsForm({
        menuId: "",
        title: "",
        slug: "",
        summary: "",
        content: "",
        category: "公司动态",
        coverImage: "",
      });
      setSuccess("栏目文章已保存为草稿。");
    } catch (err) {
      notifyUnknownError(err, "栏目文章新增失败。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOfflineNews = async (item: NewsDTO) => {
    if (!window.confirm(`确定下线文章“${item.title}”吗？下线后不会在前台展示，但后台仍可重新发布。`)) return;
    await offlineNews(siteId, item.id);
    setNews((items) =>
      items.map((newsItem) =>
        newsItem.id === item.id
          ? { ...newsItem, status: "OFFLINE", publishedAt: null }
          : newsItem,
      ),
    );
    setSuccess("文章已下线，可后续重新发布。");
  };

  const handleNewsStatus = async (item: NewsDTO, status: NewsDTO["status"]) => {
    if (status === "PUBLISHED") {
      const menuWarning = articleMenuWarning(menus, item.menuId);
      if (menuWarning) {
        notifyError(`这篇文章暂不能发布：${menuWarning}。`);
        return;
      }
      const warnings = newsReadinessWarnings(menus, item);
      if (
        warnings.length > 0 &&
        !window.confirm(
          `这篇文章还有 ${warnings.join("、")} 的问题，发布后前台效果可能不完整。仍然发布吗？`,
        )
      ) {
        return;
      }
    }

    const updated = await updateNewsStatus(siteId, item.id, status);
    setNews((items) =>
      items.map((newsItem) => (newsItem.id === updated.id ? updated : newsItem)),
    );
  };

  const startEditNews = (item: NewsDTO) => {
    setEditingNewsId(item.id);
    setNewsEditForm({
      menuId: item.menuId ? String(item.menuId) : "",
      title: item.title,
      slug: item.slug,
      summary: item.summary || "",
      content: item.content || "",
      category: item.category || "",
      coverImage: item.coverImage || "",
    });
    setSuccess("");
  };

  const cancelEditNews = () => {
    setEditingNewsId(null);
    setNewsEditForm({
      menuId: "",
      title: "",
      slug: "",
      summary: "",
      content: "",
      category: "",
      coverImage: "",
    });
  };

  const handleUpdateNews = async (item: NewsDTO) => {
    if (!newsEditForm.title || !newsEditForm.slug) {
      notifyError("请填写文章标题和访问标识。");
      return;
    }
    const menuWarning = articleMenuWarning(
      menus,
      newsEditForm.menuId ? Number(newsEditForm.menuId) : null,
    );
    if (menuWarning) {
      notifyError(`请选择可挂文章的栏目：${menuWarning}。`);
      return;
    }

    setIsSaving(true);
    setSuccess("");
    try {
      const updated = await updateNews(siteId, item.id, {
        menuId: newsEditForm.menuId ? Number(newsEditForm.menuId) : null,
        title: newsEditForm.title,
        slug: newsEditForm.slug,
        summary: newsEditForm.summary,
        content: newsEditForm.content,
        category: newsEditForm.category,
        coverImage: newsEditForm.coverImage || undefined,
        status: item.status,
      });
      setNews((items) =>
        items.map((newsItem) => (newsItem.id === updated.id ? updated : newsItem)),
      );
      cancelEditNews();
      setSuccess("栏目文章已更新。");
    } catch (err) {
      notifyUnknownError(err, "栏目文章更新失败。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLeadStatus = async (lead: LeadDTO, status: LeadDTO["status"]) => {
    const updated = await updateLeadStatus(siteId, lead.id, status);
    setLeads((items) =>
      items.map((leadItem) => (leadItem.id === updated.id ? updated : leadItem)),
    );
  };

  if (isLoading) {
    return <Loading fullScreen text="正在加载内容管理..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-gray-500">内容管理</p>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentSite?.name || `站点 #${siteId}`}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            管理前台官网所需的配置、产品服务、栏目文章和留言线索。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {currentSite?.slug ? (
            <Link href={`/sites/${currentSite.slug}`} target="_blank">
              <Button variant="outline">查看前台</Button>
            </Link>
          ) : null}
          <Link href={`/dashboard/sites/${siteId}`}>
            <Button variant="secondary">返回站点详情</Button>
          </Link>
        </div>
      </div>

      {success ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                上线资料检查
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                不编造企业事实；缺少真实资料时先明确标记，补齐后再正式对外使用。
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-2xl font-bold text-gray-900">
                {readinessPercent}%
              </p>
              <p className="text-sm text-gray-500">
                {readinessReadyCount}/{readinessItems.length} 项已就绪
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {readinessItems.map((item) => (
              <div
                key={item.label}
                className={`rounded-lg border p-3 ${
                  item.ready
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900">
                    {item.label}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.ready
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.ready ? "已就绪" : "待补充"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardContent>
            <p className="text-sm text-gray-500">菜单栏目</p>
            <p className="mt-2 text-2xl font-bold">{stats.menus}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-gray-500">产品服务</p>
            <p className="mt-2 text-2xl font-bold">{stats.products}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-gray-500">前台展示产品</p>
            <p className="mt-2 text-2xl font-bold">{stats.publishedProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-gray-500">栏目文章</p>
            <p className="mt-2 text-2xl font-bold">{stats.news}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-gray-500">已发布文章</p>
            <p className="mt-2 text-2xl font-bold">{stats.publishedNews}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-gray-500">新线索</p>
            <p className="mt-2 text-2xl font-bold">{stats.newLeads}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`border-b-2 px-4 py-3 text-sm font-medium ${
              activeTab === tab.key
                ? "border-primary-600 text-primary-700"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "config" ? (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">站点配置</h2>
            <p className="mt-1 text-sm text-gray-500">
              这些字段会影响春昌官网首页、SEO、联系方式和合作内容。
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="SEO 标题"
                value={configForm.seoTitle}
                onChange={(event) =>
                  setConfigForm((form) => ({
                    ...form,
                    seoTitle: event.target.value,
                  }))
                }
              />
              <Input
                label="SEO 描述"
                value={configForm.seoDescription}
                onChange={(event) =>
                  setConfigForm((form) => ({
                    ...form,
                    seoDescription: event.target.value,
                  }))
                }
              />
              <Input
                label="公司全称"
                value={configForm.companyName}
                onChange={(event) =>
                  setConfigForm((form) => ({
                    ...form,
                    companyName: event.target.value,
                  }))
                }
              />
              <Input
                label="简称"
                value={configForm.shortName}
                onChange={(event) =>
                  setConfigForm((form) => ({
                    ...form,
                    shortName: event.target.value,
                  }))
                }
              />
              <Input
                label="Logo 图片 URL"
                helperText="可填写公网图片地址，也可以上传后自动填入 URL；未填写时前台使用文字标识。"
                value={configForm.logoUrl}
                onChange={(event) =>
                  setConfigForm((form) => ({
                    ...form,
                    logoUrl: event.target.value,
                  }))
                }
              />
              <div className="flex items-end">
                <MediaUploadButton
                  accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                  label="上传 Logo"
                  onError={notifyError}
                  onUploaded={(url) =>
                    setConfigForm((form) => ({ ...form, logoUrl: url }))
                  }
                />
              </div>
              <ImagePreview
                url={configForm.logoUrl}
                label="Logo 预览"
                compact
              />
              <Input
                label="业务方向"
                value={configForm.businessDirection}
                onChange={(event) =>
                  setConfigForm((form) => ({
                    ...form,
                    businessDirection: event.target.value,
                  }))
                }
              />
              <Input
                label="品牌关键词"
                helperText="用顿号或逗号分隔"
                value={configForm.brandWords}
                onChange={(event) =>
                  setConfigForm((form) => ({
                    ...form,
                    brandWords: event.target.value,
                  }))
                }
              />
              <Input
                label="首页主标题"
                value={configForm.heroHeadline}
                onChange={(event) =>
                  setConfigForm((form) => ({
                    ...form,
                    heroHeadline: event.target.value,
                  }))
                }
              />
              <Input
                label="首页按钮"
                value={configForm.heroPrimaryCta}
                onChange={(event) =>
                  setConfigForm((form) => ({
                    ...form,
                    heroPrimaryCta: event.target.value,
                  }))
                }
              />
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                首页副标题
              </span>
              <textarea
                className="min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={configForm.heroSubheadline}
                onChange={(event) =>
                  setConfigForm((form) => ({
                    ...form,
                    heroSubheadline: event.target.value,
                  }))
                }
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                关于我们摘要
              </span>
              <textarea
                className="min-h-28 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={configForm.aboutSummary}
                onChange={(event) =>
                  setConfigForm((form) => ({
                    ...form,
                    aboutSummary: event.target.value,
                  }))
                }
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="合作标题"
                value={configForm.cooperationTitle}
                onChange={(event) =>
                  setConfigForm((form) => ({
                    ...form,
                    cooperationTitle: event.target.value,
                  }))
                }
              />
              <Input
                label="合作项目"
                helperText="用顿号或逗号分隔"
                value={configForm.cooperationItems}
                onChange={(event) =>
                  setConfigForm((form) => ({
                    ...form,
                    cooperationItems: event.target.value,
                  }))
                }
              />
              <Input
                label="电话"
                value={configForm.phone}
                onChange={(event) =>
                  setConfigForm((form) => ({
                    ...form,
                    phone: event.target.value,
                  }))
                }
              />
              <Input
                label="微信"
                value={configForm.wechat}
                onChange={(event) =>
                  setConfigForm((form) => ({
                    ...form,
                    wechat: event.target.value,
                  }))
                }
              />
              <Input
                label="微信二维码 URL"
                helperText="可填写二维码图片地址，也可以上传后自动填入 URL；公开站会在联系区展示。"
                value={configForm.wechatQrUrl}
                onChange={(event) =>
                  setConfigForm((form) => ({
                    ...form,
                    wechatQrUrl: event.target.value,
                  }))
                }
              />
              <div className="flex items-end">
                <MediaUploadButton
                  accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                  label="上传二维码"
                  onError={notifyError}
                  onUploaded={(url) =>
                    setConfigForm((form) => ({ ...form, wechatQrUrl: url }))
                  }
                />
              </div>
              <ImagePreview
                url={configForm.wechatQrUrl}
                label="微信二维码预览"
                compact
              />
              <Input
                label="地址"
                value={configForm.address}
                onChange={(event) =>
                  setConfigForm((form) => ({
                    ...form,
                    address: event.target.value,
                  }))
                }
              />
              <Input
                label="联系方式提示"
                value={configForm.contactNotice}
                onChange={(event) =>
                  setConfigForm((form) => ({
                    ...form,
                    contactNotice: event.target.value,
                  }))
                }
              />
            </div>
            <Button onClick={handleConfigSave} isLoading={isSaving}>
              保存站点配置
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {activeTab === "products" ? (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">新增产品服务</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="名称"
                value={productForm.name}
                onChange={(event) =>
                  setProductForm((form) => ({ ...form, name: event.target.value }))
                }
              />
              <Input
                label="摘要"
                value={productForm.summary}
                onChange={(event) =>
                  setProductForm((form) => ({
                    ...form,
                    summary: event.target.value,
                  }))
                }
              />
              <Input
                label="适用场景"
                helperText="用顿号或逗号分隔"
                value={productForm.scenarios}
                onChange={(event) =>
                  setProductForm((form) => ({
                    ...form,
                    scenarios: event.target.value,
                  }))
                }
              />
              <Input
                label="产品图片 URL"
                helperText="可填写真实产品图地址，也可以上传后自动填入 URL；未填写时前台显示文字卡片。"
                value={productForm.imageUrl}
                onChange={(event) =>
                  setProductForm((form) => ({
                    ...form,
                    imageUrl: event.target.value,
                  }))
                }
              />
              <MediaUploadButton
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                label="上传产品图"
                onError={notifyError}
                onUploaded={(url) =>
                  setProductForm((form) => ({ ...form, imageUrl: url }))
                }
              />
              <ImagePreview url={productForm.imageUrl} label="产品图片预览" />
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">
                  说明
                </span>
                <textarea
                  className="min-h-28 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  value={productForm.description}
                  onChange={(event) =>
                    setProductForm((form) => ({
                      ...form,
                      description: event.target.value,
                    }))
                  }
                />
              </label>
              <Button onClick={handleCreateProduct} isLoading={isSaving}>
                新增产品服务
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">产品服务列表</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  {editingProductId === product.id ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          label="名称"
                          value={productEditForm.name}
                          onChange={(event) =>
                            setProductEditForm((form) => ({
                              ...form,
                              name: event.target.value,
                            }))
                          }
                        />
                        <Input
                          label="适用场景"
                          helperText="用顿号或逗号分隔"
                          value={productEditForm.scenarios}
                          onChange={(event) =>
                            setProductEditForm((form) => ({
                              ...form,
                              scenarios: event.target.value,
                            }))
                          }
                        />
                        <Input
                          label="产品图片 URL"
                          helperText="可填写公网图片地址，也可以上传后自动填入 URL。"
                          value={productEditForm.imageUrl}
                          onChange={(event) =>
                            setProductEditForm((form) => ({
                              ...form,
                              imageUrl: event.target.value,
                            }))
                          }
                        />
                        <div className="flex items-end">
                          <MediaUploadButton
                            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                            label="上传产品图"
                            onError={notifyError}
                            onUploaded={(url) =>
                              setProductEditForm((form) => ({
                                ...form,
                                imageUrl: url,
                              }))
                            }
                          />
                        </div>
                        <ImagePreview
                          url={productEditForm.imageUrl}
                          label="产品图片预览"
                        />
                      </div>
                      <Input
                        label="摘要"
                        value={productEditForm.summary}
                        onChange={(event) =>
                          setProductEditForm((form) => ({
                            ...form,
                            summary: event.target.value,
                          }))
                        }
                      />
                      <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-gray-700">
                          说明
                        </span>
                        <textarea
                          className="min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                          value={productEditForm.description}
                          onChange={(event) =>
                            setProductEditForm((form) => ({
                              ...form,
                              description: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateProduct(product)}
                          isLoading={isSaving}
                        >
                          保存
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEditProduct}
                        >
                          取消
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {product.summary}
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          {(product.scenarios ?? []).map(String).join("、") ||
                            "暂无场景"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          图片：{product.imageUrl ? "已配置" : "未配置"}
                        </p>
                        <ImagePreview
                          url={product.imageUrl}
                          label="当前产品图片"
                        />
                        <span
                          className={`mt-3 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            product.enabled
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {product.enabled ? "前台展示" : "已下线"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditProduct(product)}
                        >
                          编辑
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleProduct(product)}
                        >
                          {product.enabled ? "下线" : "上线"}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          删除
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {products.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  暂无产品服务。
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {activeTab === "menus" ? (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">新增菜单栏目</h2>
              <p className="mt-1 text-sm text-gray-500">
                菜单可自由挂到一级、二级或三级；只有没有子菜单的最后一级栏目可以维护文章。
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  上级菜单
                </label>
                <select
                  value={menuForm.parentId}
                  onChange={(event) =>
                    setMenuForm((form) => ({
                      ...form,
                      parentId: event.target.value,
                    }))
                  }
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
                >
                  <option value="">一级菜单</option>
                  {orderedMenus
                    .filter((menu) => menu.level < 3)
                    .map((menu) => (
                      <option key={menu.id} value={menu.id}>
                        {"　".repeat(Math.max(0, menu.level - 1))}
                        {menu.label}
                      </option>
                    ))}
                </select>
              </div>
              <Input
                label="菜单名称"
                value={menuForm.label}
                onChange={(event) => {
                  const label = event.target.value;
                  setMenuForm((form) => ({
                    ...form,
                    label,
                    slug: form.slug || slugify(label),
                  }));
                }}
              />
              <Input
                label="访问标识"
                value={menuForm.slug}
                onChange={(event) =>
                  setMenuForm((form) => ({ ...form, slug: event.target.value }))
                }
              />
              <Input
                label="排序"
                type="number"
                value={menuForm.sortOrder}
                onChange={(event) =>
                  setMenuForm((form) => ({
                    ...form,
                    sortOrder: event.target.value,
                  }))
                }
              />
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={menuForm.visible}
                  onChange={(event) =>
                    setMenuForm((form) => ({
                      ...form,
                      visible: event.target.checked,
                    }))
                  }
                />
                前台显示
              </label>
              <Button onClick={handleCreateMenu} isLoading={isSaving}>
                新增菜单
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">菜单栏目列表</h2>
              <p className="mt-1 text-sm text-gray-500">
                按前台导航层级展示。父级栏目用于分组和导航，文章只能挂在最后一级栏目下。
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderedMenus.map((menu) => {
                const childCount = countChildren(menus, menu.id);
                const articleCount = countMenuNews(news, menu.id);
                const canOwnArticles =
                  menu.menuType !== "HOME" && childCount === 0;
                const blockedParentIds = descendantIds(menus, menu.id);
                return (
                <div
                  key={menu.id}
                  className={`rounded-lg border p-4 ${
                    menu.visible
                      ? "border-gray-200 bg-white"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  {editingMenuId === menu.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          上级菜单
                        </label>
                        <select
                          value={menuEditForm.parentId}
                          disabled={menu.menuType === "HOME"}
                          onChange={(event) =>
                            setMenuEditForm((form) => ({
                              ...form,
                              parentId: event.target.value,
                            }))
                          }
                          className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm disabled:bg-gray-100"
                        >
                          <option value="">一级菜单</option>
                          {orderedMenus
                            .filter(
                              (item) =>
                                item.level < 3 &&
                                item.id !== menu.id &&
                                !blockedParentIds.has(item.id),
                            )
                            .map((item) => (
                              <option key={item.id} value={item.id}>
                                {"　".repeat(Math.max(0, item.level - 1))}
                                {item.label}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          label="菜单名称"
                          value={menuEditForm.label}
                          onChange={(event) =>
                            setMenuEditForm((form) => ({
                              ...form,
                              label: event.target.value,
                            }))
                          }
                        />
                        <Input
                          label="访问标识"
                          disabled={menu.menuType === "HOME"}
                          value={menuEditForm.slug}
                          onChange={(event) =>
                            setMenuEditForm((form) => ({
                              ...form,
                              slug: event.target.value,
                            }))
                          }
                        />
                        <Input
                          label="排序"
                          type="number"
                          value={menuEditForm.sortOrder}
                          onChange={(event) =>
                            setMenuEditForm((form) => ({
                              ...form,
                              sortOrder: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={menuEditForm.visible}
                          onChange={(event) =>
                            setMenuEditForm((form) => ({
                              ...form,
                              visible: event.target.checked,
                            }))
                          }
                        />
                        前台显示
                      </label>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateMenu(menu)}
                          isLoading={isSaving}
                        >
                          保存
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditMenu}>
                          取消
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span>{menu.menuType === "HOME" ? "首页" : "栏目"}</span>
                          <span>{menu.level} 级</span>
                          <span>{menu.visible ? "前台显示" : "已隐藏"}</span>
                          {menu.menuType !== "HOME" ? (
                            <span>
                              {canOwnArticles ? "最后一级，可写文章" : "分组菜单"}
                            </span>
                          ) : null}
                          <span>/{menu.slug}</span>
                        </div>
                        <h3
                          className="mt-2 font-semibold text-gray-900"
                          style={{ paddingLeft: `${(menu.level - 1) * 18}px` }}
                        >
                          {menu.label}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          路径：{menuPath(menus, menu.id)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          子栏目 {childCount} 个 · 文章 {articleCount} 篇
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditMenu(menu)}
                        >
                          编辑
                        </Button>
                        {currentSite?.slug && menu.visible ? (
                          <Link
                            href={publicMenuHref(currentSite.slug, menu)}
                            target="_blank"
                          >
                            <Button size="sm" variant="outline">查看前台</Button>
                          </Link>
                        ) : null}
                        {canOwnArticles ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startCreateNewsForMenu(menu)}
                          >
                            写文章
                          </Button>
                        ) : null}
                        {menu.menuType !== "HOME" && !canOwnArticles ? (
                          <span className="inline-flex h-9 items-center rounded-md bg-gray-100 px-3 text-xs font-medium text-gray-500">
                            文章挂到子栏目
                          </span>
                        ) : null}
                        {menu.menuType !== "HOME" ? (
                          <Button
                            size="sm"
                            variant="danger"
                            disabled={childCount > 0}
                            onClick={() => handleDeleteMenu(menu)}
                          >
                            删除
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
              {orderedMenus.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  暂无菜单栏目。
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {activeTab === "news" ? (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">新增栏目文章</h2>
              <p className="mt-1 text-sm text-gray-500">
                文章必须归属到最后一级栏目。父级菜单只负责导航分组，不能直接挂文章。
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-800">
                建议发布前补齐所属栏目、摘要和正文。公开站只展示“已发布”文章，草稿不会出现在前台。
              </div>
              <Input
                label="标题"
                value={newsForm.title}
                onChange={(event) => {
                  const title = event.target.value;
                  setNewsForm((form) => ({
                    ...form,
                    title,
                    slug: form.slug || slugify(title),
                  }));
                }}
              />
              <Input
                label="访问标识"
                value={newsForm.slug}
                onChange={(event) =>
                  setNewsForm((form) => ({ ...form, slug: event.target.value }))
                }
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  所属菜单
                </label>
                <select
                  value={newsForm.menuId}
                  onChange={(event) =>
                    setNewsForm((form) => ({
                      ...form,
                      menuId: event.target.value,
                    }))
                  }
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
                >
                  <option value="">请选择最后一级栏目</option>
                  {articleMenus
                    .map((menu) => (
                      <option key={menu.id} value={menu.id}>
                        {"　".repeat(Math.max(0, menu.level - 1))}
                        {menu.label}
                      </option>
                    ))}
                </select>
              </div>
              <Input
                label="分类"
                value={newsForm.category}
                onChange={(event) =>
                  setNewsForm((form) => ({
                    ...form,
                    category: event.target.value,
                  }))
                }
              />
              <Input
                label="封面图片 URL"
                helperText="可填写真实新闻或产品图片地址，也可以上传后自动填入 URL；未填写时前台显示文字内容。"
                value={newsForm.coverImage}
                onChange={(event) =>
                  setNewsForm((form) => ({
                    ...form,
                    coverImage: event.target.value,
                  }))
                }
              />
              <MediaUploadButton
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                label="上传封面"
                onError={notifyError}
                onUploaded={(url) =>
                  setNewsForm((form) => ({ ...form, coverImage: url }))
                }
              />
              <ImagePreview url={newsForm.coverImage} label="封面图片预览" />
              <Input
                label="摘要"
                helperText={`${charCount(newsForm.summary)} 字；建议 20-120 字，便于前台列表展示。`}
                value={newsForm.summary}
                onChange={(event) =>
                  setNewsForm((form) => ({
                    ...form,
                    summary: event.target.value,
                  }))
                }
              />
              <RichTextEditor
                label="正文（富文本）"
                value={newsForm.content}
                onChange={(content) =>
                  setNewsForm((form) => ({
                    ...form,
                    content,
                  }))
                }
                onError={notifyError}
              />
              <p className="text-sm text-gray-500">
                {charCount(newsForm.content)} 字；建议至少 80 字，避免发布后详情页过空。
              </p>
              <Button onClick={handleCreateNews} isLoading={isSaving}>
                保存为草稿
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">文章列表</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    当前显示 {filteredNews.length} / {news.length} 篇。
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <select
                    value={newsMenuFilter}
                    onChange={(event) => setNewsMenuFilter(event.target.value)}
                    className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm"
                  >
                    <option value="all">全部栏目</option>
                    <option value="none">未归属栏目</option>
                    {filterMenus.map((menu) => (
                      <option key={menu.id} value={menu.id}>
                        {"　".repeat(Math.max(0, menu.level - 1))}
                        {menu.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newsStatusFilter}
                    onChange={(event) =>
                      setNewsStatusFilter(
                        event.target.value as "ALL" | NewsDTO["status"],
                      )
                    }
                    className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm"
                  >
                    <option value="ALL">全部状态</option>
                    {Object.entries(newsStatusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredNews.map((item) => (
                <div key={item.id} className="rounded-lg border p-4">
                  {editingNewsId === item.id ? (
                    <div className="space-y-4">
                      {newsReadinessWarnings(menus, {
                        menuId: newsEditForm.menuId
                          ? Number(newsEditForm.menuId)
                          : null,
                        summary: newsEditForm.summary,
                        content: newsEditForm.content,
                      }).length ? (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800">
                          发布前建议处理：
                          {newsReadinessWarnings(menus, {
                            menuId: newsEditForm.menuId
                              ? Number(newsEditForm.menuId)
                              : null,
                            summary: newsEditForm.summary,
                            content: newsEditForm.content,
                          }).join("、")}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                          这篇文章的栏目、摘要和正文长度已满足基础发布建议。
                        </div>
                      )}
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          label="标题"
                          value={newsEditForm.title}
                          onChange={(event) => {
                            const title = event.target.value;
                            setNewsEditForm((form) => ({
                              ...form,
                              title,
                              slug: form.slug || slugify(title),
                            }));
                          }}
                        />
                        <Input
                          label="访问标识"
                          value={newsEditForm.slug}
                          onChange={(event) =>
                            setNewsEditForm((form) => ({
                              ...form,
                              slug: event.target.value,
                            }))
                          }
                        />
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            所属菜单
                          </label>
                          <select
                            value={newsEditForm.menuId}
                            onChange={(event) =>
                              setNewsEditForm((form) => ({
                                ...form,
                                menuId: event.target.value,
                              }))
                            }
                            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
                          >
                            <option value="">请选择最后一级栏目</option>
                            {articleMenus
                              .map((menu) => (
                                <option key={menu.id} value={menu.id}>
                                  {"　".repeat(Math.max(0, menu.level - 1))}
                                  {menu.label}
                                </option>
                              ))}
                          </select>
                        </div>
                        <Input
                          label="分类"
                          value={newsEditForm.category}
                          onChange={(event) =>
                            setNewsEditForm((form) => ({
                              ...form,
                              category: event.target.value,
                            }))
                          }
                        />
                        <Input
                          label="封面图片 URL"
                          helperText="可填写公网图片地址，也可以上传后自动填入 URL。"
                          value={newsEditForm.coverImage}
                          onChange={(event) =>
                            setNewsEditForm((form) => ({
                              ...form,
                              coverImage: event.target.value,
                            }))
                          }
                        />
                        <div className="flex items-end">
                          <MediaUploadButton
                            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                            label="上传封面"
                            onError={notifyError}
                            onUploaded={(url) =>
                              setNewsEditForm((form) => ({
                                ...form,
                                coverImage: url,
                              }))
                            }
                          />
                        </div>
                        <ImagePreview
                          url={newsEditForm.coverImage}
                          label="封面图片预览"
                        />
                        <Input
                          label="摘要"
                          helperText={`${charCount(newsEditForm.summary)} 字；建议 20-120 字。`}
                          value={newsEditForm.summary}
                          onChange={(event) =>
                            setNewsEditForm((form) => ({
                              ...form,
                              summary: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <RichTextEditor
                        label="正文（富文本）"
                        value={newsEditForm.content}
                        onChange={(content) =>
                          setNewsEditForm((form) => ({
                            ...form,
                            content,
                          }))
                        }
                        onError={notifyError}
                      />
                      <p className="text-sm text-gray-500">
                        {charCount(newsEditForm.content)} 字；建议至少 80 字。
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateNews(item)}
                          isLoading={isSaving}
                        >
                          保存
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditNews}>
                          取消
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span>{menuPath(menus, item.menuId)}</span>
                          <span>{item.category || "未分类"}</span>
                          <span>{newsStatusLabels[item.status]}</span>
                          <span>{formatDate(item.updatedAt)}</span>
                        </div>
                        <h3 className="mt-2 font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {item.summary || "暂无摘要"}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {newsReadinessWarnings(menus, item).length ? (
                            newsReadinessWarnings(menus, item).map((warning) => (
                              <span
                                key={warning}
                                className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
                              >
                                {warning}
                              </span>
                            ))
                          ) : (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              发布资料完整
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          摘要 {charCount(item.summary)} 字 · 正文{" "}
                          {charCount(item.content)} 字
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          封面：{item.coverImage ? "已配置" : "未配置"}
                        </p>
                        <ImagePreview url={item.coverImage} label="当前封面" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditNews(item)}
                        >
                          编辑
                        </Button>
                        {currentSite?.slug && item.status === "PUBLISHED" ? (
                          <Link
                            href={`/sites/${currentSite.slug}/articles/${item.slug}`}
                            target="_blank"
                          >
                            <Button size="sm" variant="outline">查看前台</Button>
                          </Link>
                        ) : null}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleNewsStatus(
                              item,
                              item.status === "PUBLISHED" ? "OFFLINE" : "PUBLISHED",
                            )
                          }
                        >
                          {item.status === "PUBLISHED" ? "下线" : "发布"}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleOfflineNews(item)}
                        >
                          下线
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {news.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  暂无栏目文章。
                </p>
              ) : null}
              {news.length > 0 && filteredNews.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  当前筛选条件下没有文章。
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {activeTab === "leads" ? (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">留言线索</h2>
            <p className="mt-1 text-sm text-gray-500">
              线索来自前台咨询表单，可在这里标记跟进状态。
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="rounded-lg border p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {lead.name} · {lead.phone}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {lead.companyName || "未填写公司"} ·{" "}
                      {lead.cooperationType || "未填写合作类型"} ·{" "}
                      {formatDate(lead.createdAt)}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-gray-700">
                      {lead.message}
                    </p>
                  </div>
                  <select
                    value={lead.status}
                    onChange={(event) =>
                      handleLeadStatus(
                        lead,
                        event.target.value as LeadDTO["status"],
                      )
                    }
                    className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm"
                  >
                    {Object.entries(leadStatusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            {leads.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                暂无留言线索。
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
