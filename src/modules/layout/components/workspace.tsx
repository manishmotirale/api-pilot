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
          className="
            h-9 gap-2
            border-indigo-500/30
            bg-indigo-500/5
            text-indigo-400
            hover:bg-indigo-500/10
            hover:text-indigo-300
          "
        >
          <Plus className="size-4" />
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
      <Hint label="Change workspace">
        <Select
          value={selectedWorkspace?.id}
          onValueChange={(id) => {
            const workspace = workspaces.find((ws) => ws.id === id);

            if (workspace) {
              setSelectedWorkspace(workspace);
            }
          }}
        >
          <SelectTrigger
            className="
              h-9 w-[210px]
              border-zinc-800
              bg-zinc-900/60
              px-2.5
              shadow-sm
              transition-all

              hover:border-indigo-500/40
              hover:bg-zinc-900

              focus:ring-1
              focus:ring-indigo-500/40

              dark:border-zinc-800
              dark:bg-zinc-900/60
            "
          >
            <div className="flex min-w-0 items-center gap-2">
              {/* Workspace Icon */}
              <div
                className="
                  flex size-6 shrink-0
                  items-center justify-center
                  rounded-md
                  bg-indigo-500/10
                  ring-1 ring-indigo-500/20
                "
              >
                <FolderKanban className="size-3.5 text-indigo-400" />
              </div>

              {/* Workspace Name */}
              <SelectValue placeholder="Select workspace" />
            </div>
          </SelectTrigger>

          <SelectContent
            align="start"
            className="
              w-[240px]
              border-zinc-800
              bg-zinc-950
              p-1
            "
          >
            {/* Header */}
            <div className="px-2.5 py-2">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Workspaces
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
                    focus:bg-indigo-500/10
                    focus:text-foreground
                  "
                >
                  <div className="flex w-full items-center gap-2">
                    <div
                      className={`
                        flex size-7 shrink-0
                        items-center justify-center
                        rounded-md
                        ${
                          isSelected
                            ? "bg-indigo-500/15 text-indigo-400"
                            : "bg-zinc-800 text-zinc-400"
                        }
                      `}
                    >
                      <FolderKanban className="size-3.5" />
                    </div>

                    <span className="max-w-[150px] truncate text-sm">
                      {ws.name}
                    </span>

                    {isSelected && (
                      <Check className="ml-auto size-4 text-indigo-400" />
                    )}
                  </div>
                </SelectItem>
              );
            })}

            <Separator className="my-1 bg-zinc-800" />

            {/* Create Workspace */}
            <div className="flex items-center justify-between px-2 py-2">
              <div>
                <p className="text-xs font-medium text-zinc-300">
                  Need another workspace?
                </p>
                <p className="text-[10px] text-zinc-500">Create a new one</p>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsModalOpen(true)}
                className="
                  size-8
                  text-indigo-400
                  hover:bg-indigo-500/10
                  hover:text-indigo-300
                "
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </SelectContent>
        </Select>
      </Hint>

      <CreateWorkspace
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default WorkSpace;
