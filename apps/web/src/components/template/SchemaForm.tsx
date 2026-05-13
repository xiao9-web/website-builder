"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useEffect, useCallback } from "react";
import type { JSONSchema, JSONSchemaProperty } from "@/types/template";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { debounce } from "@/lib/utils";

interface SchemaFormProps {
  schema: JSONSchema;
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
}

export function SchemaForm({ schema, values, onChange }: SchemaFormProps) {
  const { control, watch, reset, register } = useForm({
    defaultValues: values,
  });

  useEffect(() => {
    reset(values);
  }, [values, reset]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    debounce((data: unknown) => {
      onChange(data as Record<string, unknown>);
    }, 300),
    [onChange],
  );

  useEffect(() => {
    const subscription = watch((data) => {
      debouncedOnChange(data);
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedOnChange]);

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      {schema.title && (
        <h3 className="text-lg font-semibold text-gray-900">{schema.title}</h3>
      )}
      {schema.description && (
        <p className="text-sm text-gray-500">{schema.description}</p>
      )}
      <div className="space-y-4">
        {Object.entries(schema.properties).map(([key, prop]) => (
          <FieldRenderer
            key={key}
            name={key}
            property={prop}
            control={control}
            register={register}
            required={schema.required?.includes(key)}
          />
        ))}
      </div>
    </form>
  );
}

interface FieldRendererProps {
  name: string;
  property: JSONSchemaProperty;
  control: ReturnType<typeof useForm>["control"];
  register: ReturnType<typeof useForm>["register"];
  required?: boolean;
  prefix?: string;
}

function FieldRenderer({
  name,
  property,
  control,
  register,
  required,
  prefix,
}: FieldRendererProps) {
  const fieldName = prefix ? `${prefix}.${name}` : name;
  const label =
    property.title ||
    name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, " $1");

  switch (property.type) {
    case "string":
      return (
        <StringField
          fieldName={fieldName}
          property={property}
          label={label}
          register={register}
          required={required}
        />
      );
    case "number":
      return (
        <NumberField
          fieldName={fieldName}
          property={property}
          label={label}
          register={register}
          required={required}
        />
      );
    case "boolean":
      return (
        <BooleanField
          fieldName={fieldName}
          property={property}
          label={label}
          control={control}
        />
      );
    case "array":
      return (
        <ArrayField
          fieldName={fieldName}
          property={property}
          label={label}
          control={control}
          register={register}
        />
      );
    case "object":
      return (
        <ObjectField
          fieldName={fieldName}
          property={property}
          label={label}
          control={control}
          register={register}
        />
      );
    default:
      return null;
  }
}

interface StringFieldProps {
  fieldName: string;
  property: JSONSchemaProperty;
  label: string;
  register: ReturnType<typeof useForm>["register"];
  required?: boolean;
}

function StringField({
  fieldName,
  property,
  label,
  register,
  required,
}: StringFieldProps) {
  if (property.enum) {
    return (
      <div className="w-full">
        <label
          htmlFor={fieldName}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <select
          id={fieldName}
          {...register(fieldName)}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          {property.enum.map((option, idx) => (
            <option key={option} value={option}>
              {property.enumLabels?.[idx] || option}
            </option>
          ))}
        </select>
        {property.description && (
          <p className="mt-1 text-sm text-gray-500">{property.description}</p>
        )}
      </div>
    );
  }

  if (property.format === "textarea") {
    return (
      <div className="w-full">
        <label
          htmlFor={fieldName}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <textarea
          id={fieldName}
          {...register(fieldName)}
          rows={4}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder={property.description}
        />
        {property.description && (
          <p className="mt-1 text-sm text-gray-500">{property.description}</p>
        )}
      </div>
    );
  }

  if (property.format === "color") {
    return (
      <div className="w-full">
        <label
          htmlFor={fieldName}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            id={fieldName}
            {...register(fieldName)}
            className="h-10 w-14 cursor-pointer rounded border border-gray-300"
          />
          <input
            type="text"
            {...register(fieldName)}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="#000000"
          />
        </div>
        {property.description && (
          <p className="mt-1 text-sm text-gray-500">{property.description}</p>
        )}
      </div>
    );
  }

  if (property.format === "image") {
    return (
      <div className="w-full">
        <label
          htmlFor={fieldName}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <Input
          id={fieldName}
          {...register(fieldName)}
          type="url"
          placeholder="https://example.com/image.png"
          helperText={property.description || "Enter an image URL"}
        />
      </div>
    );
  }

  return (
    <Input
      id={fieldName}
      label={label}
      {...register(fieldName, {
        required: required ? `${label} is required` : false,
        minLength: property.minLength
          ? {
              value: property.minLength,
              message: `Minimum ${property.minLength} characters`,
            }
          : undefined,
        maxLength: property.maxLength
          ? {
              value: property.maxLength,
              message: `Maximum ${property.maxLength} characters`,
            }
          : undefined,
        pattern: property.pattern
          ? { value: new RegExp(property.pattern), message: "Invalid format" }
          : undefined,
      })}
      type={
        property.format === "email"
          ? "email"
          : property.format === "uri"
            ? "url"
            : "text"
      }
      placeholder={property.description}
      helperText={property.description}
    />
  );
}

