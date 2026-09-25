"use client";

import {
  ChevronDown,
  ChevronRight,
  EllipsisVertical,
  Edit,
  FilePlus,
  Folder,
  Trash,
} from "lucide-react";
import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import EditCollectionModal from "./edit-collection-model";
import DeleteCollectionModal from "./delete-collection-model";
import { useGetAllRequestsFromCollection } from "@/modules/request/hooks/request";
import { useRequestPlaygroundStore } from "@/modules/request/store/useRequestStore";
import { REST_METHOD } from "../../../../prisma/generated/enums";
import SaveRequestToCollectionModal from "./add-request-modal";

interface Props {
  collection: {
    id: string;
    name: string;
    updatedAt: Date;
    workspaceId: string;
  };
}

const CollectionFolder = ({ collection }: Props) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddRequestOpen, setIsAddRequestOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: requestData,
    isPending,
    isError,
  } = useGetAllRequestsFromCollection(collection.id);

  const { openRequestTab } = useRequestPlaygroundStore();

  // Request Method Color Map
  const requestColorMap: Record<REST_METHOD, string> = {
    [REST_METHOD.GET]: "text-green-400",
    [REST_METHOD.POST]: "text-blue-400",
    [REST_METHOD.PUT]: "text-yellow-400",
    [REST_METHOD.DELETE]: "text-red-400",
    [REST_METHOD.PATCH]: "text-orange-400",
  };

  const hasRequests = !!requestData && requestData.length > 0;

  // Render
  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="w-full">
          // Collection Header
          <div
            className="
              group
              flex w-full items-center justify-between
              rounded-md px-2 py-1.5
              transition-colors
              hover:bg-zinc-900/80
            "
          >
            {/* Collection Name */}
            <CollapsibleTrigger
              className="
                flex min-w-0 flex-1
                items-center gap-2
                text-left
                outline-none
              "
            >
              {/* Expand / Collapse */}
              <div className="flex size-4 shrink-0 items-center justify-center">
                {hasRequests ? (
                  isOpen ? (
                    <ChevronDown className="size-3.5 text-zinc-500" />
                  ) : (
                    <ChevronRight className="size-3.5 text-zinc-500" />
                  )
                ) : null}
              </div>

              {/* Folder */}
              <Folder
                className="
                  size-4 shrink-0
                  text-indigo-400
                  transition-colors
                  group-hover:text-indigo-300
                "
              />

              {/* Name */}
              <span
                className="
                  min-w-0 flex-1
                  truncate
                  text-sm
                  font-medium
                  text-zinc-200
                  group-hover:text-white
                "
              >
                {collection.name}
              </span>

              {/* Request Count */}
              {hasRequests && (
                <span
                  className="
                    shrink-0
                    rounded-full
                    bg-zinc-800
                    px-1.5
                    py-0.5
                    text-[10px]
                    font-medium
                    text-zinc-500
                  "
                >
                  {requestData.length}
                </span>
              )}
            </CollapsibleTrigger>

            {/* Actions */}
            <div
              className="
                ml-2
                flex shrink-0
                items-center gap-0.5
                opacity-0
                transition-opacity
                group-hover:opacity-100
              "
            >
              {/* Add Request */}
              <button
                type="button"
                title="Add request"
                onClick={() => setIsAddRequestOpen(true)}
                className="
                  flex size-7
                  items-center justify-center
                  rounded-md
                  text-zinc-500
                  transition-colors
                  hover:bg-indigo-500/10
                  hover:text-indigo-400
                "
              >
                <FilePlus className="size-3.5" />
              </button>

              {/* More */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    title="More options"
                    className="
                      flex size-7
                      items-center justify-center
                      rounded-md
                      text-zinc-500
                      outline-none
                      transition-colors
                      hover:bg-zinc-800
                      hover:text-zinc-200
                    "
                  >
                    <EllipsisVertical className="size-3.5" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-44 border-zinc-800 bg-zinc-950"
                >
                  {/* Add Request */}
                  <DropdownMenuItem
                    onClick={() => setIsAddRequestOpen(true)}
                    className="cursor-pointer"
                  >
                    <FilePlus className="mr-2 size-4 text-green-400" />

                    <span>Add Request</span>

                    <span className="ml-auto rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">
                      ⌘R
                    </span>
                  </DropdownMenuItem>

                  {/* Edit */}
                  <DropdownMenuItem
                    onClick={() => setIsEditOpen(true)}
                    className="cursor-pointer"
                  >
                    <Edit className="mr-2 size-4 text-blue-400" />

                    <span>Edit</span>

                    <span className="ml-auto rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">
                      ⌘E
                    </span>
                  </DropdownMenuItem>

                  {/* Delete */}
                  <DropdownMenuItem
                    onClick={() => setIsDeleteOpen(true)}
                    className="
                      cursor-pointer
                      text-red-400
                      focus:bg-red-500/10
                      focus:text-red-400
                    "
                  >
                    <Trash className="mr-2 size-4" />

                    <span>Delete</span>

                    <span className="ml-auto rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">
                      ⌘D
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          // Requests
          <CollapsibleContent className="w-full">
            {isPending ? (
              <div className="ml-7 flex items-center gap-2 py-2 pl-4">
                <div
                  className="
                    size-3.5
                    animate-spin
                    rounded-full
                    border-2
                    border-zinc-700
                    border-t-indigo-400
                  "
                />

                <span className="text-xs text-zinc-600">
                  Loading requests...
                </span>
              </div>
            ) : isError ? (
              <div className="ml-7 py-2 pl-4">
                <span className="text-xs text-red-400">
                  Failed to load requests
                </span>
              </div>
            ) : hasRequests ? (
              <div
                className="
                  ml-7
                  border-l
                  border-zinc-800
                  pl-3
                "
              >
                <div className="space-y-0.5">
                  {requestData.map((request) => {
                    const method = request.method as REST_METHOD;

                    return (
                      <div
                        key={request.id}
                        onClick={() => openRequestTab(request)}
                        className="
                          group/request
                          flex
                          cursor-pointer
                          items-center
                          gap-2
                          rounded-md
                          px-2
                          py-1.5
                          transition-colors
                          hover:bg-zinc-900
                        "
                      >
                        {/* Method */}
                        <span
                          className={`
                            min-w-[42px]
                            rounded
                            bg-zinc-900
                            px-1.5
                            py-0.5
                            text-center
                            text-[9px]
                            font-bold
                            ${requestColorMap[method] ?? "text-zinc-400"}
                          `}
                        >
                          {request.method}
                        </span>

                        {/* Request Info */}
                        <div className="min-w-0 flex-1">
                          <p
                            className="
                              truncate
                              text-xs
                              font-medium
                              text-zinc-300
                              group-hover/request:text-white
                            "
                          >
                            {request.name || request.url}
                          </p>

                          {request.url && request.name && (
                            <p
                              className="
                                mt-0.5
                                truncate
                                text-[10px]
                                text-zinc-600
                              "
                            >
                              {request.url}
                            </p>
                          )}
                        </div>

                        {/* Request Actions */}
                        <div
                          className="
                            opacity-0
                            transition-opacity
                            group-hover/request:opacity-100
                          "
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className="
                                  flex size-6
                                  items-center justify-center
                                  rounded
                                  text-zinc-600
                                  hover:bg-zinc-800
                                  hover:text-zinc-300
                                "
                              >
                                <EllipsisVertical className="size-3" />
                              </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="w-32 border-zinc-800 bg-zinc-950"
                            >
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit className="mr-2 size-3.5 text-blue-400" />
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="
                                  cursor-pointer
                                  text-red-400
                                  focus:bg-red-500/10
                                  focus:text-red-400
                                "
                              >
                                <Trash className="mr-2 size-3.5" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="ml-7 py-2 pl-4">
                <span className="text-xs italic text-zinc-600">
                  No requests yet
                </span>
              </div>
            )}
          </CollapsibleContent>
        </div>
      </Collapsible>
      // Edit Collection
      <EditCollectionModal
        isModalOpen={isEditOpen}
        setIsModalOpen={setIsEditOpen}
        collectionId={collection.id}
        initialName={collection.name}
      />
      // Delete Collection
      <DeleteCollectionModal
        isModalOpen={isDeleteOpen}
        setIsModalOpen={setIsDeleteOpen}
        collectionId={collection.id}
      />
      // Add Request
      <SaveRequestToCollectionModal
        isModalOpen={isAddRequestOpen}
        setIsModalOpen={setIsAddRequestOpen}
        collectionId={collection.id}
        initialName="Untitled Request"
      />
    </>
  );
};

export default CollectionFolder;
