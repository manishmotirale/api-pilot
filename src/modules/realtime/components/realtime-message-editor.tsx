"use client";

import Editor, { OnMount } from "@monaco-editor/react";
import { Copy, RefreshCw, Send, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useWsStore } from "../hooks/useWs";
import RealtimeClientServerLogsTable from "./realtime-client-server-logs-table";

const RealtimeMessageEditor = () => {
  const { send, status, draftMessage, setDraftMessage } = useWsStore();

  const [isSending, setIsSending] = useState(false);

  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  // Initialize default message
  useEffect(() => {
    if (!draftMessage) {
      const initialMessage = JSON.stringify(
        {
          type: "message",
          content: "Hello WebSocket!",
          timestamp: new Date().toISOString(),
        },
        null,
        2,
      );

      setDraftMessage(initialMessage);
    }
  }, [draftMessage, setDraftMessage]);

  // Send WebSocket message
  const handleSendMessage = useCallback(async () => {
    if (status !== "connected") {
      toast.info("WebSocket is not connected!");
      return;
    }

    if (!draftMessage.trim()) {
      toast.info("Please enter a message!");
      return;
    }

    try {
      setIsSending(true);

      let messageToSend: string | object;

      try {
        // Send valid JSON as an object
        messageToSend = JSON.parse(draftMessage);
      } catch {
        // Send invalid JSON as plain text
        messageToSend = draftMessage;
      }

      const success = send(messageToSend);

      if (success) {
        toast.success("Message sent successfully");
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);

      toast.error(
        `Error sending message: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    } finally {
      setIsSending(false);
    }
  }, [draftMessage, send, status]);

  // Monaco Editor mount
  const handleEditorDidMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;

      // Configure JSON validation
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: false,
        schemas: [],
        enableSchemaRequest: true,
      });

      // Configure editor
      editor.updateOptions({
        fontSize: 14,
        minimap: {
          enabled: false,
        },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        formatOnPaste: true,
        formatOnType: true,
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
        folding: true,
        lineNumbers: "on",
        renderWhitespace: "boundary",
        cursorStyle: "line",
        contextmenu: true,
        mouseWheelZoom: false,
      });

      // Ctrl + Enter to send
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        handleSendMessage();
      });
    },
    [handleSendMessage],
  );

  // Format JSON
  const handleFormatJSON = useCallback(() => {
    if (!draftMessage.trim()) {
      toast.info("Nothing to format");
      return;
    }

    try {
      const parsed = JSON.parse(draftMessage);

      const formatted = JSON.stringify(parsed, null, 2);

      setDraftMessage(formatted);

      toast.success("JSON formatted");
    } catch {
      toast.error("Invalid JSON format");
    }
  }, [draftMessage, setDraftMessage]);

  // Copy message
  const handleCopyMessage = useCallback(async () => {
    if (!draftMessage) {
      toast.info("Nothing to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(draftMessage);

      toast.success("Message copied");
    } catch (error) {
      console.error("Failed to copy message:", error);

      toast.error("Failed to copy message");
    }
  }, [draftMessage]);

  // Clear message
  const handleClearMessage = useCallback(() => {
    const emptyMessage = "{\n  \n}";

    setDraftMessage(emptyMessage);

    setTimeout(() => {
      editorRef.current?.focus();
    }, 0);
  }, [setDraftMessage]);

  const isConnected = status === "connected";

  return (
    <div className="flex flex-col space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Message Editor</h3>

          <p className="mt-0.5 text-xs text-zinc-500">
            Send messages to your WebSocket server
          </p>
        </div>

        {/* Connection Status */}
        <div
          className={`flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium ${
            isConnected
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />

          {isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>

      {/* Editor */}
      <div className="relative overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950">
        <Editor
          height="200px"
          language="json"
          theme="vs-dark"
          value={draftMessage}
          onChange={(value) => {
            setDraftMessage(value || "");
          }}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            minimap: {
              enabled: false,
            },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            formatOnPaste: true,
            formatOnType: true,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            folding: true,
            lineNumbers: "on",
            renderWhitespace: "boundary",
            cursorStyle: "line",
            contextmenu: true,
            mouseWheelZoom: false,
          }}
          loading={
            <div className="flex h-[200px] w-full items-center justify-center bg-zinc-950">
              <span className="text-sm text-zinc-500">
                Loading Monaco Editor...
              </span>
            </div>
          }
        />

        {/* Editor Actions */}
        <div className="absolute right-2 top-2 flex gap-1 rounded-md border border-zinc-700 bg-zinc-900/90 p-1 opacity-80 backdrop-blur-sm transition-opacity hover:opacity-100">
          {/* Format */}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleFormatJSON}
            title="Format JSON"
            className="h-7 w-7 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          {/* Copy */}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleCopyMessage}
            title="Copy message"
            className="h-7 w-7 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>

          {/* Clear */}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleClearMessage}
            title="Clear message"
            className="h-7 w-7 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-xs text-zinc-500">
          Press{" "}
          <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
            Ctrl
          </kbd>{" "}
          +{" "}
          <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
            Enter
          </kbd>{" "}
          to send
        </div>

        {/* Send */}
        <Button
          type="button"
          onClick={handleSendMessage}
          disabled={!isConnected || isSending}
          className="bg-indigo-600 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="mr-2 h-4 w-4" />

          {isSending ? "Sending..." : "Send Message"}
        </Button>
      </div>

      {/* Logs */}
      <RealtimeClientServerLogsTable />
    </div>
  );
};

export default RealtimeMessageEditor;
