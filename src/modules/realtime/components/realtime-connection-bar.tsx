"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Plug, PlugZap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useWsStore } from "../hooks/useWs";

const RealtimeConnectionBar = () => {
  const {
    status,
    isConnected,
    error,
    url: connectedUrl,
    reconnectAttempts,
    maxReconnectAttempts,
    connect,
    disconnect,
  } = useWsStore();

  const [url, setUrl] = useState(connectedUrl || "");

  // Keep local input in sync with the connected URL
  useEffect(() => {
    setUrl(connectedUrl || "");
  }, [connectedUrl]);

  const onConnect = useCallback(() => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      toast.error("Please enter a WebSocket URL");
      return;
    }

    if (isConnected) {
      disconnect();
      toast.success("WebSocket disconnected");
      return;
    }

    connect(trimmedUrl, {
      onOpen: () => {
        console.log("Successfully connected to:", trimmedUrl);
        toast.success("WebSocket connected");
      },

      onClose: () => {
        console.log("Disconnected from WebSocket");
      },

      onError: (error) => {
        console.error("WebSocket connection error:", error);
      },

      onMessage: (event) => {
        console.log("Received message:", event.data);
      },

      autoReconnect: true,
      reconnectDelay: 3000,
    });
  }, [url, isConnected, connect, disconnect]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onConnect();
      }
    },
    [onConnect],
  );

  const getConnectionColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-600 hover:bg-green-700";

      case "connecting":
      case "reconnecting":
        return "bg-yellow-600 hover:bg-yellow-700";

      case "error":
        return "bg-red-600 hover:bg-red-700";

      default:
        return "bg-zinc-700 hover:bg-zinc-600";
    }
  };

  const getConnectionIcon = () => {
    switch (status) {
      case "connected":
        return <Plug className="h-4 w-4" />;

      case "connecting":
      case "reconnecting":
        return <PlugZap className="h-4 w-4 animate-pulse" />;

      case "error":
        return <AlertCircle className="h-4 w-4" />;

      default:
        return <PlugZap className="h-4 w-4" />;
    }
  };

  const getButtonText = () => {
    switch (status) {
      case "connected":
        return "Disconnect";

      case "connecting":
        return "Connecting...";

      case "reconnecting":
        return `Reconnecting... (${reconnectAttempts}/${maxReconnectAttempts})`;

      case "error":
        return "Retry";

      default:
        return "Connect";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "reconnecting":
        return `reconnecting (${reconnectAttempts}/${maxReconnectAttempts})`;

      default:
        return status;
    }
  };

  const isConnecting = status === "connecting" || status === "reconnecting";

  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-md border border-zinc-800 bg-zinc-900 p-2">
      {/* URL Input */}
      <div className="min-w-0 flex-1">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter WebSocket URL (e.g., ws://localhost:8080)"
          className="h-9 border-zinc-700 bg-zinc-800 text-sm text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500"
          disabled={isConnecting}
        />
      </div>

      {/* Status + Button */}
      <div className="flex shrink-0 items-center gap-3">
        {/* Connection Status */}
        <div className="flex max-w-52 flex-col items-end text-xs">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <div
              className={`h-2 w-2 rounded-full ${
                status === "connected"
                  ? "bg-green-500"
                  : status === "connecting" || status === "reconnecting"
                    ? "animate-pulse bg-yellow-500"
                    : status === "error"
                      ? "bg-red-500"
                      : "bg-zinc-500"
              }`}
            />

            <span className="capitalize">{getStatusText()}</span>
          </div>

          {/* Connected URL */}
          {connectedUrl && (
            <div
              className="max-w-52 truncate text-[10px] text-zinc-500"
              title={connectedUrl}
            >
              {connectedUrl}
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="max-w-52 truncate text-[10px] text-red-400"
              title={error}
            >
              {error}
            </div>
          )}
        </div>

        {/* Connect / Disconnect Button */}
        <Button
          type="button"
          onClick={onConnect}
          disabled={isConnecting}
          className={`h-9 text-sm font-semibold text-white transition-colors ${getConnectionColor()}`}
        >
          <span className="flex items-center gap-2">
            {getConnectionIcon()}
            {getButtonText()}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default RealtimeConnectionBar;
