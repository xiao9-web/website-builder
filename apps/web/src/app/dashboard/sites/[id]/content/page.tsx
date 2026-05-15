"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Loading } from "@/components/ui/Loading";
import { useSiteStore } from "@/stores/siteStore";
import { slugify, formatDate } from "@/lib/utils";
import {
  createNews,
  createProductService,
  createSiteMenu,
  deleteNews,
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
  { key: "news", label: "最近动态" },
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [configForm, setConfigForm] = useState({
    seoTitle: "",
    seoDescription: "",
    companyName: "",
    shortName: "",
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
    address: "",
    contactNotice: "",
  });

  const [productForm, setProductForm] = useState({
    name: "",
    summary: "",
    description: "",
    scenarios: "",
  });
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productEditForm, setProductEditForm] = useState({
    name: "",
    summary: "",
    description: "",
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
  });
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [newsEditForm, setNewsEditForm] = useState({
    menuId: "",
    title: "",
    slug: "",
    summary: "",
    content: "",
    category: "",
  });

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

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError("");
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
          address: textValue(contact.address),
          contactNotice: textValue(contact.notice),
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "内容管理数据加载失败，请确认后端已启动且已登录。",
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (siteId) {
      load();
    }
  }, [siteId, fetchSite]);

  const handleConfigSave = async () => {
    if (!config) return;
    setIsSaving(true);
    setError("");
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
            address: configForm.address || null,
            notice: configForm.contactNotice,
          },
        },
      });
      setConfig(nextConfig);
      setSuccess("站点配置已保存。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "站点配置保存失败。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!productForm.name || !productForm.summary) {
      setError("请填写产品名称和摘要。");
      return;
    }
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      const created = await createProductService(siteId, {
        name: productForm.name,
        summary: productForm.summary,
        description: productForm.description,
        scenarios: splitList(productForm.scenarios),
        sortOrder: products.length + 1,
        enabled: true,
      });
      setProducts((items) => [...items, created]);
      setProductForm({ name: "", summary: "", description: "", scenarios: "" });
      setSuccess("产品服务已新增。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "产品服务新增失败。");
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
      scenarios: (product.scenarios ?? []).map(String).join("、"),
    });
    setError("");
    setSuccess("");
  };

  const cancelEditProduct = () => {
    setEditingProductId(null);
    setProductEditForm({
      name: "",
      summary: "",
      description: "",
      scenarios: "",
    });
  };

  const handleUpdateProduct = async (product: ProductServiceDTO) => {
    if (!productEditForm.name || !productEditForm.summary) {
      setError("请填写产品名称和摘要。");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await updateProductService(siteId, product.id, {
        name: productEditForm.name,
        summary: productEditForm.summary,
        description: productEditForm.description,
        imageUrl: product.imageUrl || undefined,
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
      setError(err instanceof Error ? err.message : "产品服务更新失败。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateMenu = async () => {
    if (!menuForm.label || !menuForm.slug) {
      setError("请填写菜单名称和访问标识。");
      return;
    }
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      const created = await createSiteMenu(siteId, {
        parentId: menuForm.parentId ? Number(menuForm.parentId) : null,
        label: menuForm.label,
        slug: menuForm.slug,
        sortOrder: menuForm.sortOrder ? Number(menuForm.sortOrder) : menus.length + 1,
        visible: menuForm.visible,
      });
      setMenus((items) => [...items, created].sort((a, b) => a.sortOrder - b.sortOrder));
      setMenuForm({
        parentId: "",
        label: "",
        slug: "",
        sortOrder: "",
        visible: true,
      });
      setSuccess("菜单栏目已新增。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "菜单栏目新增失败。");
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
    setError("");
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
      setError("请填写菜单名称和访问标识。");
      return;
    }
    setIsSaving(true);
    setError("");
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
          .sort((a, b) => a.sortOrder - b.sortOrder),
      );
      cancelEditMenu();
      setSuccess("菜单栏目已更新。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "菜单栏目更新失败。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMenu = async (menu: SiteMenuDTO) => {
    if (!window.confirm(`确定删除菜单“${menu.label}”吗？`)) return;
    setError("");
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
      setError(err instanceof Error ? err.message : "菜单栏目删除失败。");
    }
  };

  const handleCreateNews = async () => {
    if (!newsForm.title || !newsForm.slug) {
      setError("请填写动态标题和访问标识。");
      return;
    }
    setIsSaving(true);
    setError("");
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
      });
      setSuccess("最近动态已保存为草稿。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "最近动态新增失败。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNews = async (newsId: number) => {
    if (!window.confirm("确定删除这条动态吗？")) return;
    await deleteNews(siteId, newsId);
    setNews((items) => items.filter((item) => item.id !== newsId));
  };

  const handleNewsStatus = async (item: NewsDTO, status: NewsDTO["status"]) => {
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
    });
    setError("");
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
    });
  };

  const handleUpdateNews = async (item: NewsDTO) => {
    if (!newsEditForm.title || !newsEditForm.slug) {
      setError("请填写动态标题和访问标识。");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await updateNews(siteId, item.id, {
        menuId: newsEditForm.menuId ? Number(newsEditForm.menuId) : null,
        title: newsEditForm.title,
        slug: newsEditForm.slug,
        summary: newsEditForm.summary,
        content: newsEditForm.content,
        category: newsEditForm.category,
        coverImage: item.coverImage || undefined,
        status: item.status,
      });
      setNews((items) =>
        items.map((newsItem) => (newsItem.id === updated.id ? updated : newsItem)),
      );
      cancelEditNews();
      setSuccess("最近动态已更新。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "最近动态更新失败。");
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
            管理前台官网所需的配置、产品服务、最近动态和留言线索。
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

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-5">
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
            <p className="text-sm text-gray-500">最近动态</p>
            <p className="mt-2 text-2xl font-bold">{stats.news}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-gray-500">已发布动态</p>
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
                首页为系统入口；其他菜单可维护文章，最多三级。
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
                  {menus
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
            </CardHeader>
            <CardContent className="space-y-4">
              {menus.map((menu) => (
                <div key={menu.id} className="rounded-lg border border-gray-200 p-4">
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
                          {menus
                            .filter((item) => item.level < 3 && item.id !== menu.id)
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
                          <span>/{menu.slug}</span>
                        </div>
                        <h3 className="mt-2 font-semibold text-gray-900">
                          {"　".repeat(Math.max(0, menu.level - 1))}
                          {menu.label}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          上级：{menuLabel(menus, menu.parentId)}
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
                        {menu.menuType !== "HOME" ? (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteMenu(menu)}
                          >
                            删除
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {activeTab === "news" ? (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">新增最近动态</h2>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <option value="">不归属菜单</option>
                  {menus
                    .filter((menu) => menu.menuType !== "HOME")
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
                label="摘要"
                value={newsForm.summary}
                onChange={(event) =>
                  setNewsForm((form) => ({
                    ...form,
                    summary: event.target.value,
                  }))
                }
              />
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">
                  正文
                </span>
                <textarea
                  className="min-h-32 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  value={newsForm.content}
                  onChange={(event) =>
                    setNewsForm((form) => ({
                      ...form,
                      content: event.target.value,
                    }))
                  }
                />
              </label>
              <Button onClick={handleCreateNews} isLoading={isSaving}>
                保存为草稿
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">动态列表</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {news.map((item) => (
                <div key={item.id} className="rounded-lg border p-4">
                  {editingNewsId === item.id ? (
                    <div className="space-y-4">
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
                            <option value="">不归属菜单</option>
                            {menus
                              .filter((menu) => menu.menuType !== "HOME")
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
                          label="摘要"
                          value={newsEditForm.summary}
                          onChange={(event) =>
                            setNewsEditForm((form) => ({
                              ...form,
                              summary: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-gray-700">
                          正文
                        </span>
                        <textarea
                          className="min-h-32 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                          value={newsEditForm.content}
                          onChange={(event) =>
                            setNewsEditForm((form) => ({
                              ...form,
                              content: event.target.value,
                            }))
                          }
                        />
                      </label>
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
                          <span>{menuLabel(menus, item.menuId)}</span>
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
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditNews(item)}
                        >
                          编辑
                        </Button>
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
                          onClick={() => handleDeleteNews(item.id)}
                        >
                          删除
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {news.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  暂无最近动态。
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
