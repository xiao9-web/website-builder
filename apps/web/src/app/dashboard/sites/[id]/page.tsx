"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSiteStore } from "@/stores/siteStore";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { formatDate } from "@/lib/utils";
import {
  isPublishedSite,
  siteStatusClass,
  siteStatusLabel,
} from "@/lib/site-status";

export default function SiteDetailPage() {
  const params = useParams();
  const siteId = params.id as string;
  const { currentSite, isLoading, isSaving, fetchSite, publishSite } =
    useSiteStore();

  useEffect(() => {
    if (siteId) {
      fetchSite(siteId);
    }
  }, [siteId, fetchSite]);

  if (isLoading || !currentSite) {
    return <Loading fullScreen text="正在加载站点..." />;
  }

  const handlePublish = async () => {
    await publishSite(currentSite.id);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentSite.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{currentSite.slug}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/preview/${currentSite.id}`} target="_blank">
            <Button variant="outline">预览</Button>
          </Link>
          <Link href={`/dashboard/sites/${currentSite.id}/edit`}>
            <Button variant="secondary">编辑配置</Button>
          </Link>
          <Link href={`/dashboard/sites/${currentSite.id}/content`}>
            <Button variant="secondary">内容管理</Button>
          </Link>
          {!isPublishedSite(currentSite.status) && (
            <Button onClick={handlePublish} isLoading={isSaving}>
              发布
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">
                站点预览
              </h2>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <iframe
                  src={`${process.env.NEXT_PUBLIC_API_URL || ""}/preview/${currentSite.templateId}?config=${encodeURIComponent(JSON.stringify(currentSite.config))}`}
                  className="h-full w-full border-0"
                  title="站点预览"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">站点信息</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">状态</p>
                <span
                  className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${siteStatusClass(currentSite.status)}`}
                >
                  {siteStatusLabel(currentSite.status)}
                </span>
              </div>
              {currentSite.domain && (
                <div>
                  <p className="text-sm text-gray-500">绑定域名</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {currentSite.domain}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">创建时间</p>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(currentSite.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">最近更新</p>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(currentSite.updatedAt)}
                </p>
              </div>
              {currentSite.publishedAt && (
                <div>
                  <p className="text-sm text-gray-500">发布时间</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(currentSite.publishedAt)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">模板</h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-900">
                {currentSite.template?.name || "未关联模板"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {currentSite.template?.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
