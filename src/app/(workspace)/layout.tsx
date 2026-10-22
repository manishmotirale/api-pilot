import React from "react";
import { redirect } from "next/navigation";

import { SidebarProvider } from "@/components/ui/sidebar";
import { currentUser } from "@/modules/authentication/actions";
import Header from "@/modules/layout/components/header";
import { initializeWorkspace } from "@/modules/workspace/actions";
import TabbedLeftPanel from "@/modules/workspace/components/tabbed-left-panel";
import { WorkspaceInitializer } from "./workspace-initializer";
import { WorkspaceProvider } from "./workspace-context";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const [user, workspaceResult] = await Promise.all([
    currentUser(),
    initializeWorkspace(),
  ]);

  // Redirect to sign-in if no user
  if (!user) {
    redirect('/sign-in');
  }

  // If no workspace, show error
  if (!workspaceResult.workspace) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#05070b] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Workspace Error</h1>
          <p className="mt-2 text-zinc-400">Failed to initialize workspace</p>
        </div>
      </div>
    );
  }

  const workspace = workspaceResult.workspace;

  return (
    <SidebarProvider>
      <WorkspaceProvider workspace={{ id: workspace.id, name: workspace.name }}>
        <WorkspaceInitializer initialWorkspace={{ id: workspace.id, name: workspace.name }} />
        <div className="flex h-screen w-full flex-col overflow-hidden bg-[#05070b] text-zinc-100">
          <header className="relative z-50 h-16 shrink-0 border-b border-white/[0.07] bg-[#080b11]/95 backdrop-blur-xl">
            <Header user={user} workspace={workspace} />
          </header>

          <main className="flex min-h-0 flex-1 overflow-hidden">
            <aside
              className="
                relative
                flex
                h-full
                w-[52px]
                shrink-0
                flex-col
                border-r
                border-white/[0.07]
                bg-[#080b11]
              "
            >
              {/* subtle low */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-500/[0.03] via-transparent to-transparent" />

              <div className="relative flex h-full flex-col items-center">
                <TabbedLeftPanel />
              </div>
            </aside>

            <section className="relative min-w-0 flex-1 overflow-hidden bg-[#05070b]">
              {/* subtle top gradient */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-blue-500/[0.025] to-transparent" />

              {/* content */}
              <div className="relative h-full w-full overflow-hidden">
                {children}
              </div>
            </section>
          </main>
        </div>
      </WorkspaceProvider>
    </SidebarProvider>
  );
};

export default RootLayout;
