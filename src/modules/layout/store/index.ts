import { create } from 'zustand'

type Workspace = {
    id: string
    name: string
}

type WorkspaceStore = {
    selectedWorkspace: Workspace | null;
    setSelectedWorkspace: (workspace: Workspace | null) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
    selectedWorkspace: null,
    setSelectedWorkspace: (workspace) => {
        console.log('💾 Setting workspace in store:', workspace?.name, workspace?.id);
        set({ selectedWorkspace: workspace });
    }
}))