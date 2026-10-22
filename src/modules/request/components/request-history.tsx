"use client";

import React, { useState } from "react";
import {
  History,
  Clock,
  Search,
  Trash2,
  RotateCcw,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HistoryItem {
  id: string;
  method: string;
  url: string;
  status: number;
  statusText: string;
  timestamp: Date;
  duration: number;
}

const RequestHistory = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMethod, setFilterMethod] = useState<string | null>(null);

  // Mock data - replace with actual data from your store/API
  const historyItems: HistoryItem[] = [
    {
      id: "1",
      method: "GET",
      url: "https://api.example.com/users",
      status: 200,
      statusText: "OK",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      duration: 234,
    },
    {
      id: "2",
      method: "POST",
      url: "https://api.example.com/users",
      status: 201,
      statusText: "Created",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      duration: 567,
    },
    {
      id: "3",
      method: "GET",
      url: "https://api.example.com/posts",
      status: 404,
      statusText: "Not Found",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      duration: 123,
    },
    {
      id: "4",
      method: "DELETE",
      url: "https://api.example.com/users/123",
      status: 500,
      statusText: "Internal Server Error",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      duration: 1234,
    },
  ];

  const methodColors: Record<string, string> = {
    GET: "from-green-500 to-emerald-500",
    POST: "from-blue-500 to-cyan-500",
    PUT: "from-yellow-500 to-orange-500",
    DELETE: "from-red-500 to-pink-500",
    PATCH: "from-purple-500 to-violet-500",
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) {
      return <CheckCircle2 className="h-4 w-4 text-green-400" />;
    } else if (status >= 400 && status < 500) {
      return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    } else if (status >= 500) {
      return <XCircle className="h-4 w-4 text-red-400" />;
    }
    return <Clock className="h-4 w-4 text-blue-400" />;
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-400";
    if (status >= 400 && status < 500) return "text-yellow-400";
    if (status >= 500) return "text-red-400";
    return "text-blue-400";
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredHistory = historyItems
    .filter((item) => {
      const matchesSearch =
        item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.method.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = !filterMethod || item.method === filterMethod;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        className="group relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-500/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
      >
        <History className="h-4 w-4 text-zinc-400 transition-all duration-300 group-hover:scale-110 group-hover:text-purple-400 group-hover:-rotate-12" />
        <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/20 text-[8px] font-bold text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
          {historyItems.length}
        </div>
      </button>

      <DialogContent
        className="
          max-w-3xl
          overflow-hidden
          rounded-2xl
          border
          border-white/[0.10]
          bg-[#0b0f17]/98
          p-0
          shadow-[0_30px_100px_rgba(0,0,0,0.65)]
          backdrop-blur-xl
        "
      >
        <DialogHeader className="border-b border-white/[0.08] bg-[#080b11] p-6">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-white">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-purple-500/20
                to-pink-500/20
                ring-1
                ring-purple-400/30
              "
            >
              <History className="h-5 w-5 text-purple-400" />
            </div>
            Request History
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            View and replay your recent API requests
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filter */}
        <div className="border-b border-white/[0.08] bg-[#080b11] p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search by URL or method..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  h-10
                  border-white/[0.08]
                  bg-white/[0.03]
                  pl-10
                  text-sm
                  text-white
                  placeholder:text-zinc-600
                  focus-visible:ring-purple-500/40
                "
              />
            </div>

            <DropdownMenu>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                }}
                variant="outline"
                size="icon"
                className="
                  h-10
                  w-10
                  border-white/[0.08]
                  bg-white/[0.03]
                  hover:border-purple-500/40
                  hover:bg-purple-500/10
                "
              >
                <Filter className="h-4 w-4 text-zinc-400" />
              </Button>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setFilterMethod(null)}>
                  All Methods
                </DropdownMenuItem>
                {["GET", "POST", "PUT", "DELETE", "PATCH"].map((method) => (
                  <DropdownMenuItem
                    key={method}
                    onClick={() => setFilterMethod(method)}
                  >
                    {method}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="icon"
              className="
                h-10
                w-10
                border-white/[0.08]
                bg-white/[0.03]
                hover:border-red-500/40
                hover:bg-red-500/10
              "
            >
              <Trash2 className="h-4 w-4 text-zinc-400 hover:text-red-400" />
            </Button>
          </div>
        </div>

        {/* History List */}
        <ScrollArea className="h-[500px] p-4">
          <div className="space-y-2">
            {filteredHistory.length === 0 ? (
              <div className="flex h-[400px] flex-col items-center justify-center text-center">
                <div
                  className="
                    mb-4
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    from-purple-500/10
                    to-pink-500/10
                    ring-1
                    ring-purple-500/20
                  "
                >
                  <History className="h-10 w-10 text-purple-400/40" />
                </div>
                <p className="text-sm font-medium text-zinc-400">
                  No requests found
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  Your request history will appear here
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="
                    group
                    flex
                    items-center
                    gap-4
                    rounded-xl
                    border
                    border-white/[0.05]
                    bg-white/[0.02]
                    p-4
                    transition-all
                    duration-200
                    hover:border-white/[0.12]
                    hover:bg-white/[0.05]
                  "
                >
                  {/* Status Icon */}
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-white/[0.05]
                    "
                  >
                    {getStatusIcon(item.status)}
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-center gap-2">
                      <Badge
                        className={`
                          h-5
                          rounded-md
                          border-0
                          bg-gradient-to-r
                          px-2
                          text-[10px]
                          font-bold
                          text-white
                          ${methodColors[item.method]}
                        `}
                      >
                        {item.method}
                      </Badge>
                      <span className={`text-sm font-semibold ${getStatusColor(item.status)}`}>
                        {item.status} {item.statusText}
                      </span>
                      <span className="text-xs text-zinc-600">•</span>
                      <span className="text-xs text-zinc-600">
                        {item.duration}ms
                      </span>
                    </div>
                    <p className="truncate text-sm text-zinc-300">{item.url}</p>
                    <p className="mt-1 text-xs text-zinc-600">
                      {formatTimestamp(item.timestamp)}
                    </p>
                  </div>

                  {/* Actions */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="
                      h-8
                      w-8
                      opacity-0
                      transition-opacity
                      group-hover:opacity-100
                    "
                  >
                    <RotateCcw className="h-4 w-4 text-zinc-400 hover:text-white" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RequestHistory;
