"use client";

import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkspaceStore } from "../store";

const InviteMember = () => {
  const router = useRouter();
  const { selectedWorkspace } = useWorkspaceStore();

  const handleInviteClick = () => {
    if (!selectedWorkspace?.id) {
      toast.error("No workspace selected");
      return;
    }

    // Navigate to the invites page
    router.push(`/workspace/${selectedWorkspace.id}/invites`);
  };

  return (
    <Button
      onClick={handleInviteClick}
      className="group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 p-0 text-cyan-300 transition-all shadow-lg shadow-cyan-500/20 hover:border-cyan-400/60 hover:from-cyan-500/30 hover:via-blue-500/30 hover:to-purple-500/30 hover:shadow-xl hover:shadow-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
      title="Invite Member"
    >
      <UserPlus className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-active:scale-95" />
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
    </Button>
  );
};

export default InviteMember;
