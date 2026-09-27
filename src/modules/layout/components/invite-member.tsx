"use client";

import { useState } from "react";
import { Copy, Link as LinkIcon, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Hint } from "@/components/ui/hint";

import { useWorkspaceStore } from "../store";
import {
  useGenerateWorkspaceInvite,
  useGetWorkspaceMemebers,
} from "@/modules/invites/hooks/invite";

const InviteMember = () => {
  const [inviteLink, setInviteLink] = useState("");

  const { selectedWorkspace } = useWorkspaceStore();

  const workspaceId = selectedWorkspace?.id || "";

  const { mutateAsync, isPending } = useGenerateWorkspaceInvite(workspaceId);

  const { data: workspaceMembers, isLoading } =
    useGetWorkspaceMemebers(workspaceId);

  const generateInviteLink = async () => {
    if (!workspaceId) {
      toast.error("Please select a workspace first");
      return;
    }

    try {
      const response = await mutateAsync();

      setInviteLink(response);

      toast.success("Invite link generated!");
    } catch (error) {
      console.error("Failed to generate invite link:", error);

      toast.error("Failed to generate invite link");
    }
  };

  const copyToClipboard = async () => {
    if (!inviteLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteLink);

      toast.success("Invite link copied to clipboard");
    } catch (error) {
      console.error("Failed to copy invite link:", error);

      toast.error("Failed to copy invite link");
    }
  };

  return (
    <DropdownMenu>
      <Hint label="Invite Member">
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 hover:text-emerald-300"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
      </Hint>

      <DropdownMenuContent
        align="end"
        className="w-80 rounded-xl border-zinc-800 bg-zinc-950 p-0"
      >
        <div className="p-4">
          {/* Header */}
          <div className="mb-3">
            <DropdownMenuLabel className="px-0 text-sm font-semibold text-zinc-200">
              Invite to{" "}
              <span className="text-emerald-400">
                {selectedWorkspace?.name || "Workspace"}
              </span>
            </DropdownMenuLabel>
          </div>

          <DropdownMenuSeparator className="bg-zinc-800" />

          {/* Members */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Members</span>

              {workspaceMembers && (
                <span className="text-[10px] text-zinc-600">
                  {workspaceMembers.length}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center gap-2 py-2">
                <div className="h-6 w-6 animate-pulse rounded-full bg-zinc-800" />
                <div className="h-3 w-24 animate-pulse rounded bg-zinc-800" />
              </div>
            ) : workspaceMembers && workspaceMembers.length > 0 ? (
              <div className="flex -space-x-2 py-1">
                {workspaceMembers.map((member: any) => {
                  const name = member.user?.name || "Unknown User";

                  const image = member.user?.image || "";

                  const initial = name.charAt(0).toUpperCase();

                  return (
                    <Hint key={member.id} label={name}>
                      <Avatar className="h-8 w-8 border-2 border-zinc-950">
                        <AvatarImage src={image} alt={name} />

                        <AvatarFallback className="bg-zinc-800 text-xs text-zinc-300">
                          {initial}
                        </AvatarFallback>
                      </Avatar>
                    </Hint>
                  );
                })}
              </div>
            ) : (
              <p className="py-2 text-xs text-zinc-600">No members found</p>
            )}
          </div>

          {/* Invite Link */}
          <div className="mt-4">
            <label className="mb-2 block text-xs font-medium text-zinc-400">
              Invite Link
            </label>

            <div className="flex items-center gap-2">
              <Input
                value={inviteLink}
                placeholder="Generate an invite link..."
                readOnly
                className="h-9 border-zinc-800 bg-zinc-900 text-xs text-zinc-300 placeholder:text-zinc-600"
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                disabled={!inviteLink}
                title="Copy invite link"
                className="h-9 w-9 shrink-0 border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Generate */}
          <Button
            type="button"
            className="mt-4 w-full bg-emerald-500 font-medium text-white hover:bg-emerald-600"
            onClick={generateInviteLink}
            disabled={!workspaceId || isPending}
          >
            <LinkIcon className="mr-2 h-4 w-4" />

            {isPending ? "Generating..." : "Generate Invite Link"}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InviteMember;
