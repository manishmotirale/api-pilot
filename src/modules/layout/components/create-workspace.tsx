"use client";

import Modal from "@/components/ui/modal";
import { useCreateWorkspace } from "@/modules/workspace/hooks/workspace";
import React, { useState } from "react";
import { toast } from "sonner";

const CreateWorkspace = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}) => {
  const [name, setName] = useState("");

  const { mutateAsync, isPending } = useCreateWorkspace();

  const handleSubmit = async () => {
    const workspaceName = name.trim();

    if (!workspaceName) {
      toast.error("Workspace name is required");
      return;
    }

    if (workspaceName.length < 3) {
      toast.error("Workspace name must be at least 3 characters");
      return;
    }

    try {
      await mutateAsync(workspaceName);

      toast.success("Workspace created successfully", {
        description: `"${workspaceName}" is ready to use.`,
      });

      setName("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create workspace:", error);

      toast.error("Failed to create workspace", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const handleClose = () => {
    if (isPending) return;

    setName("");
    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Create Workspace"
      description="Create a workspace to organize your API requests, collections, and environments."
      isOpen={isModalOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitText={isPending ? "Creating..." : "Create Workspace"}
      submitVariant="default"
    >
      <div className="space-y-5">
        {/* Workspace Name */}
        <div className="space-y-2">
          <label
            htmlFor="workspace-name"
            className="text-sm font-medium text-foreground"
          >
            Workspace name
          </label>

          <input
            id="workspace-name"
            type="text"
            placeholder="e.g. My API Projects"
            value={name}
            disabled={isPending}
            autoFocus
            maxLength={50}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isPending) {
                handleSubmit();
              }
            }}
            className="
              h-10
              w-full
              rounded-md
              border
              border-zinc-800
              bg-zinc-950
              px-3
              text-sm
              text-foreground
              outline-none
              placeholder:text-zinc-500

              transition-colors

              focus:border-indigo-500
              focus:ring-2
              focus:ring-indigo-500/20

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          />

          <div className="flex justify-between">
            <p className="text-xs text-muted-foreground">
              Give your workspace a recognizable name.
            </p>

            <span className="text-xs text-zinc-500">{name.length}/50</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateWorkspace;
