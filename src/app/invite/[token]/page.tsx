"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAcceptWorkspaceInvite } from "@/modules/invites/hooks/invite";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { getInviteDetails } from "@/modules/invites/actions";
import { authClient } from "@/lib/auth-client";

type InviteDetails = {
  workspace: {
    id: string;
    name: string;
    description: string | null;
  };
  createdBy: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  expiresAt: Date | null;
};

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState<"loading" | "idle" | "accepting" | "success" | "error">("loading");
  const [inviteDetails, setInviteDetails] = useState<InviteDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  const { mutateAsync: acceptInvite, isPending } = useAcceptWorkspaceInvite();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        if (!session.data) {
          // Not authenticated, redirect to sign-in
          const returnUrl = encodeURIComponent(`/invite/${token}`);
          router.push(`/sign-in?returnUrl=${returnUrl}`);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          if (token) {
            loadInviteDetails();
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        const returnUrl = encodeURIComponent(`/invite/${token}`);
        router.push(`/sign-in?returnUrl=${returnUrl}`);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [token, router]);

  const loadInviteDetails = async () => {
    try {
      setStatus("loading");
      const details = await getInviteDetails(token);
      setInviteDetails(details as any);
      setStatus("idle");
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "Failed to load invite details");
      toast.error(error.message || "Failed to load invite details");
    }
  };

  const handleAcceptInvite = async () => {
    if (!token) {
      toast.error("Invalid invite link");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please sign in to accept this invite");
      const returnUrl = encodeURIComponent(`/invite/${token}`);
      router.push(`/sign-in?returnUrl=${returnUrl}`);
      return;
    }

    try {
      setStatus("accepting");
      const result = await acceptInvite(token);
      setStatus("success");
      toast.success(`Successfully joined ${result.workspace.name}!`);

      // Redirect to workspace after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "Failed to accept invite");
      console.error("Failed to accept invite:", error);
      toast.error(error.message || "Failed to accept invite. The link may be invalid or expired.");
    }
  };

  // Loading auth check
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#05070b] via-[#080b11] to-[#0b0f17] p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-sm text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - will redirect
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#05070b] via-[#080b11] to-[#0b0f17] p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-sm text-zinc-400">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#05070b] via-[#080b11] to-[#0b0f17] p-4">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-64 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-64 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="border-b border-white/10 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-purple-500/10 shadow-lg shadow-cyan-500/20">
              <Image
                src="/ApiPilot.gif"
                alt="API Pilot"
                width={40}
                height={40}
                unoptimized
                className="transition-transform duration-300 hover:scale-110"
              />
            </div>

            <h1 className="mb-2 text-2xl font-bold">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                Join
              </span>{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                API Pilot
              </span>
            </h1>

            <p className="text-sm text-zinc-400">
              You've been invited to join a workspace
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {status === "loading" && (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                <p className="text-sm text-zinc-400">Loading invite details...</p>
              </div>
            )}

            {status === "idle" && inviteDetails && (
              <div className="space-y-6">
                {/* Workspace Info */}
                <div className="rounded-xl border border-white/10 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 ring-1 ring-cyan-400/30">
                      <Users className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {inviteDetails.workspace.name}
                      </h3>
                      {inviteDetails.workspace.description && (
                        <p className="text-xs text-zinc-400 mt-1">
                          {inviteDetails.workspace.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Invited By */}
                <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Invited by</p>
                  <div className="flex items-center gap-3">
                    {inviteDetails.createdBy.image ? (
                      <img
                        src={inviteDetails.createdBy.image}
                        alt={inviteDetails.createdBy.name}
                        className="h-10 w-10 rounded-full border-2 border-cyan-400/30"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-sm font-semibold text-cyan-400">
                        {inviteDetails.createdBy.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {inviteDetails.createdBy.name}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">
                        {inviteDetails.createdBy.email}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleAcceptInvite}
                  disabled={isPending}
                  className="group relative w-full overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 font-semibold text-white transition-all hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 hover:shadow-lg hover:shadow-cyan-500/30"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                      Accept Invitation
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-zinc-500">
                  By accepting, you'll get access to shared collections, requests, and environments
                </p>
              </div>
            )}

            {status === "accepting" && (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute h-16 w-16 animate-ping rounded-full bg-cyan-500/20" />
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">Joining workspace...</p>
                  <p className="text-sm text-zinc-400">Please wait a moment</p>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 ring-4 ring-green-500/30">
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">Success!</p>
                  <p className="text-sm text-zinc-400">Redirecting to workspace...</p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20 ring-4 ring-red-500/30">
                    <XCircle className="h-8 w-8 text-red-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-white">Invite Failed</p>
                    <p className="text-sm text-zinc-400">
                      {errorMessage || "The invitation link is invalid or has expired"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/")}
                    className="flex-1 border-zinc-800 hover:bg-zinc-900"
                  >
                    Go to Home
                  </Button>
                  <Button
                    onClick={loadInviteDetails}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-zinc-600">
          Need help?{" "}
          <a
            href="mailto:support@apipilot.com"
            className="text-cyan-400 hover:text-cyan-300 hover:underline"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
