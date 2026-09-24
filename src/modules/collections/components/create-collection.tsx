"use client";

import Modal from "@/components/ui/modal";
import { useCreateCollection } from "../hooks/collection";
import React, { useState } from "react";
import { toast } from "sonner";

interface CreateCollectionProps {
  workspaceId: string;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const CreateCollection = ({
  workspaceId,
  isModalOpen,
  setIsModalOpen,
}: CreateCollectionProps) => {
  const [name, setName] = useState("");

  const { mutateAsync, isPending } = useCreateCollection(workspaceId, name);

  const handleSubmit = async () => {
    const collectionName = name.trim();

    if (!collectionName) {
      toast.error("Collection name is required");
      return;
    }

    if (collectionName.length < 3) {
      toast.error("Collection name must be at least 3 characters");
      return;
    }

    try {
      await mutateAsync(collectionName);

      toast.success("Collection created successfully", {
        description: `"${collectionName}" is ready for your API requests.`,
      });

      setName("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create collection:", error);

      toast.error("Failed to create collection", {
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
      title="Create Collection"
      description="Create a collection to organize and manage your API requests."
      isOpen={isModalOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitText={isPending ? "Creating..." : "Create Collection"}
      submitVariant="default"
    >
      <div className="space-y-5">
        {/* Collection Name */}
        <div className="space-y-2">
          <label
            htmlFor="collection-name"
            className="text-sm font-medium text-foreground"
          >
            Collection name
          </label>

          <input
            id="collection-name"
            type="text"
            value={name}
            placeholder="e.g. Authentication API"
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
              placeholder:text-zinc-600
              transition-all

              focus:border-indigo-500/50
              focus:ring-2
              focus:ring-indigo-500/20

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          />

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Use a name that describes the API group.
            </p>

            <span className="text-xs text-zinc-600">{name.length}/50</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateCollection;