interface NumberFieldProps {
  fieldName: string;
  property: JSONSchemaProperty;
  label: string;
  register: ReturnType<typeof useForm>["register"];
  required?: boolean;
}

function NumberField({
  fieldName,
  property,
  label,
  register,
  required,
}: NumberFieldProps) {
  return (
    <Input
      id={fieldName}
      label={label}
      {...register(fieldName, {
        required: required ? `${label} is required` : false,
        valueAsNumber: true,
        min:
          property.minimum !== undefined
            ? {
                value: property.minimum,
                message: `Minimum value is ${property.minimum}`,
              }
            : undefined,
        max:
          property.maximum !== undefined
            ? {
                value: property.maximum,
                message: `Maximum value is ${property.maximum}`,
              }
            : undefined,
      })}
      type="number"
      placeholder={property.description}
      helperText={property.description}
    />
  );
}

interface BooleanFieldProps {
  fieldName: string;
  property: JSONSchemaProperty;
  label: string;
  control: ReturnType<typeof useForm>["control"];
}

function BooleanField({
  fieldName,
  property,
  label,
  control,
}: BooleanFieldProps) {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={!!field.value}
            onClick={() => field.onChange(!field.value)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              field.value ? "bg-primary-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
                field.value ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <div>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            {property.description && (
              <p className="text-sm text-gray-500">{property.description}</p>
            )}
          </div>
        </div>
      )}
    />
  );
}

interface ArrayFieldProps {
  fieldName: string;
  property: JSONSchemaProperty;
  label: string;
  control: ReturnType<typeof useForm>["control"];
  register: ReturnType<typeof useForm>["register"];
}

function ArrayField({
  fieldName,
  property,
  label,
  control,
  register,
}: ArrayFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  const getDefaultItem = (): unknown => {
    if (!property.items) return "";
    switch (property.items.type) {
      case "string":
        return "";
      case "number":
        return 0;
      case "boolean":
        return false;
      case "object":
        if (property.items.properties) {
          const obj: Record<string, unknown> = {};
          Object.entries(property.items.properties).forEach(([key, prop]) => {
            obj[key] =
              prop.default ??
              (prop.type === "string"
                ? ""
                : prop.type === "number"
                  ? 0
                  : false);
          });
          return obj;
        }
        return {};
      default:
        return "";
    }
  };

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(getDefaultItem())}
        >
          + Add Item
        </Button>
      </div>
      {property.description && (
        <p className="mb-2 text-sm text-gray-500">{property.description}</p>
      )}
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-start gap-2 rounded-lg border border-gray-200 p-3"
          >
            <div className="flex-1">
              {property.items?.type === "object" &&
              property.items.properties ? (
                <div className="space-y-3">
                  {Object.entries(property.items.properties).map(
                    ([key, prop]) => (
                      <FieldRenderer
                        key={key}
                        name={key}
                        property={prop}
                        control={control}
                        register={register}
                        prefix={`${fieldName}.${index}`}
                      />
                    ),
                  )}
                </div>
              ) : (
                <Input
                  {...register(`${fieldName}.${index}`)}
                  placeholder={
                    property.items?.description || `Item ${index + 1}`
                  }
                />
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
              aria-label={`Remove item ${index + 1}`}
              className="mt-1 text-red-500 hover:bg-red-50 hover:text-red-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </Button>
          </div>
        ))}
        {fields.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-400">
            No items yet. Click &quot;Add Item&quot; to get started.
          </p>
        )}
      </div>
    </div>
  );
}

interface ObjectFieldProps {
  fieldName: string;
  property: JSONSchemaProperty;
  label: string;
  control: ReturnType<typeof useForm>["control"];
  register: ReturnType<typeof useForm>["register"];
}

function ObjectField({
  fieldName,
  property,
  label,
  control,
  register,
}: ObjectFieldProps) {
  if (!property.properties) return null;

  return (
    <fieldset className="rounded-lg border border-gray-200 p-4">
      <legend className="px-2 text-sm font-medium text-gray-700">
        {label}
      </legend>
      {property.description && (
        <p className="mb-3 text-sm text-gray-500">{property.description}</p>
      )}
      <div className="space-y-4">
        {Object.entries(property.properties).map(([key, prop]) => (
          <FieldRenderer
            key={key}
            name={key}
            property={prop}
            control={control}
            register={register}
            prefix={fieldName}
            required={property.required?.includes(key)}
          />
        ))}
      </div>
    </fieldset>
  );
}
