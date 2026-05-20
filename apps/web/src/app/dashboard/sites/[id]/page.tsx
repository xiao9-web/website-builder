"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSiteStore } from "@/stores/siteStore";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { formatDate } from "@/lib/utils";
import { getErrorMessage, shouldShowInlineError } from "@/lib/api";
import {
  buildStatusClass,
  buildStatusLabel,
  isPublishedSite,
  siteStatusClass,
  siteStatusLabel,
} from "@/lib/site-status";
import type { BuildRecord } from "@/types/site";

export default function SiteDetailPage() {
  const params = useParams();
  const siteId = params.id as string;
  const {
    currentSite,
    isLoading,
    isSaving,
    fetchSite,
    fetchBuilds,
    fetchLatestBuild,
    triggerBuild,
  } = useSiteStore();
  const [latestBuild, setLatestBuild] = useState<BuildRecord | null>(null);
  const [builds, setBuilds] = useState<BuildRecord[]>([]);
  const [buildError, setBuildError] = useState("");

  useEffect(() => {
    async function load() {
      if (!siteId) return;
      await fetchSite(siteId);
      const [build, buildHistory] = await Promise.all([
        fetchLatestBuild(siteId),
        fetchBuilds(siteId),
      ]);
      setLatestBuild(build);
      setBuilds(buildHistory);
    }
    load().catch((error) => {
      if (shouldShowInlineError(error)) {
        setBuildError(getErrorMessage(error, "构建记录加载失败。"));
      }
    });
  }, [siteId, fetchSite, fetchLatestBuild, fetchBuilds]);

  const refreshBuildState = async (id: string) => {
    const [build, buildHistory] = await Promise.all([
      fetchLatestBuild(id),
      fetchBuilds(id),
      fetchSite(id),
    ]);
    setLatestBuild(build);
    setBuilds(buildHistory);
  };

  if (isLoading || !currentSite) {
    return <Loading fullScreen text="正在加载站点..." />;
  }

  const handlePublish = async () => {
    await handleTriggerBuild();
  };

  const handleTriggerBuild = async () => {
    setBuildError("");
    try {
      const build = await triggerBuild(currentSite.id);
      setLatestBuild(build);
      await refreshBuildState(currentSite.id);
    } catch (error) {
      if (shouldShowInlineError(error)) {
        setBuildError(getErrorMessage(error, "触发构建失败。"));
      }
    }
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
          <Button
            variant="outline"
            onClick={handleTriggerBuild}
            isLoading={isSaving}
          >
            触发构建
          </Button>
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
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  最新构建
                </h2>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleTriggerBuild}
                  isLoading={isSaving}
                >
                  重新构建
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {buildError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {buildError}
                </div>
              ) : null}
              {latestBuild ? (
                <>
                  <div>
                    <p className="text-sm text-gray-500">状态</p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${buildStatusClass(latestBuild.status)}`}
                    >
                      {buildStatusLabel(latestBuild.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">触发人</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {latestBuild.triggeredBy || "系统"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">耗时</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {latestBuild.durationMs} ms
                    </p>
                  </div>
                  {latestBuild.createdAt ? (
                    <div>
                      <p className="text-sm text-gray-500">创建时间</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(latestBuild.createdAt)}
                      </p>
                    </div>
                  ) : null}
                  {latestBuild.completedAt ? (
                    <div>
                      <p className="text-sm text-gray-500">完成时间</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(latestBuild.completedAt)}
                      </p>
                    </div>
                  ) : null}
                  {latestBuild.outputUrl ? (
                    <div>
                      <p className="text-sm text-gray-500">输出地址</p>
                      <a
                        href={latestBuild.outputUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block break-all text-sm font-medium text-primary-700 hover:text-primary-800"
                      >
                        {latestBuild.outputUrl}
                      </a>
                    </div>
                  ) : null}
                  {latestBuild.buildLog ? (
                    <div>
                      <p className="text-sm text-gray-500">日志</p>
                      <p className="mt-1 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                        {latestBuild.buildLog}
                      </p>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  暂无构建记录。点击发布或重新构建后，这里会显示最新结果。
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  构建历史
                </h2>
                <Link href={`/dashboard/sites/${currentSite.id}/builds`}>
                  <Button size="sm" variant="outline">查看全部</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {builds.slice(0, 5).map((build) => (
                <div
                  key={build.id}
                  className="rounded-lg border border-gray-200 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        #{build.id}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${buildStatusClass(build.status)}`}
                      >
                        {buildStatusLabel(build.status)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {build.createdAt ? formatDate(build.createdAt) : "未知时间"}
                    </span>
                  </div>
                  <div className="mt-2 grid gap-1 text-xs text-gray-500">
                    <span>触发：{build.triggeredBy || "系统"}</span>
                    <span>耗时：{build.durationMs} ms</span>
                    {build.outputUrl ? (
                      <a
                        href={build.outputUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="break-all text-primary-700 hover:text-primary-800"
                      >
                        {build.outputUrl}
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
              {builds.length === 0 ? (
                <p className="text-sm text-gray-500">
                  暂无构建历史。首次发布或构建后会出现在这里。
                </p>
              ) : null}
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
