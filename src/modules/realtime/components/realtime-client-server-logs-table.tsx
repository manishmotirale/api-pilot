"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useWsStore } from "../hooks/useWs";

const RealtimeClientServerLogsTable = () => {
  const { messages, clearMessages } = useWsStore();

  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number>(-1);

  const tableRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToBottom = () => {
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }
  };

  const scrollToRow = (index: number) => {
    const row = rowRefs.current[index];

    if (row && tableRef.current) {
      const containerRect = tableRef.current.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();

      if (
        rowRect.top < containerRect.top ||
        rowRect.bottom > containerRect.bottom
      ) {
        row.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  };

  // Keep the latest message visible when nothing is selected.
  useEffect(() => {
    if (messages.length > 0 && selectedMessageIndex === -1) {
      scrollToBottom();
    }
  }, [messages.length, selectedMessageIndex]);

  // Remove stale row references.
  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, messages.length);
  }, [messages.length]);

  const handleNavigateUp = () => {
    if (messages.length === 0) return;

    const newIndex =
      selectedMessageIndex === -1
        ? messages.length - 1
        : Math.max(0, selectedMessageIndex - 1);

    setSelectedMessageIndex(newIndex);
    scrollToRow(newIndex);
  };

  const handleNavigateDown = () => {
    if (messages.length === 0) return;

    const newIndex =
      selectedMessageIndex === -1
        ? 0
        : selectedMessageIndex + 1 < messages.length
          ? selectedMessageIndex + 1
          : -1;

    setSelectedMessageIndex(newIndex);

    if (newIndex === -1) {
      scrollToBottom();
    } else {
      scrollToRow(newIndex);
    }
  };

  const handleRowClick = (index: number) => {
    setSelectedMessageIndex((current) => (current === index ? -1 : index));
  };

  const handleClearMessages = () => {
    clearMessages();
    setSelectedMessageIndex(-1);
    rowRefs.current = [];
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Message copied");
    } catch (error) {
      console.error("Failed to copy message:", error); 
      toast.error("Failed to copy message");
    }
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return "Invalid time";
    }

    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    }).format(date);
  };

  const formatMessageData = (data: unknown): string => {
    if (typeof data === "string") {
      try {
        return JSON.stringify(JSON.parse(data), null, 2);
      } catch {
        return data;
      }
    }

    if (data === undefined) {
      return "";
    }

    try {
      return JSON.stringify(data, null, 2) ?? String(data);
    } catch {
      return String(data);
    }
  };

  return (
    <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-zinc-400" />

          <h3 className="text-sm font-semibold text-white">Message Logs</h3>

          <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
            {messages.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleNavigateUp}
            disabled={messages.length === 0}
            className="h-8 w-8 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            title="Previous message"
            aria-label="Previous message"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleNavigateDown}
            disabled={messages.length === 0}
            className="h-8 w-8 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            title="Next message"
            aria-label="Next message"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="mx-1 h-5 w-px bg-zinc-700" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearMessages}
            disabled={messages.length === 0}
            className="h-8 w-8 p-0 text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
            title="Clear all messages"
            aria-label="Clear all messages"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Message list */}
      <div
        ref={tableRef}
        className="min-h-0 max-h-[420px] min-w-0 overflow-y-auto overflow-x-hidden"
      >
        {messages.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 px-4 text-center">
            <Clock className="h-6 w-6 text-zinc-600" />

            <p className="text-sm font-medium text-zinc-400">No messages yet</p>

            <p className="text-xs text-zinc-500">
              Connect to a WebSocket server to see sent and received messages.
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {messages.map((message, index) => {
              const isSelected = selectedMessageIndex === index;
              const isSent = message.type === "sent";

              const formattedData = formatMessageData(message.data);

              const preview =
                typeof message.data === "string" ? message.data : formattedData;

              return (
                <div
                  key={message.id}
                  ref={(element) => {
                    rowRefs.current[index] = element;
                  }}
                  onClick={() => handleRowClick(index)}
                  className={`cursor-pointer rounded-md border border-l-[3px] p-3 transition-colors ${
                    isSent ? "border-l-blue-500" : "border-l-green-500"
                  } ${
                    isSelected
                      ? "border-zinc-700 bg-zinc-800/80"
                      : "border-transparent hover:bg-zinc-800/50"
                  }`}
                >
                  {/* Message metadata */}
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      {isSent ? (
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-blue-400" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 shrink-0 text-green-400" />
                      )}

                      <span
                        className={`text-xs font-semibold capitalize ${
                          isSent ? "text-blue-400" : "text-green-400"
                        }`}
                      >
                        {message.type}
                      </span>

                      <span className="text-xs text-zinc-600">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-[11px] text-zinc-500">
                        {formatTimestamp(message.timestamp)}
                      </span>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();

                          void copyToClipboard(message.raw || formattedData);
                        }}
                        className="h-7 w-7 p-0 text-zinc-500 hover:bg-zinc-700 hover:text-white"
                        title="Copy message"
                        aria-label="Copy message"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Message content */}
                  <div className="min-w-0 rounded-md bg-zinc-950/70 p-2 font-mono text-xs text-zinc-300">
                    {isSelected ? (
                      <pre className="whitespace-pre-wrap break-all">
                        {formattedData}
                      </pre>
                    ) : (
                      <p className="truncate">{preview}</p>
                    )}
                  </div>

                  {/* Raw message */}
                  {isSelected &&
                    message.raw &&
                    message.raw !== formattedData && (
                      <div className="mt-3">
                        <p className="mb-1 text-xs font-medium text-zinc-500">
                          Raw message
                        </p>

                        <div className="rounded-md bg-zinc-950/70 p-2 font-mono text-xs text-zinc-400">
                          <pre className="whitespace-pre-wrap break-all">
                            {message.raw}
                          </pre>
                        </div>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selection footer */}
      {selectedMessageIndex >= 0 && selectedMessageIndex < messages.length && (
        <div className="shrink-0 border-t border-zinc-800 px-4 py-2 text-xs text-zinc-500">
          Message {selectedMessageIndex + 1} of {messages.length} selected
        </div>
      )}
    </div>
  );
};

export default RealtimeClientServerLogsTable;
