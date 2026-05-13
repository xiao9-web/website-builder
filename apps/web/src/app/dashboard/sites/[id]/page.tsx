"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSiteStore } from "@/stores/siteStore";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { formatDate } from "@/lib/utils";

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
    return <Loading fullScreen text="Loading site..." />;
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
            <Button variant="outline">Preview</Button>
          </Link>
          <Link href={`/dashboard/sites/${currentSite.id}/edit`}>
            <Button variant="secondary">Edit Config</Button>
          </Link>
          {currentSite.status !== "published" && (
            <Button onClick={handlePublish} isLoading={isSaving}>
              Publish
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">
                Site Preview
              </h2>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <iframe
                  src={`${process.env.NEXT_PUBLIC_API_URL || ""}/preview/${currentSite.templateId}?config=${encodeURIComponent(JSON.stringify(currentSite.config))}`}
                  className="h-full w-full border-0"
                  title="Site preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Site Info</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    currentSite.status === "published"
                      ? "bg-green-100 text-green-700"
                      : currentSite.status === "draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {currentSite.status}
                </span>
              </div>
              {currentSite.domain && (
                <div>
                  <p className="text-sm text-gray-500">Domain</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {currentSite.domain}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(currentSite.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(currentSite.updatedAt)}
                </p>
              </div>
              {currentSite.publishedAt && (
                <div>
                  <p className="text-sm text-gray-500">Published</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(currentSite.publishedAt)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Template</h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-900">
                {currentSite.template?.name || "Unknown"}
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
