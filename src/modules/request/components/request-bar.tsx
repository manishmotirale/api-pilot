"use client";

import React from "react";
import { RequestTab } from "../store/useRequestStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { useRunRequest } from "../hooks/request";
import { toast } from "sonner";
import { REST_METHOD } from "../../../../prisma/generated/enums";

interface Props {
  tab: RequestTab;
  updateTab: (id: string, data: Partial<RequestTab>) => void;
}

const RequestBar = ({ tab, updateTab }: Props) => {
  const { mutateAsync, isPending } = useRunRequest(tab?.requestId!);

  const requestColorMap: Record<REST_METHOD, string> = {
    [REST_METHOD.GET]: "text-green-500",
    [REST_METHOD.POST]: "text-blue-500",
    [REST_METHOD.PUT]: "text-yellow-500",
    [REST_METHOD.DELETE]: "text-red-500",
    [REST_METHOD.PATCH]: "text-orange-500",
  };

  const onSendRequest = async () => {
    if (!tab.url?.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    try {
      await mutateAsync();
      toast.success("Request sent successfully!");
    } catch (error) {
      console.error("Failed to send request:", error);
      toast.error("Failed to send request.");
    }
  };

  return (
    <div className="flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-900/80 p-3 border border-white/5 shadow-lg">
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* HTTP Method */}
        <Select
          value={tab.method}
          onValueChange={(value) =>
            updateTab(tab.id, {
              method: value as REST_METHOD,
            })
          }
        >
          <SelectTrigger
            className={`w-full sm:w-28 font-semibold border-zinc-700/50 ${
              requestColorMap[tab.method as REST_METHOD] || "text-zinc-400"
            }`}
          >
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value={REST_METHOD.GET} className="text-green-500 font-semibold">
                GET
              </SelectItem>

              <SelectItem value={REST_METHOD.POST} className="text-blue-500 font-semibold">
                POST
              </SelectItem>

              <SelectItem value={REST_METHOD.PUT} className="text-yellow-500 font-semibold">
                PUT
              </SelectItem>

              <SelectItem value={REST_METHOD.PATCH} className="text-orange-500 font-semibold">
                PATCH
              </SelectItem>

              <SelectItem value={REST_METHOD.DELETE} className="text-red-500 font-semibold">
                DELETE
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* URL */}
        <Input
          value={tab.url || ""}
          onChange={(e) =>
            updateTab(tab.id, {
              url: e.target.value,
            })
          }
          placeholder="https://api.example.com/endpoint"
          className="flex-1 border-zinc-700/50 bg-zinc-950/50 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-all"
        />
      </div>

      {/* Send Button */}
      <Button
        type="button"
        onClick={onSendRequest}
        disabled={isPending || !tab.url?.trim()}
        className="group relative w-full sm:w-auto overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 font-semibold text-white hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-50 shadow-xl shadow-purple-500/30 transition-all active:scale-95 hover:shadow-2xl hover:shadow-pink-500/40"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            <span className="hidden sm:inline">Sending...</span>
            <span className="sm:hidden">...</span>
          </>
        ) : (
          <>
            <Send className="mr-2 size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-12" />
            <span>Send</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default RequestBar;
