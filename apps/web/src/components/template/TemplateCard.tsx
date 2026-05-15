import Image from "next/image";
import type { Template } from "@/types/template";
import { Card } from "@/components/ui/Card";
import { truncate } from "@/lib/utils";

interface TemplateCardProps {
  template: Template;
  onSelect?: (template: Template) => void;
  selected?: boolean;
}

export function TemplateCard({
  template,
  onSelect,
  selected,
}: TemplateCardProps) {
  return (
    <Card
      hover
      className={`cursor-pointer overflow-hidden ${selected ? "ring-2 ring-primary-500" : ""}`}
      onClick={() => onSelect?.(template)}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(template);
        }
      }}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <Image
          src={template.thumbnail}
          alt={`${template.name} 模板预览`}
          fill
          className="object-cover transition-transform hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            {template.name}
          </h3>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {template.category}
          </span>
        </div>
        <p className="mb-3 text-sm text-gray-500">
          {truncate(template.description, 80)}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded bg-primary-50 px-1.5 py-0.5 text-xs text-primary-700"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-400">
            {template.downloads} 次使用
          </span>
        </div>
      </div>
    </Card>
  );
}
