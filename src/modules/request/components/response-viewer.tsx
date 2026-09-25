"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Editor from "@monaco-editor/react";

import {
  CheckCircle,
  Clock,
  Code,
  Copy,
  Download,
  FileText,
  Filter,
  HardDrive,
  MoreHorizontal,
  Settings,
  TestTube,
} from "lucide-react";

type HeadersMap = Record<string, string>;

interface RequestRun {
  id: string;
  requestId?: string;
  status?: number;
  statusText?: string;
  headers?: HeadersMap;
  body?: string | object | null;
  durationMs?: number;
  createdAt?: string;
}

interface Result {
  status?: number;
  statusText?: string;
  duration?: number;
  size?: number;
}

export interface ResponseData {
  success: boolean;
  requestRun: RequestRun;
  result?: Result;
}

interface Props {
  responseData: ResponseData;
}

const ResponseViewer = ({ responseData }: Props) => {
  const [activeTab, setActiveTab] = useState("json");

  // ============================================
  // Status Color
  // ============================================
  const getStatusColor = (status?: number): string => {
    const value = typeof status === "number" ? status : 0;

    if (value >= 200 && value < 300) {
      return "text-green-400";
    }

    if (value >= 300 && value < 400) {
      return "text-yellow-400";
    }

    if (value >= 400 && value < 500) {
      return "text-orange-400";
    }

    if (value >= 500) {
      return "text-red-400";
    }

    return "text-zinc-400";
  };

  // ============================================
  // Format Response Size
  // ============================================
  const formatBytes = (bytes?: number): string => {
    if (!bytes || bytes === 0) {
      return "0 B";
    }

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // ============================================
  // Copy To Clipboard
  // ============================================
  const copyToClipboard = async (text: string) => {
    if (!navigator?.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy response:", error);
    }
  };

  // ============================================
  // Parse Response Body
  // ============================================
  let responseBody: unknown = {};
  let formattedJsonString = "";

  try {
    const rawBody = responseData?.requestRun?.body;

    if (typeof rawBody === "string") {
      responseBody = rawBody.length ? JSON.parse(rawBody) : rawBody;
    } else {
      responseBody = rawBody ?? {};
    }

    formattedJsonString = JSON.stringify(responseBody, null, 2);
  } catch (error) {
    console.error("Response is not valid JSON:", error);

    responseBody = responseData?.requestRun?.body ?? {};

    formattedJsonString =
      typeof responseBody === "string"
        ? responseBody
        : JSON.stringify(responseBody, null, 2);
  }

  // ============================================
  // Response Information
  // ============================================
  const status = responseData.result?.status ?? responseData.requestRun?.status;

  const statusText =
    responseData.result?.statusText ?? responseData.requestRun?.statusText;

  const duration =
    responseData.result?.duration ?? responseData.requestRun?.durationMs;

  const size = responseData.result?.size;

  const rawBody = responseData.requestRun?.body;

  const responseHeaders = responseData.requestRun?.headers ?? {};

  return (
    <div className="w-full bg-zinc-950 p-6 text-white">
      <div className="mx-auto w-full">
        {/* ============================================
            Response Status Header
        ============================================ */}
        <Card className="mb-6 border-zinc-800 bg-zinc-900">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Response Information */}
              <div className="flex flex-wrap items-center gap-5">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-400">Status:</span>

                  <Badge
                    className={`${getStatusColor(
                      status,
                    )} border-current bg-transparent`}
                  >
                    {status ?? "—"}
                    {statusText ? ` • ${statusText}` : ""}
                  </Badge>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-zinc-500" />

                  <span className="text-sm text-zinc-400">Time:</span>

                  <span className="text-sm text-indigo-300">
                    {duration !== undefined ? `${duration} ms` : "—"}
                  </span>
                </div>

                {/* Size */}
                <div className="flex items-center gap-2">
                  <HardDrive className="size-4 text-zinc-500" />

                  <span className="text-sm text-zinc-400">Size:</span>

                  <span className="text-sm text-green-300">
                    {formatBytes(size)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <Filter className="mr-2 size-4" />
                  Filter
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <Download className="mr-2 size-4" />
                  Save
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* ============================================
            Response Card
        ============================================ */}
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-zinc-200">Response Body</CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {/* ============================================
                  Tabs
              ============================================ */}
              <div className="border-b border-zinc-800 px-6">
                <TabsList className="h-auto bg-transparent p-0">
                  {/* JSON */}
                  <TabsTrigger
                    value="json"
                    className="rounded-b-none rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 text-zinc-400 data-[state=active]:border-indigo-500 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                  >
                    <Code className="mr-2 size-4" />
                    JSON
                  </TabsTrigger>

                  {/* Raw */}
                  <TabsTrigger
                    value="raw"
                    className="rounded-b-none rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 text-zinc-400 data-[state=active]:border-indigo-500 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                  >
                    <FileText className="mr-2 size-4" />
                    Raw
                  </TabsTrigger>

                  {/* Headers */}
                  <TabsTrigger
                    value="headers"
                    className="rounded-b-none rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 text-zinc-400 data-[state=active]:border-indigo-500 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                  >
                    <Settings className="mr-2 size-4" />
                    Headers
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-zinc-700 text-xs text-zinc-300"
                    >
                      {Object.keys(responseHeaders).length}
                    </Badge>
                  </TabsTrigger>

                  {/* Test Results */}
                  <TabsTrigger
                    value="test"
                    className="rounded-b-none rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 text-zinc-400 data-[state=active]:border-indigo-500 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                  >
                    <TestTube className="mr-2 size-4" />
                    Test Results
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* ============================================
                  JSON TAB
              ============================================ */}
              <TabsContent value="json" className="mt-0">
                <div className="relative">
                  {/* Copy Button */}
                  <div className="absolute right-4 top-4 z-10">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="bg-zinc-800/70 text-zinc-400 backdrop-blur-sm hover:text-white"
                      onClick={() => copyToClipboard(formattedJsonString)}
                    >
                      <Copy className="size-4" />
                    </Button>
                  </div>

                  {/* Monaco Editor */}
                  <div className="h-96">
                    <Editor
                      height="100%"
                      defaultLanguage="json"
                      value={formattedJsonString}
                      options={{
                        readOnly: true,
                        minimap: {
                          enabled: false,
                        },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        wordWrap: "on",
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        lineNumbers: "on",
                        glyphMargin: false,
                        folding: true,
                        lineDecorationsWidth: 0,
                        lineNumbersMinChars: 3,
                        renderLineHighlight: "none",
                        scrollbar: {
                          vertical: "auto",
                          horizontal: "auto",
                          verticalScrollbarSize: 8,
                          horizontalScrollbarSize: 8,
                        },
                      }}
                      theme="vs-dark"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* ============================================
                  RAW TAB
              ============================================ */}
              <TabsContent value="raw" className="mt-0">
                <div className="relative">
                  {/* Copy Button */}
                  <div className="absolute right-4 top-4 z-10">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="bg-zinc-800/70 text-zinc-400 hover:text-white"
                      onClick={() => copyToClipboard(String(rawBody ?? ""))}
                    >
                      <Copy className="size-4" />
                    </Button>
                  </div>

                  {/* Monaco Editor */}
                  <div className="h-96">
                    <Editor
                      height="100%"
                      defaultLanguage="text"
                      value={String(rawBody ?? "")}
                      options={{
                        readOnly: true,
                        minimap: {
                          enabled: false,
                        },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        wordWrap: "on",
                        lineNumbers: "on",
                        glyphMargin: false,
                        folding: true,
                        lineDecorationsWidth: 0,
                        lineNumbersMinChars: 3,
                        renderLineHighlight: "none",
                        scrollbar: {
                          vertical: "auto",
                          horizontal: "auto",
                          verticalScrollbarSize: 8,
                          horizontalScrollbarSize: 8,
                        },
                      }}
                      theme="vs-dark"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* ============================================
                  HEADERS TAB
              ============================================ */}
              <TabsContent value="headers" className="mt-0">
                <ScrollArea className="h-96">
                  <div className="p-6">
                    {Object.keys(responseHeaders).length === 0 ? (
                      <div className="flex h-40 items-center justify-center text-sm text-zinc-500">
                        No response headers available.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {Object.entries(responseHeaders).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-start justify-between border-b border-zinc-800 py-3 last:border-b-0"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-indigo-300">
                                {key}
                              </div>

                              <div className="break-all text-sm text-zinc-300">
                                {value}
                              </div>
                            </div>

                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="ml-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                              onClick={() =>
                                copyToClipboard(`${key}: ${value}`)
                              }
                            >
                              <Copy className="size-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* ============================================
                  TEST RESULTS TAB
              ============================================ */}
              <TabsContent value="test" className="mt-0">
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <CheckCircle className="size-5 text-green-400" />

                    <span className="font-medium text-green-400">
                      All tests passed
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                      <span className="text-sm text-zinc-300">
                        Status code is 200
                      </span>

                      <CheckCircle className="size-4 text-green-400" />
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                      <span className="text-sm text-zinc-300">
                        Response time is less than 3000ms
                      </span>

                      <CheckCircle className="size-4 text-green-400" />
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                      <span className="text-sm text-zinc-300">
                        Content-Type is present
                      </span>

                      <CheckCircle className="size-4 text-green-400" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResponseViewer;
