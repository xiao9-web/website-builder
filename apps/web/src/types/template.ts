export interface JSONSchemaProperty {
  type: "string" | "number" | "boolean" | "array" | "object";
  title?: string;
  description?: string;
  default?: unknown;
  enum?: string[];
  enumLabels?: string[];
  format?: "color" | "uri" | "email" | "textarea" | "image";
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  items?: JSONSchemaProperty;
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
}

export interface JSONSchema {
  type: "object";
  title?: string;
  description?: string;
  properties: Record<string, JSONSchemaProperty>;
  required?: string[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  tags: string[];
  schema: JSONSchema;
  defaultConfig: Record<string, unknown>;
  previewUrl?: string;
  author: string;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}
