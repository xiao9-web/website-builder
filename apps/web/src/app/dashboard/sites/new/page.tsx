"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTemplates } from "@/hooks/useTemplate";
import { useSiteStore } from "@/stores/siteStore";
import { TemplateCard } from "@/components/template/TemplateCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import type { Template } from "@/types/template";
import { slugify } from "@/lib/utils";

const createSiteSchema = z.object({
  name: z.string().min(2, "站点名称至少 2 个字符"),
  slug: z
    .string()
    .min(2, "访问标识至少 2 个字符")
    .regex(
      /^[a-z0-9-]+$/,
      "访问标识只能包含小写字母、数字和连字符",
    ),
  description: z.string().optional(),
});

type CreateSiteFormData = z.infer<typeof createSiteSchema>;

export default function NewSitePage() {
  const router = useRouter();
  const { templates, isLoading: templatesLoading } = useTemplates();
  const { createSite } = useSiteStore();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [step, setStep] = useState<"template" | "details">("template");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateSiteFormData>({
    resolver: zodResolver(createSiteSchema),
  });

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleContinue = () => {
    if (!selectedTemplate) return;
    setStep("details");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("slug", slugify(name));
  };

  const onSubmit = async (data: CreateSiteFormData) => {
    if (!selectedTemplate) return;
    setError("");
    try {
      const site = await createSite({
        ...data,
        templateId: selectedTemplate.id,
        config: selectedTemplate.defaultConfig,
      });
      router.push(`/dashboard/sites/${site.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建站点失败，请稍后再试。");
    }
  };

  if (templatesLoading) {
    return <Loading fullScreen text="正在加载模板..." />;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">新建站点</h1>
        <p className="mt-1 text-sm text-gray-500">
          {step === "template"
            ? "第 1 步：选择模板"
            : "第 2 步：填写站点信息"}
        </p>
      </div>

      <div className="mb-8 flex items-center gap-4">
        <div
          className={`flex items-center gap-2 ${step === "template" ? "text-primary-600" : "text-gray-400"}`}
        >
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${step === "template" ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-600"}`}
          >
            1
          </span>
          <span className="text-sm font-medium">选择模板</span>
        </div>
        <div className="h-px flex-1 bg-gray-200" />
        <div
          className={`flex items-center gap-2 ${step === "details" ? "text-primary-600" : "text-gray-400"}`}
        >
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${step === "details" ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-600"}`}
          >
            2
          </span>
          <span className="text-sm font-medium">站点信息</span>
        </div>
      </div>

      {step === "template" ? (
        <div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleTemplateSelect}
                selected={selectedTemplate?.id === template.id}
              />
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <Button onClick={handleContinue} disabled={!selectedTemplate}>
              下一步
            </Button>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-lg">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            {error && (
              <div
                className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="mb-4 rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-600">
                已选模板：{" "}
                <span className="font-medium text-gray-900">
                  {selectedTemplate?.name}
                </span>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="站点名称"
                placeholder="山东春昌食品科技股份有限公司"
                error={errors.name?.message}
                {...register("name", { onChange: handleNameChange })}
              />
              <Input
                label="访问标识"
                placeholder="chunchang"
                helperText="将用于生成站点访问地址，例如 /sites/chunchang"
                error={errors.slug?.message}
                {...register("slug")}
              />
              <Input
                label="站点描述（选填）"
                placeholder="简要说明站点用途和主营业务"
                error={errors.description?.message}
                {...register("description")}
              />
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("template")}
                >
                  返回
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  isLoading={isSubmitting}
                >
                  创建站点
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
