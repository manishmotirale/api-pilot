"use client";

import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Folder, Search, Check, Loader2, ChevronRight } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useAddRequestToCollection } from "@/modules/request/hooks/request";
import { useWorkspaceStore } from "@/modules/layout/store";
import { REST_METHOD } from "../../../../prisma/generated/enums";
import { useCollections } from "../hooks/collection";
interface RequestData {
  name: string;
  method: REST_METHOD;
  url: string;
}

interface SaveRequestToCollectionModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  requestData?: RequestData;
  initialName?: string;
  collectionId?: string;
}

const SaveRequestToCollectionModal = ({
  isModalOpen,
  setIsModalOpen,
  requestData = {
    name: "Untitled",
    url: "https://echo.hoppscotch.io",
    method: REST_METHOD.GET,
  },
  initialName = "Untitled",
  collectionId,
}: SaveRequestToCollectionModalProps) => {
  const [requestName, setRequestName] = useState(initialName);
  const [selectedCollectionId, setSelectedCollectionId] = useState(
    collectionId || "",
  );
  const [searchTerm, setSearchTerm] = useState("");

  const { selectedWorkspace } = useWorkspaceStore();

  const workspaceId = selectedWorkspace?.id;

  const {
    data: collections,
    isLoading,
    isError,
  } = useCollections(workspaceId!);

  const { mutateAsync, isPending } =
    useAddRequestToCollection(selectedCollectionId);

  // Reset state when modal opens
  useEffect(() => {
    if (!isModalOpen) return;

    setRequestName(requestData.name || initialName);
    setSelectedCollectionId(collectionId || "");
    setSearchTerm("");
  }, [isModalOpen, requestData.name, initialName, collectionId]);

  // Set default collection when modal opens
  useEffect(() => {
    if (!isModalOpen) return;

    if (collectionId) return;

    if (!selectedCollectionId && collections && collections.length > 0) {
      setSelectedCollectionId(collections[0].id);
    }
  }, [isModalOpen, collections, collectionId, selectedCollectionId]);

  // Method colors
  const requestColorMap: Record<REST_METHOD, string> = {
    [REST_METHOD.GET]: "text-green-400",
    [REST_METHOD.POST]: "text-blue-400",
    [REST_METHOD.PUT]: "text-yellow-400",
    [REST_METHOD.DELETE]: "text-red-400",
    [REST_METHOD.PATCH]: "text-orange-400",
  };

  // Filter collections
  const filteredCollections = useMemo(() => {
    if (!collections) return [];

    const query = searchTerm.trim().toLowerCase();

    if (!query) return collections;

    return collections.filter((collection) =>
      collection.name.toLowerCase().includes(query),
    );
  }, [collections, searchTerm]);

  // Selected collection
  const selectedCollection = collections?.find(
    (collection) => collection.id === selectedCollectionId,
  );

  // Submit request to collection
  const handleSubmit = async () => {
    const trimmedName = requestName.trim();

    if (!trimmedName) {
      toast.error("Request name is required");
      return;
    }

    if (!workspaceId) {
      toast.error("No workspace selected");
      return;
    }

    if (!selectedCollectionId) {
      toast.error("Please select a collection");
      return;
    }

    try {
      await mutateAsync({
        url: requestData.url.trim(),
        method: requestData.method,
        name: trimmedName,
      });

      toast.success("Request saved successfully", {
        description: selectedCollection
          ? `Saved to "${selectedCollection.name}".`
          : "Your request has been added to the collection.",
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save request to collection:", error);

      toast.error("Failed to save request", {
        description: "Something went wrong while saving the request.",
      });
    }
  };

  // Close modal
  const handleClose = () => {
    if (isPending) return;

    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Save Request"
      description="Choose a collection where you want to save this request."
      isOpen={isModalOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitText={isPending ? "Saving..." : "Save Request"}
      submitVariant="default"
    >
      <div className="space-y-5">
        // Request Name
        <div className="space-y-2">
          <label
            htmlFor="request-name"
            className="text-sm font-medium text-zinc-200"
          >
            Request name
          </label>

          <div className="relative">
            <input
              id="request-name"
              type="text"
              value={requestName}
              disabled={isPending}
              autoFocus
              maxLength={100}
              placeholder="e.g. Get User Profile"
              onChange={(e) => setRequestName(e.target.value)}
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
                pr-20
                text-sm
                text-zinc-100
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

            {/* HTTP Method */}

            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <span
                className={`
                  rounded
                  bg-zinc-900
                  px-2
                  py-1
                  text-[10px]
                  font-bold
                  ${requestColorMap[requestData.method]}
                `}
              >
                {requestData.method}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <p className="text-[11px] text-zinc-600">
              Give your request a recognizable name.
            </p>

            <span className="text-[11px] text-zinc-700">
              {requestName.length}/100
            </span>
          </div>
        </div>
        // Collection Selection
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-200">
            Save to collection
          </label>
          {/* Breadcrumb */}
          <div
            className="
              flex
              items-center
              gap-1.5
              text-xs
            "
          >
            <span className="max-w-[150px] truncate text-zinc-500">
              {selectedWorkspace?.name || "Workspace"}
            </span>

            <ChevronRight className="size-3 text-zinc-700" />

            <span className="text-zinc-300">Collections</span>
          </div>
          // Search Input
          <div className="relative">
            <Search
              className="
                absolute
                left-3
                top-1/2
                size-3.5
                -translate-y-1/2
                text-zinc-600
              "
            />

            <input
              type="text"
              value={searchTerm}
              disabled={isPending}
              placeholder="Search collections..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                h-9
                w-full
                rounded-md
                border
                border-zinc-800
                bg-zinc-950
                pl-9
                pr-3
                text-xs
                text-zinc-100
                outline-none
                placeholder:text-zinc-600

                focus:border-indigo-500/50
                focus:ring-1
                focus:ring-indigo-500/20
              "
            />
          </div>
          // Collection List
          <div
            className="
              max-h-48
              space-y-1
              overflow-y-auto
              rounded-md
              border
              border-zinc-800
              bg-zinc-950/50
              p-1
            "
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="size-5 animate-spin text-indigo-400" />

                <span className="mt-2 text-xs text-zinc-600">
                  Loading collections...
                </span>
              </div>
            ) : isError ? (
              <div className="py-6 text-center">
                <p className="text-xs text-red-400">
                  Failed to load collections
                </p>

                <p className="mt-1 text-[11px] text-zinc-600">
                  Please try again.
                </p>
              </div>
            ) : filteredCollections.length === 0 ? (
              <div className="py-6 text-center">
                <Folder className="mx-auto size-5 text-zinc-700" />

                <p className="mt-2 text-xs text-zinc-500">
                  {searchTerm
                    ? "No collections found"
                    : "No collections available"}
                </p>
              </div>
            ) : (
              filteredCollections.map((collection) => {
                const isSelected = selectedCollectionId === collection.id;

                return (
                  <button
                    key={collection.id}
                    type="button"
                    disabled={isPending}
                    onClick={() => setSelectedCollectionId(collection.id)}
                    className={`
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-md
                      px-3
                      py-2.5
                      text-left
                      transition-all

                      ${
                        isSelected
                          ? "border border-indigo-500/30 bg-indigo-500/10"
                          : "border border-transparent hover:bg-zinc-900"
                      }

                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    `}
                  >
                    {/* Icon */}

                    <div
                      className={`
                        flex
                        size-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-md

                        ${isSelected ? "bg-indigo-500/15" : "bg-zinc-900"}
                      `}
                    >
                      <Folder
                        className={`
                          size-3.5
                          ${isSelected ? "text-indigo-400" : "text-zinc-500"}
                        `}
                      />
                    </div>

                    {/* Name */}

                    <span
                      className={`
                        min-w-0
                        flex-1
                        truncate
                        text-xs
                        font-medium

                        ${isSelected ? "text-indigo-300" : "text-zinc-300"}
                      `}
                    >
                      {collection.name}
                    </span>

                    {/* Selected */}

                    {isSelected && (
                      <Check className="size-4 shrink-0 text-indigo-400" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
        // Selected Collection
        {selectedCollection && (
          <div
            className="
              flex
              items-center
              gap-3
              rounded-md
              border
              border-indigo-500/20
              bg-indigo-500/5
              px-3
              py-2.5
            "
          >
            <div
              className="
                flex
                size-7
                shrink-0
                items-center
                justify-center
                rounded-md
                bg-indigo-500/10
              "
            >
              <Folder className="size-3.5 text-indigo-400" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] text-zinc-600">Saving to</p>

              <p className="truncate text-xs font-medium text-indigo-300">
                {selectedCollection.name}
              </p>
            </div>
          </div>
        )}
        // Request Preview
        <div
          className="
            rounded-md
            border
            border-zinc-800
            bg-zinc-950
            p-3
          "
        >
          <div className="flex items-start gap-2">
            <span
              className={`
                shrink-0
                rounded
                bg-zinc-900
                px-1.5
                py-0.5
                text-[9px]
                font-bold
                ${requestColorMap[requestData.method]}
              `}
            >
              {requestData.method}
            </span>

            <span
              className="
                min-w-0
                truncate
                text-[11px]
                text-zinc-500
              "
            >
              {requestData.url}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SaveRequestToCollectionModal;
