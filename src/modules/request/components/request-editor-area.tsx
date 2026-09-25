"use client";

import React, { useMemo } from "react";
import { RequestTab } from "../store/useRequestStore";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import KeyValueFormEditor from "./key-value-form";
import BodyEditor from "./body-editor";
import { toast } from "sonner";

interface Props {
  tab: RequestTab;
  updateTab: (id: string, data: Partial<RequestTab>) => void;
}

interface KeyValueItem {
  key: string;
  value: string;
  enabled?: boolean;
}

interface BodyData {
  contentType: string;
  body?: string;
}

const RequestEditorArea = ({ tab, updateTab }: Props) => {
  // Parse JSON safely
  const parseKeyValueData = (jsonString?: string): KeyValueItem[] => {
    if (!jsonString) {
      return [];
    }

    try {
      const parsed = JSON.parse(jsonString);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed;
    } catch (error) {
      console.error("Failed to parse key-value data:", error);
      return [];
    }
  };

  // Parameters
  const parametersData = useMemo(() => {
    const parsed = parseKeyValueData(tab.parameters);

    return parsed.length > 0
      ? parsed
      : [
          {
            key: "",
            value: "",
            enabled: true,
          },
        ];
  }, [tab.parameters]);

  // Headers
  const headersData = useMemo(() => {
    const parsed = parseKeyValueData(tab.headers);

    return parsed.length > 0
      ? parsed
      : [
          {
            key: "",
            value: "",
            enabled: true,
          },
        ];
  }, [tab.headers]);

  // Body
  const bodyData = useMemo<BodyData>(() => {
    return {
      contentType: "application/json",
      body: tab.body || "",
    };
  }, [tab.body]);

  // Headers Change
  const handleHeadersChange = (data: KeyValueItem[]) => {
    const filteredHeaders = data.filter(
      (item) =>
        item.enabled !== false && (item.key.trim() || item.value.trim()),
    );

    updateTab(tab.id, {
      headers: JSON.stringify(filteredHeaders),
    });

    toast.success("Headers updated successfully");
  };

  // Parameters Change
  const handleParametersChange = (data: KeyValueItem[]) => {
    const filteredParams = data.filter(
      (item) =>
        item.enabled !== false && (item.key.trim() || item.value.trim()),
    );

    updateTab(tab.id, {
      parameters: JSON.stringify(filteredParams),
    });

    toast.success("Parameters updated successfully");
  };

  // Body Change
  const handleBodyChange = (data: BodyData) => {
    updateTab(tab.id, {
      body: data.body || "",
    });

    toast.success("Body updated successfully");
  };

  return (
    <Tabs
      defaultValue="parameters"
      className="w-full rounded-md bg-zinc-900 px-4 py-4"
    >
      {/* Tab Navigation */}
      <TabsList className="w-full rounded-md bg-zinc-800">
        <TabsTrigger
          value="parameters"
          className="flex-1 data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
        >
          Parameters
        </TabsTrigger>

        <TabsTrigger
          value="headers"
          className="flex-1 data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
        >
          Headers
        </TabsTrigger>

        <TabsTrigger
          value="body"
          className="flex-1 data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
        >
          Body
        </TabsTrigger>
      </TabsList>

      {/* Parameters */}
      <TabsContent value="parameters" className="mt-4">
        <KeyValueFormEditor
          initialData={parametersData}
          onSubmit={handleParametersChange}
          placeholder={{
            key: "Parameter Name",
            value: "Parameter Value",
            description: "URL Parameter",
          }}
        />
      </TabsContent>

      {/* Headers */}
      <TabsContent value="headers" className="mt-4">
        <KeyValueFormEditor
          initialData={headersData}
          onSubmit={handleHeadersChange}
          placeholder={{
            key: "Header Name",
            value: "Header Value",
            description: "HTTP Header",
          }}
        />
      </TabsContent>

      {/* Body */}
      <TabsContent value="body" className="mt-4">
        <BodyEditor initialData={bodyData} onSubmit={handleBodyChange} />
      </TabsContent>
    </Tabs>
  );
};

export default RequestEditorArea;
