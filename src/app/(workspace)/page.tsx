"use client";

import { Loader2 } from "lucide-react";
import PlaygroundPage from "@/modules/request/components/request-playground";
import TabbedSidebar from "@/modules/workspace/components/sidebar";
import { useGetWorkspace } from "@/modules/workspace/hooks/workspace";
import { useWorkspace } from "./workspace-context";

const Page = () => {
  // Get workspace from context (passed from layout)
  let workspace;
  
  try {
    workspace = useWorkspace();
  } catch (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#05070b]">
        <div className="text-center">
          <p className="text-sm font-medium text-white">
            Workspace Context Error
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  const {
    data: currentWorkspace,
    isLoading,
    isError,
  } = useGetWorkspace(workspace.id);

  // Error state
  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#05070b]">
        <div className="text-center">
          <p className="text-sm font-medium text-white">
            Workspace not found
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Please select another workspace and try again.
          </p>
        </div>
      </div>
    );
  }

  // Simple flex layout - NO RESIZABLE
  return (
    <div className="h-full w-full flex bg-[#05070b]">
      {/* Left Side - Request Playground */}
      <div className="flex-1 h-full overflow-auto">
        <PlaygroundPage />
      </div>

      {/* Right Side - Collections Sidebar */}
      <div className="w-96 h-full overflow-hidden bg-zinc-950/50 backdrop-blur-sm border-l border-white/5">
        {isLoading || !currentWorkspace ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
          </div>
        ) : (
          <TabbedSidebar currentWorkspace={currentWorkspace} />
        )}
      </div>
    </div>
  );
};

export default Page;
