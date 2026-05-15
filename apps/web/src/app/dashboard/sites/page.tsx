"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSiteStore } from "@/stores/siteStore";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { formatDate } from "@/lib/utils";
import { siteStatusClass, siteStatusLabel } from "@/lib/site-status";

export default function SitesPage() {
  const { sites, isLoading, fetchSites, deleteSite } = useSiteStore();

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(
        `确定删除「${name}」吗？此操作无法撤销。`,
      )
    ) {
      await deleteSite(id);
    }
  };

  if (isLoading) {
    return <Loading fullScreen text="正在加载站点..." />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">站点管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            共 {sites.length} 个站点
          </p>
        </div>
        <Link href="/dashboard/sites/new">
          <Button>
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            新建站点
          </Button>
        </Link>
      </div>

      {sites.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">
              还没有创建任何站点。
            </p>
            <Link href="/dashboard/sites/new" className="mt-4 inline-block">
              <Button>创建第一个站点</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sites.map((site) => (
            <Card key={site.id} hover>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
                    <svg
                      className="h-6 w-6 text-primary-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{site.name}</h3>
                    <p className="text-sm text-gray-500">
                      {site.slug} &middot; 更新于 {formatDate(site.updatedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${siteStatusClass(site.status)}`}
                  >
                    {siteStatusLabel(site.status)}
                  </span>
                  <Link href={`/dashboard/sites/${site.id}/edit`}>
                    <Button variant="outline" size="sm">
                      编辑
                    </Button>
                  </Link>
                  <Link href={`/dashboard/sites/${site.id}/content`}>
                    <Button variant="outline" size="sm">
                      内容
                    </Button>
                  </Link>
                  <Link href={`/preview/${site.id}`} target="_blank">
                    <Button variant="ghost" size="sm">
                      预览
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(site.id, site.name)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    删除
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
