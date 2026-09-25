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
// import { useRunRequest } from "../hooks/request";
import { toast } from "sonner";
import { REST_METHOD } from "../../../../prisma/generated/enums";

interface Props {
  tab: RequestTab;
  updateTab: (id: string, data: Partial<RequestTab>) => void;
}

const RequestBar = ({ tab, updateTab }: Props) => {
  // const { mutateAsync, isPending } = useRunRequest(tab?.requestId!);

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
    <div className="flex w-full flex-row items-center justify-between rounded-md bg-zinc-900 px-2 py-2">
      <div className="flex flex-1 flex-row items-center gap-2">
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
            className={`w-24 font-semibold ${
              requestColorMap[tab.method as REST_METHOD] || "text-zinc-400"
            }`}
          >
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value={REST_METHOD.GET} className="text-green-500">
                GET
              </SelectItem>

              <SelectItem value={REST_METHOD.POST} className="text-blue-500">
                POST
              </SelectItem>

              <SelectItem value={REST_METHOD.PUT} className="text-yellow-500">
                PUT
              </SelectItem>

              <SelectItem value={REST_METHOD.PATCH} className="text-orange-500">
                PATCH
              </SelectItem>

              <SelectItem value={REST_METHOD.DELETE} className="text-red-500">
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
          placeholder="Enter URL"
          className="flex-1 border-zinc-700 bg-zinc-950 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-indigo-500"
        />
      </div>

      {/* Send Button */}
      <Button
        type="button"
        onClick={onSendRequest}
        // disabled={isPending || !tab.url?.trim()}
        className="ml-2 bg-indigo-500 font-bold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {/* {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 size-4" />
            Send
          </>
        )} */}
      </Button>
    </div>
  );
};

export default RequestBar;
