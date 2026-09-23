import React from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { currentUser } from "@/modules/authentication/actions";
import Header from "@/modules/layout/components/header";
import { initializeWorkspace } from "@/modules/workspace/actions";
import TabbedLeftPanel from "@/modules/workspace/components/tabbed-left-panel";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const [user, workspace] = await Promise.all([
    currentUser(),
    initializeWorkspace(),
  ]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col overflow-hidden bg-[#05070b] text-zinc-100">
        
        <header className="relative z-50 h-16 shrink-0 border-b border-white/[0.07] bg-[#080b11]/95 backdrop-blur-xl">
          <Header user={user!} workspace={workspace.workspace!} />
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
    </SidebarProvider>
  );
};

export default RootLayout;
