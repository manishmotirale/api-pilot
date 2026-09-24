"use client";

import Modal from "@/components/ui/modal";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useEditCollection } from "../hooks/collection";

interface EditCollectionModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  collectionId: string;
  initialName: string;
}

const EditCollectionModal = ({
  isModalOpen,
  setIsModalOpen,
  collectionId,
  initialName,
}: EditCollectionModalProps) => {
  const [name, setName] = useState(initialName);

  const { mutateAsync, isPending } = useEditCollection(
    collectionId,
    name.trim(),
  );

  // Keep the input synchronized with the selected collection
  useEffect(() => {
    if (isModalOpen) {
      setName(initialName);
    }
  }, [initialName, isModalOpen]);

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

    if (collectionName === initialName.trim()) {
      toast.info("No changes were made");
      return;
    }

    try {
      await mutateAsync(collectionName);

      toast.success("Collection updated successfully", {
        description: `"${collectionName}" has been updated.`,
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update collection:", error);

      toast.error("Failed to update collection", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const handleClose = () => {
    if (isPending) return;

    setName(initialName);
    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Edit Collection"
      description="Update the name of your collection."
      isOpen={isModalOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitText={isPending ? "Saving..." : "Save Changes"}
      submitVariant="default"
    >
      <div className="space-y-5">
        {/* Collection Name */}
        <div className="space-y-2">
          <label
            htmlFor="edit-collection-name"
            className="text-sm font-medium text-foreground"
          >
            Collection name
          </label>

          <input
            id="edit-collection-name"
            type="text"
            value={name}
            disabled={isPending}
            autoFocus
            maxLength={50}
            placeholder="e.g. Authentication API"
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

          {/* Character Count */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Choose a clear name for your API collection.
            </p>

            <span className="text-xs text-zinc-600">{name.length}/50</span>
          </div>
        </div>

        {/* Unsaved Change Indicator */}
        {name.trim() !== initialName.trim() && (
          <div
            className="
              rounded-md
              border
              border-indigo-500/20
              bg-indigo-500/5
              px-3
              py-2
            "
          >
            <p className="text-xs text-indigo-400">You have unsaved changes.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EditCollectionModal;
