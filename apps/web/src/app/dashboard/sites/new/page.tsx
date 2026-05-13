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
  name: z.string().min(2, "Site name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
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
      setError(err instanceof Error ? err.message : "Failed to create site");
    }
  };

  if (templatesLoading) {
    return <Loading fullScreen text="Loading templates..." />;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Site</h1>
        <p className="mt-1 text-sm text-gray-500">
          {step === "template"
            ? "Step 1: Choose a template"
            : "Step 2: Configure your site"}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 flex items-center gap-4">
        <div
          className={`flex items-center gap-2 ${step === "template" ? "text-primary-600" : "text-gray-400"}`}
        >
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${step === "template" ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-600"}`}
          >
            1
          </span>
          <span className="text-sm font-medium">Template</span>
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
          <span className="text-sm font-medium">Details</span>
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
              Continue
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
                Template:{" "}
                <span className="font-medium text-gray-900">
                  {selectedTemplate?.name}
                </span>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Site Name"
                placeholder="My Awesome Site"
                error={errors.name?.message}
                {...register("name", { onChange: handleNameChange })}
              />
              <Input
                label="Slug"
                placeholder="my-awesome-site"
                helperText="This will be used in your site URL"
                error={errors.slug?.message}
                {...register("slug")}
              />
              <Input
                label="Description (optional)"
                placeholder="A brief description of your site"
                error={errors.description?.message}
                {...register("description")}
              />
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("template")}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  isLoading={isSubmitting}
                >
                  Create Site
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
