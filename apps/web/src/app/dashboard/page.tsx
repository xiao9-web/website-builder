"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSiteStore } from "@/stores/siteStore";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { formatDate } from "@/lib/utils";
import { siteStatusClass, siteStatusLabel } from "@/lib/site-status";

export default function DashboardPage() {
  const { sites, isLoading, fetchSites } = useSiteStore();

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  if (isLoading) {
    return <Loading fullScreen text="正在加载站点..." />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">我的站点</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理企业官网、内容更新和客户咨询入口
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
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              还没有站点
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              选择模板后即可创建第一个企业官网。
            </p>
            <Link href="/dashboard/sites/new" className="mt-4 inline-block">
              <Button>创建第一个站点</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Link key={site.id} href={`/dashboard/sites/${site.id}`}>
              <Card hover className="h-full">
                <div className="aspect-video w-full bg-gradient-to-br from-primary-100 to-primary-50" />
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {site.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{site.slug}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${siteStatusClass(site.status)}`}
                    >
                      {siteStatusLabel(site.status)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    更新于 {formatDate(site.updatedAt)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
