"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Loading } from "@/components/ui/Loading";
import type { Site } from "@/types/site";

export default function PreviewPage() {
  const params = useParams();
  const siteId = params.siteId as string;
  const [site, setSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const data = (await api.get(`/sites/${siteId}`)) as Site;
        setSite(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load site");
      } finally {
        setIsLoading(false);
      }
    };

    if (siteId) {
      fetchSite();
    }
  }, [siteId]);

  if (isLoading) {
    return <Loading fullScreen text="Loading preview..." />;
  }

  if (error || !site) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Preview Unavailable
          </h1>
          <p className="mt-2 text-gray-600">{error || "Site not found"}</p>
        </div>
      </div>
    );
  }

  const previewUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/preview/${site.templateId}?config=${encodeURIComponent(JSON.stringify(site.config))}`;

  return (
    <div className="h-screen w-full">
      <div className="flex h-10 items-center justify-between border-b border-gray-200 bg-gray-900 px-4">
        <span className="text-sm text-gray-300">{site.name} - Preview</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{site.slug}</span>
        </div>
      </div>
      <iframe
        src={previewUrl}
        className="h-[calc(100vh-2.5rem)] w-full border-0"
        title={`Preview of ${site.name}`}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
