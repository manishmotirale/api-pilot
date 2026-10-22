"use client";

import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hint";
import { Check, ChevronDown, FolderKanban, Loader2, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

import CreateWorkspace from "./create-workspace";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";
import { useWorkspaces } from "@/modules/workspace/hooks/workspace";
import { useWorkspaceStore } from "../store";

const WorkSpace = () => {
  const { data: workspaces, isLoading } = useWorkspaces();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { selectedWorkspace, setSelectedWorkspace } = useWorkspaceStore();

  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !selectedWorkspace) {
      setSelectedWorkspace(workspaces[0]);
    }
  }, [workspaces, selectedWorkspace, setSelectedWorkspace]);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex h-9 items-center justify-center px-2">
        <Loader2 className="size-4 animate-spin text-indigo-400" />
      </div>
    );
  }

  // Empty State
  if (!workspaces || workspaces.length === 0) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="group h-9 gap-2 border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 transition-all hover:border-cyan-500/50 hover:from-cyan-500/20 hover:to-blue-500/20 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/20"
        >
          <Plus className="size-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-90" />
          Create Workspace
        </Button>

        <CreateWorkspace
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </>
    );
  }

  return (
    <>
      <Select
        value={selectedWorkspace?.id || ""}
        onValueChange={(id) => {
          const workspace = workspaces.find((ws) => ws.id === id);
          if (workspace) {
            setSelectedWorkspace(workspace);
          }
        }}
      >
          <SelectTrigger
            className="
              h-9 min-w-[180px] max-w-[220px]
              border-zinc-800
              bg-zinc-900/60
              px-2.5
              shadow-sm
              transition-all

              hover:border-cyan-500/40
              hover:bg-zinc-900

              focus:ring-1
              focus:ring-cyan-500/40
            "
          >
            <div className="flex min-w-0 items-center gap-2">
              {/* Workspace Icon */}
              <div
                className="
                  flex size-6 shrink-0
                  items-center justify-center
                  rounded-md
                  bg-gradient-to-br from-cyan-500/20 to-blue-500/20
                  ring-1 ring-cyan-400/30
                  transition-all
                  duration-300
                "
              >
                <FolderKanban className="size-3.5 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
              </div>

              {/* Workspace Name - Display actual name */}
              <span className="truncate text-sm font-medium text-zinc-200">
                {selectedWorkspace?.name || "Select workspace"}
              </span>
            </div>
          </SelectTrigger>

          <SelectContent
            align="start"
            className="
              w-[240px]
              border-zinc-800
              bg-zinc-950/95
              backdrop-blur-xl
              p-1
            "
          >
            {/* Header */}
            <div className="px-2.5 py-2">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Your Workspaces
              </p>
            </div>

            {/* Workspace List */}
            {workspaces.map((ws) => {
              const isSelected = selectedWorkspace?.id === ws.id;

              return (
                <SelectItem
                  key={ws.id}
                  value={ws.id}
                  className="
                    cursor-pointer
                    rounded-md
                    py-2
                    transition-all
                    hover:bg-gradient-to-r
                    hover:from-cyan-500/10
                    hover:to-blue-500/10
                    focus:bg-gradient-to-r
                    focus:from-cyan-500/10
                    focus:to-blue-500/10
                  "
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <div
                        className={`
                          flex size-7 shrink-0
                          items-center justify-center
                          rounded-md
                          transition-all duration-300
                          ${
                            isSelected
                              ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 ring-1 ring-cyan-400/30 scale-105"
                              : "bg-zinc-800 text-zinc-400"
                          }
                        `}
                      >
                        <FolderKanban className={`size-3.5 transition-all ${isSelected ? 'scale-110 rotate-3' : ''}`} />
                      </div>

                      <span className="truncate text-sm font-medium">
                        {ws.name}
                      </span>
                    </div>

                    {/* Single check mark for selected workspace */}
                    {isSelected && (
                      <Check className="size-4 shrink-0 text-cyan-400 animate-in fade-in duration-200" />
                    )}
                  </div>
                </SelectItem>
              );
            })}

            <Separator className="my-1 bg-zinc-800" />

            {/* Create Workspace */}
            <div className="flex items-center justify-between gap-2 px-2 py-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-zinc-300">
                  Need another workspace?
                </p>
                <p className="text-[10px] text-zinc-500">Create a new one</p>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsModalOpen(true)}
                className="group size-8 shrink-0 text-cyan-400 transition-all hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-blue-500/10 hover:text-cyan-300"
              >
                <Plus className="size-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-90" />
              </Button>
            </div>
          </SelectContent>
        </Select>

      <CreateWorkspace
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default WorkSpace;
