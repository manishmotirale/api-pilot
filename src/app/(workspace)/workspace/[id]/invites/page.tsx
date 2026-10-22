"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Copy,
  Link as LinkIcon,
  Loader2,
  Mail,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useGenerateWorkspaceInvite } from "@/modules/invites/hooks/invite";
import { useWorkspaceStore } from "@/modules/layout/store";

export default function InvitesPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id as string;

  const { selectedWorkspace } = useWorkspaceStore();
  const [inviteToken, setInviteToken] = useState<string | null>(null);

  const { mutateAsync: generateInviteToken, isPending } =
    useGenerateWorkspaceInvite(workspaceId);

  const onGenerateInviteToken = async () => {
    try {
      const inviteUrl = await generateInviteToken();
      const token = inviteUrl.split("/invite/")[1];
      setInviteToken(token);
      toast.success("Invite link generated successfully!", {
        description: "You can now copy and share the link",
      });
    } catch (error) {
      toast.error("Failed to generate invite token", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  const onCopyInviteLink = () => {
    if (!inviteToken) {
      toast.error("No invite token available");
      return;
    }

    const inviteUrl = `${window.location.origin}/invite/${inviteToken}`;
    navigator.clipboard
      .writeText(inviteUrl)
      .then(() => {
        toast.success("Invite link copied!", {
          description: "Share this link with your team members",
        });
      })
      .catch(() => {
        toast.error("Failed to copy link", {
          description: "Please try again or copy manually",
        });
      });
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#05070b]">
      {/* Header */}
      <div className="border-b border-white/[0.07] bg-[#080b11]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <button
            onClick={() => router.back()}
            className="group mb-4 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Invite Team Members
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                Share access to{" "}
                <span className="font-medium text-cyan-400">
                  {selectedWorkspace?.name || "this workspace"}
                </span>
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20">
              <UserPlus className="h-6 w-6 text-cyan-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Generate Invite Card */}
              <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 backdrop-blur-xl">
                <div className="border-b border-white/[0.05] p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                      <LinkIcon className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Generate Invite Link
                      </h2>
                      <p className="text-sm text-zinc-500">
                        Create a shareable link for new members
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {!inviteToken ? (
                    <div className="space-y-4">
                      <p className="text-sm text-zinc-400">
                        Generate a secure invite link to share with people you
                        want to add to this workspace. The link will expire in 7
                        days.
                      </p>

                      <Button
                        type="button"
                        onClick={onGenerateInviteToken}
                        disabled={isPending}
                        className="group relative w-full overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 font-medium text-white transition-all hover:from-blue-600 hover:via-cyan-600 hover:to-purple-600 hover:shadow-lg hover:shadow-cyan-500/30"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <LinkIcon className="mr-2 size-4 transition-transform duration-300 group-hover:rotate-45" />
                            Generate Invite Link
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="invite-url"
                          className="text-sm font-medium text-zinc-300"
                        >
                          Your Invite Link
                        </Label>

                        <div className="flex gap-2">
                          <Input
                            id="invite-url"
                            readOnly
                            value={`${typeof window !== "undefined" ? window.location.origin : ""}/invite/${inviteToken}`}
                            className="flex-1 border-zinc-800 bg-zinc-900 font-mono text-sm text-zinc-300"
                            onClick={(e) => e.currentTarget.select()}
                          />

                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={onCopyInviteLink}
                            className="group shrink-0 border-zinc-800 bg-zinc-900 transition-all hover:border-cyan-500/50 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-blue-500/10"
                            title="Copy to clipboard"
                          >
                            <Copy className="size-4 transition-all duration-300 group-hover:scale-110" />
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
                        <div className="flex gap-3">
                          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                          <div>
                            <p className="text-sm font-medium text-cyan-300">
                              Share this link
                            </p>
                            <p className="mt-1 text-xs text-zinc-400">
                              Send this link to anyone you want to invite.
                              They'll be able to join{" "}
                              <span className="font-medium text-cyan-400">
                                {selectedWorkspace?.name}
                              </span>{" "}
                              by clicking the link.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setInviteToken(null);
                          toast.info("Generate a new invite link when ready");
                        }}
                        className="w-full border-zinc-800 hover:bg-zinc-900"
                      >
                        Generate New Link
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Card */}
              <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 p-5">
                <div className="flex gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-blue-300">
                      Security & Privacy
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                      Invite links are secure and expire after 7 days. Only
                      people with the link can join. You can generate new links
                      at any time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 backdrop-blur-xl">
                <div className="border-b border-white/[0.05] p-4">
                  <h3 className="font-semibold text-white">Workspace</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                      <Users className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">1</p>
                      <p className="text-xs text-zinc-500">Member (You)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 backdrop-blur-xl">
                <div className="border-b border-white/[0.05] p-4">
                  <h3 className="font-semibold text-white">Tips</h3>
                </div>
                <div className="space-y-3 p-4">
                  <div className="text-xs text-zinc-400">
                    <p className="font-medium text-zinc-300">
                      • Share via email
                    </p>
                    <p className="mt-1 text-zinc-500">
                      Copy the link and send it directly to team members
                    </p>
                  </div>
                  <div className="text-xs text-zinc-400">
                    <p className="font-medium text-zinc-300">
                      • Link expiration
                    </p>
                    <p className="mt-1 text-zinc-500">
                      Links expire after 7 days for security
                    </p>
                  </div>
                  <div className="text-xs text-zinc-400">
                    <p className="font-medium text-zinc-300">
                      • Generate new links
                    </p>
                    <p className="mt-1 text-zinc-500">
                      Create unlimited invite links as needed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
