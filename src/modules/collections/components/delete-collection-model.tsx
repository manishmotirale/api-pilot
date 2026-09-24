"use client";

import Modal from "@/components/ui/modal";
import React from "react";
import { toast } from "sonner";
import { useDeleteCollection } from "../hooks/collection";

interface DeleteCollectionModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  collectionId: string;
}

const DeleteCollectionModal = ({
  isModalOpen,
  setIsModalOpen,
  collectionId,
}: DeleteCollectionModalProps) => {
  const { mutateAsync, isPending } = useDeleteCollection(collectionId);

  const handleDelete = async () => {
    if (isPending) return;

    try {
      await mutateAsync();

      toast.success("Collection deleted successfully", {
        description: "The collection and its requests have been removed.",
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to delete collection:", error);

      toast.error("Failed to delete collection", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const handleClose = () => {
    if (isPending) return;

    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Delete Collection"
      description="Are you sure you want to delete this collection?"
      isOpen={isModalOpen}
      onClose={handleClose}
      onSubmit={handleDelete}
      submitText={isPending ? "Deleting..." : "Delete Collection"}
      submitVariant="destructive"
    >
      <div className="space-y-4">
        {/* Warning */}
        <div
          className="
            rounded-lg
            border border-red-500/20
            bg-red-500/5
            p-4
          "
        >
          <div className="flex gap-3">
            <div
              className="
                flex size-8 shrink-0
                items-center justify-center
                rounded-full
                bg-red-500/10
              "
            >
              <span className="text-sm text-red-400">!</span>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-red-400">
                This action cannot be undone
              </p>

              <p className="text-xs leading-relaxed text-zinc-500">
                Deleting this collection will permanently remove the
                collection and all requests inside it.
              </p>
            </div>
          </div>
        </div>

        {/* Additional information */}
        <p className="text-xs leading-relaxed text-zinc-600">
          Make sure you no longer need these API requests before continuing.
        </p>
      </div>
    </Modal>
  );
};

export default DeleteCollectionModal;