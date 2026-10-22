"use client";

import { useEffect } from "react";
import { useWorkspaceStore } from "@/modules/layout/store";

interface WorkspaceInitializerProps {
  initialWorkspace: {
    id: string;
    name: string;
  };
}

export function WorkspaceInitializer({ initialWorkspace }: WorkspaceInitializerProps) {
  const setSelectedWorkspace = useWorkspaceStore((state) => state.setSelectedWorkspace);

  useEffect(() => {
    console.log('🔧 WorkspaceInitializer effect - setting workspace:', initialWorkspace.name);
    setSelectedWorkspace(initialWorkspace);
  }, [initialWorkspace, setSelectedWorkspace]);

  return null;
}
