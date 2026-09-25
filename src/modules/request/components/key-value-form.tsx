"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

import { useForm, useFieldArray, Control } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Plus, Trash2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Schema
const keyValueSchema = z.object({
  items: z.array(
    z.object({
      key: z.string().min(1, "Key is required"),
      value: z.string().min(1, "Value is required"),
      enabled: z.boolean().default(true).optional(),
    }),
  ),
});

// Types
type KeyValueFormData = z.infer<typeof keyValueSchema>;

export interface KeyValueItem {
  key: string;
  value: string;
  enabled?: boolean;
}

interface KeyValueFormEditorProps {
  initialData?: KeyValueItem[];

  onSubmit: (data: KeyValueItem[]) => void;

  placeholder?: {
    key?: string;
    value?: string;
    description?: string;
  };

  className?: string;
}

// Component
const KeyValueFormEditor: React.FC<KeyValueFormEditorProps> = ({
  initialData = [],
  onSubmit,
  placeholder = {
    key: "Key",
    value: "Value",
    description: "Description",
  },
  className,
}) => {
  // Form
  const form = useForm<KeyValueFormData>({
    resolver: zodResolver(keyValueSchema),

    defaultValues: {
      items:
        initialData.length > 0
          ? initialData.map((item) => ({
              ...item,
              enabled: item.enabled ?? true,
            }))
          : [
              {
                key: "",
                value: "",
                enabled: true,
              },
            ],
    },
  });

  // Field Array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Manual Submit
  const handleSubmit = (data: KeyValueFormData) => {
    const filteredItems = data.items
      .filter((item) => item.enabled && (item.key.trim() || item.value.trim()))
      .map(({ key, value }) => ({
        key,
        value,
      }));

    onSubmit(filteredItems);
  };

  // Add New Row
  const addNewRow = () => {
    append({
      key: "",
      value: "",
      enabled: true,
    });
  };

  // Toggle Enabled
  const toggleEnabled = (index: number) => {
    const currentValue = form.getValues(`items.${index}.enabled`);

    form.setValue(`items.${index}.enabled`, !currentValue);
  };

  // Remove Row
  const removeRow = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Autosave
  const lastSavedRef = useRef<string | null>(null);

  const getFilteredItemsFromValues = (items: KeyValueItem[]) =>
    items
      .filter(
        (item) => item.enabled && (item.key?.trim() || item.value?.trim()),
      )
      .map(({ key, value }) => ({
        key,
        value,
      }));

  // Debounce
  const debounce = (fn: (...args: any[]) => void, wait = 500) => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    return (...args: any[]) => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        fn(...args);
      }, wait);
    };
  };

  const saveIfChanged = useCallback(
    (items: KeyValueItem[]) => {
      const filtered = getFilteredItemsFromValues(items);

      const serialized = JSON.stringify(filtered);

      if (serialized !== lastSavedRef.current) {
        lastSavedRef.current = serialized;

        onSubmit(filtered);
      }
    },
    [onSubmit],
  );

  const debouncedSaveRef = useRef(saveIfChanged);

  useEffect(() => {
    debouncedSaveRef.current = saveIfChanged;
  }, [saveIfChanged]);

  const debouncedInvokerRef = useRef<((items: KeyValueItem[]) => void) | null>(
    null,
  );

  useEffect(() => {
    debouncedInvokerRef.current = debounce((items: KeyValueItem[]) => {
      debouncedSaveRef.current(items);
    }, 500);

    return () => {
      debouncedInvokerRef.current = null;
    };
  }, []);

  // Watch Form Changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      const items = (value as KeyValueFormData)?.items || [];

      debouncedInvokerRef.current?.(items as KeyValueItem[]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [form]);

  // UI
  return (
    <div className={cn("w-full", className)}>
      <Form {...form}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-400">
              Query Parameters
            </h3>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addNewRow}
              className="h-8 w-8 p-0 hover:bg-zinc-700"
              title="Add new row"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Rows */}
          <div className="space-y-2">
            {fields.map((field, index) => {
              const isEnabled = form.watch(`items.${index}.enabled`);

              return (
                <div
                  key={field.id}
                  className={cn(
                    "grid grid-cols-12 gap-3 rounded-lg border p-3 transition-all",

                    isEnabled
                      ? "border-zinc-700 bg-zinc-900"
                      : "border-zinc-800 bg-zinc-800/50 opacity-60",
                  )}
                >
                  {/* Key */}
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.key`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={placeholder.key}
                              disabled={!isEnabled}
                              className="border-0 bg-transparent text-sm placeholder:text-zinc-500 focus:border-0 focus:ring-0"
                            />
                          </FormControl>

                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Value */}
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={placeholder.value}
                              disabled={!isEnabled}
                              className="border-0 bg-transparent text-sm placeholder:text-zinc-500 focus:border-0 focus:ring-0"
                            />
                          </FormControl>

                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Enable / Disable */}
                  <div className="col-span-1 flex items-center justify-center">
                    <FormField
                      control={form.control}
                      name={`items.${index}.enabled`}
                      render={({ field: checkboxField }) => (
                        <FormItem>
                          <FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleEnabled(index)}
                              className={cn(
                                "h-5 w-5 rounded-sm border-2 p-0 transition-colors",

                                checkboxField.value
                                  ? "border-green-600 bg-green-600 text-white hover:bg-green-700"
                                  : "border-red-500 text-red-500 hover:border-red-400",
                              )}
                            >
                              {checkboxField.value ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
                            </Button>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Remove */}
                  <div className="col-span-1 flex items-center justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRow(index)}
                      disabled={fields.length <= 1}
                      className={cn(
                        "h-5 w-5 p-0 transition-colors",

                        fields.length <= 1
                          ? "cursor-not-allowed text-zinc-600"
                          : "text-red-400 hover:bg-red-900/20 hover:text-red-300",
                      )}
                      title="Remove row"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Autosave Status */}
          <div className="flex justify-end pt-4">
            <span className="text-xs text-zinc-500">
              Changes saved automatically
            </span>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default KeyValueFormEditor;
