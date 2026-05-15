"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSiteStore } from "@/stores/siteStore";
import { SchemaForm } from "@/components/template/SchemaForm";
import { TemplatePreview } from "@/components/template/TemplatePreview";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import type { JSONSchema } from "@/types/template";

export default function SiteEditPage() {
  const params = useParams();
  const siteId = params.id as string;
  const {
    currentSite,
    currentTemplate,
    isLoading,
    isSaving,
    fetchSite,
    updateSite,
    updateConfig,
  } = useSiteStore();
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (siteId) {
      fetchSite(siteId);
    }
  }, [siteId, fetchSite]);

  if (isLoading || !currentSite) {
    return <Loading fullScreen text="正在加载编辑器..." />;
  }

  const schema = currentTemplate?.schema as JSONSchema | undefined;

  const handleConfigChange = (values: Record<string, unknown>) => {
    updateConfig(values);
    setHasChanges(true);
  };

  const handleSave = async () => {
    await updateSite(currentSite.id, { config: currentSite.config });
    setHasChanges(false);
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {currentSite.name}
          </h1>
          <p className="text-sm text-gray-500">编辑站点配置</p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-sm text-amber-600">有未保存修改</span>
          )}
          <Button
            variant="outline"
            onClick={() => window.open(`/preview/${currentSite.id}`, "_blank")}
          >
            预览
          </Button>
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            disabled={!hasChanges}
          >
            保存修改
          </Button>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Form Panel */}
        <div className="w-96 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-6">
          {schema ? (
            <SchemaForm
              schema={schema}
              values={currentSite.config as Record<string, unknown>}
              onChange={handleConfigChange}
            />
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">
                当前模板暂无可配置表单。
              </p>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="flex-1 overflow-hidden bg-gray-100 p-6">
          {currentTemplate ? (
            <TemplatePreview
              templateId={currentTemplate.id}
              config={currentSite.config as Record<string, unknown>}
              className="h-full"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-gray-500">暂时无法预览</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
