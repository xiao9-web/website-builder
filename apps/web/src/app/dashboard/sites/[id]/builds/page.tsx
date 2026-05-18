"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import {
  buildStatusClass,
  buildStatusLabel,
  siteStatusClass,
  siteStatusLabel,
} from "@/lib/site-status";
import { formatDate } from "@/lib/utils";
import { useSiteStore } from "@/stores/siteStore";
import type { BuildRecord } from "@/types/site";

export default function SiteBuildsPage() {
  const params = useParams();
  const siteId = params.id as string;
  const { currentSite, isLoading, isSaving, fetchSite, fetchBuilds, triggerBuild } =
    useSiteStore();
  const [builds, setBuilds] = useState<BuildRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!siteId) return;
      setError("");
      await fetchSite(siteId);
      setBuilds(await fetchBuilds(siteId));
    }

    load().catch((err) => {
      setError(err instanceof Error ? err.message : "构建历史加载失败。");
    });
  }, [siteId, fetchSite, fetchBuilds]);

  const handleBuild = async () => {
    if (!currentSite) return;
    setError("");
    try {
      await triggerBuild(currentSite.id);
      setBuilds(await fetchBuilds(currentSite.id));
      await fetchSite(currentSite.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "触发构建失败。");
    }
  };

  if (isLoading || !currentSite) {
    return <Loading fullScreen text="正在加载构建历史..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-gray-500">构建历史</p>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentSite.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>{currentSite.slug}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${siteStatusClass(currentSite.status)}`}
            >
              {siteStatusLabel(currentSite.status)}
            </span>
            {currentSite.publishedAt ? (
              <span>发布时间：{formatDate(currentSite.publishedAt)}</span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={`/dashboard/sites/${currentSite.id}`}>
            <Button variant="secondary">返回站点详情</Button>
          </Link>
          <Button onClick={handleBuild} isLoading={isSaving}>
            重新构建
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">全部构建记录</h2>
          <p className="mt-1 text-sm text-gray-500">
            发布或手动构建后会在这里记录结果，失败记录也会保留用于排查。
          </p>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {builds.length > 0 ? (
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-medium uppercase text-gray-500">
                  <th className="py-3 pr-4">ID</th>
                  <th className="py-3 pr-4">状态</th>
                  <th className="py-3 pr-4">触发人</th>
                  <th className="py-3 pr-4">耗时</th>
                  <th className="py-3 pr-4">创建时间</th>
                  <th className="py-3 pr-4">完成时间</th>
                  <th className="py-3 pr-4">输出地址</th>
                  <th className="py-3">日志</th>
                </tr>
              </thead>
              <tbody>
                {builds.map((build) => (
                  <tr key={build.id} className="border-b border-gray-100">
                    <td className="py-4 pr-4 font-medium text-gray-900">
                      #{build.id}
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${buildStatusClass(build.status)}`}
                      >
                        {buildStatusLabel(build.status)}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-gray-600">
                      {build.triggeredBy || "系统"}
                    </td>
                    <td className="py-4 pr-4 text-gray-600">
                      {build.durationMs} ms
                    </td>
                    <td className="py-4 pr-4 text-gray-600">
                      {build.createdAt ? formatDate(build.createdAt) : "-"}
                    </td>
                    <td className="py-4 pr-4 text-gray-600">
                      {build.completedAt ? formatDate(build.completedAt) : "-"}
                    </td>
                    <td className="max-w-[180px] py-4 pr-4">
                      {build.outputUrl ? (
                        <a
                          href={build.outputUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block truncate text-primary-700 hover:text-primary-800"
                        >
                          {build.outputUrl}
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="max-w-[220px] py-4 text-gray-600">
                      <span className="block truncate">
                        {build.buildLog || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="py-10 text-center text-sm text-gray-500">
              暂无构建记录。点击重新构建后会生成第一条记录。
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
