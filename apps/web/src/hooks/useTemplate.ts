"use client";

import { useState, useEffect, useCallback } from "react";
import type { Template, TemplateCategory } from "@/types/template";
import api from "@/lib/api";

interface TemplatePageResponse {
  content?: Template[];
}

function normalizeTemplates(value: unknown): Template[] {
  if (Array.isArray(value)) return value as Template[];
  if (
    value &&
    typeof value === "object" &&
    Array.isArray((value as TemplatePageResponse).content)
  ) {
    return (value as TemplatePageResponse).content ?? [];
  }
  return [];
}

function buildCategories(templates: Template[]): TemplateCategory[] {
  const counts = templates.reduce<Record<string, number>>((acc, template) => {
    const category = template.category || "default";
    acc[category] = (acc[category] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).map(([id, count]) => ({
    id,
    name: id === "default" ? "通用模板" : id,
    icon: "layout",
    count,
  }));
}

export function useTemplates(category?: string) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = category ? { category } : {};
      const data = await api.get("/templates", { params });
      setTemplates(normalizeTemplates(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "模板加载失败");
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.get("/templates");
      setCategories(buildCategories(normalizeTemplates(data)));
    } catch {
      // 分类加载失败不阻塞模板列表。
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, [fetchTemplates, fetchCategories]);

  return {
    templates,
    categories,
    isLoading,
    error,
    refetch: fetchTemplates,
  };
}

export function useTemplate(id: string | null) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setTemplate(null);
      return;
    }

    const fetchTemplate = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = (await api.get(`/templates/${id}`)) as Template;
        setTemplate(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "模板加载失败",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  return { template, isLoading, error };
}
