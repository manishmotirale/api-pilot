"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Loader2 } from "lucide-react";
import { useWorkspaceStore } from "@/modules/layout/store";
import RequestPlayground from "@/modules/request/components/request-playground";
import TabbedSidebar from "@/modules/workspace/components/sidebar";
import { useGetWorkspace } from "@/modules/workspace/hooks/workspace";

const Page = () => {
  const { selectedWorkspace } = useWorkspaceStore();

  const workspaceId = selectedWorkspace?.id;

  const {
    data: currentWorkspace,
    isLoading,
    isError,
  } = useGetWorkspace(workspaceId!);

  // ---------------- Loading ----------------
  if (!workspaceId || isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="absolute size-10 rounded-full border border-indigo-500/20" />

            <Loader2 className="size-6 animate-spin text-indigo-500" />
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Loading workspace
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Preparing your API environment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- Error ----------------
  if (isError || !currentWorkspace) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Workspace not found
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Please select another workspace and try again.
          </p>
        </div>
      </div>
    );
  }

  // ---------- WorkSpace --------
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      {/* Request Playground */}
      <ResizablePanel defaultSize={65} minSize={40} className="min-w-0">
        <RequestPlayground />
      </ResizablePanel>

      {/* Resize Handle */}
      <ResizableHandle
        withHandle
        className="bg-border/50 transition-colors hover:bg-indigo-500/50"
      />

      {/* Workspace Sidebar */}
      <ResizablePanel
        defaultSize={35}
        minSize={25}
        maxSize={40}
        className="min-w-0"
      >
        <div className="h-full w-full overflow-hidden">
          <TabbedSidebar currentWorkspace={currentWorkspace} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Page;
