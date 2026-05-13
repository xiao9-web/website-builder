"use client";

interface TemplatePreviewProps {
  templateId: string;
  config: Record<string, unknown>;
  className?: string;
}

export function TemplatePreview({
  templateId,
  config,
  className,
}: TemplatePreviewProps) {
  const previewUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/preview/${templateId}`;

  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-200 bg-white ${className || ""}`}
    >
      <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-2">
        <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-xs text-gray-400">Preview</span>
      </div>
      <div className="relative aspect-[16/10] w-full">
        <iframe
          src={`${previewUrl}?config=${encodeURIComponent(JSON.stringify(config))}`}
          className="h-full w-full border-0"
          title="Template preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
