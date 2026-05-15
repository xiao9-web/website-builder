"use client";

import { useState } from "react";
import { useTemplates } from "@/hooks/useTemplate";
import { TemplateCard } from "@/components/template/TemplateCard";
import { Loading } from "@/components/ui/Loading";
import type { Template } from "@/types/template";

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const { templates, categories, isLoading, error } =
    useTemplates(selectedCategory);

  if (isLoading) {
    return <Loading fullScreen text="正在加载模板..." />;
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          模板市场
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          选择适合行业的模板，快速搭建企业官网。
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(undefined)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !selectedCategory
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {templates.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500">该分类下暂无模板。</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template: Template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}
