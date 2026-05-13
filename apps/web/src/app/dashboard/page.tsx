"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSiteStore } from "@/stores/siteStore";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { sites, isLoading, fetchSites } = useSiteStore();

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  if (isLoading) {
    return <Loading fullScreen text="Loading your sites..." />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Sites</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and edit your websites
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
            New Site
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
              No sites yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Get started by creating your first website from a template.
            </p>
            <Link href="/dashboard/sites/new" className="mt-4 inline-block">
              <Button>Create Your First Site</Button>
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
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        site.status === "published"
                          ? "bg-green-100 text-green-700"
                          : site.status === "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {site.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    Updated {formatDate(site.updatedAt)}
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
