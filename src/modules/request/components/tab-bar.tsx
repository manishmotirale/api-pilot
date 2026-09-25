"use client";

import { X, Plus } from "lucide-react";
import { useState } from "react";

import { useRequestPlaygroundStore } from "../store/useRequestStore";
import AddNameModal from "./add-name-modal";

export default function TabBar() {
  const { tabs, activeTabId, setActiveTab, addTab, closeTab } =
    useRequestPlaygroundStore();

  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [selectedTabId, setSelectedTabId] = useState<string | null>(null);

  const requestColorMap: Record<string, string> = {
    GET: "text-green-400",
    POST: "text-blue-400",
    PUT: "text-yellow-400",
    DELETE: "text-red-400",
    PATCH: "text-orange-400",
  };

  const onDoubleClick = (tabId: string) => {
    setSelectedTabId(tabId);
    setRenameModalOpen(true);
  };

  const handleCloseTab = (event: React.MouseEvent, tabId: string) => {
    event.stopPropagation();
    closeTab(tabId);
  };

  return (
    <>
      <div className="flex h-11 min-h-11 items-center border-b border-zinc-800 bg-zinc-950">
        {/* Tabs */}
        <div className="flex min-w-0 flex-1 items-center overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTabId === tab.id;

            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                onDoubleClick={() => onDoubleClick(tab.id)}
                title={`${tab.title} — Double-click to rename`}
                className={`
                  group relative flex h-11 min-w-[150px] max-w-[240px]
                  cursor-pointer items-center gap-2 border-r border-zinc-800
                  px-3 transition-colors
                  ${
                    isActive
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-500 hover:bg-zinc-900/60 hover:text-zinc-300"
                  }
                `}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-indigo-500" />
                )}

                {/* Method */}
                <span
                  className={`shrink-0 text-[10px] font-bold tracking-wide ${
                    requestColorMap[tab.method] ?? "text-zinc-500"
                  }`}
                >
                  {tab.method}
                </span>

                {/* Request name */}
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  <span
                    className={`
                      truncate text-xs font-medium
                      ${isActive ? "text-zinc-200" : "text-zinc-400"}
                    `}
                  >
                    {tab.title || "Untitled Request"}
                  </span>

                  {/* Unsaved indicator */}
                  {tab.unsavedChanges && (
                    <span
                      className="shrink-0 text-red-400"
                      title="Unsaved changes"
                    >
                      •
                    </span>
                  )}
                </div>

                {/* Close */}
                <button
                  type="button"
                  title="Close tab"
                  onClick={(event) => handleCloseTab(event, tab.id)}
                  className={`
                    flex size-5 shrink-0 items-center justify-center
                    rounded transition-colors
                    ${
                      isActive
                        ? "text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
                        : "text-zinc-600 opacity-0 group-hover:opacity-100 hover:bg-zinc-800 hover:text-red-400"
                    }
                  `}
                >
                  <X className="size-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* New Tab */}
        <button
          type="button"
          onClick={addTab}
          title="New request"
          className="
            flex h-11 w-11 shrink-0 items-center justify-center
            border-l border-zinc-800 text-zinc-500
            transition-colors
            hover:bg-zinc-900 hover:text-white
          "
        >
          <Plus className="size-4" />
        </button>
      </div>

      {/* Rename Modal */}
      {selectedTabId && (
        <AddNameModal
          isModalOpen={renameModalOpen}
          setIsModalOpen={setRenameModalOpen}
          tabId={selectedTabId}
        />
      )}
    </>
  );
}
