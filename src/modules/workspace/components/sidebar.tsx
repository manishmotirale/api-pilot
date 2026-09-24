"use client";

import {
  Archive,
  ChevronRight,
  Clock,
  Code,
  ExternalLink,
  HelpCircle,
  Plus,
  Search,
  Share2,
} from "lucide-react";

import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import CreateCollection from "@/modules/collections/components/create-collection";
import EmptyCollection from "@/modules/collections/components/empty-collection";
import CollectionFolder from "@/modules/collections/components/collection-folder";
import { useCollections } from "@/modules/collections/hooks/collection";

interface Props {
  currentWorkspace: any;
}

const TabbedSidebar = ({ currentWorkspace }: Props) => {
  const [activeTab, setActiveTab] = useState("Collections");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const {
    data: collections,
    isLoading,
    isError,
  } = useCollections(currentWorkspace?.id);

  const sidebarItems = [
    {
      icon: Archive,
      label: "Collections",
    },
    {
      icon: Clock,
      label: "History",
    },
    {
      icon: Share2,
      label: "Share",
    },
    {
      icon: Code,
      label: "Code",
    },
  ];

  const filteredCollections = useMemo(() => {
    if (!collections) return [];

    const query = search.trim().toLowerCase();

    if (!query) return collections;

    return collections.filter((collection) =>
      collection.name.toLowerCase().includes(query),
    );
  }, [collections, search]);

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-zinc-950 text-zinc-100">
      // ------- Sidebar --------
      <aside className="flex w-12 shrink-0 flex-col items-center border-r border-zinc-800 bg-zinc-950 py-3">
        <div className="flex flex-col items-center gap-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;

            return (
              <button
                key={item.label}
                type="button"
                title={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`
                  group relative flex size-8 items-center justify-center
                  rounded-md transition-all duration-150
                  ${
                    isActive
                      ? "bg-indigo-500/15 text-indigo-400"
                      : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                  }
                `}
              >
                {isActive && (
                  <span className="absolute -left-[13px] h-5 w-0.5 rounded-full bg-indigo-500" />
                )}

                <Icon className="size-4" />
              </button>
            );
          })}
        </div>
      </aside>

      // ------- Content --------
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {activeTab === "Collections" ? (
          <>
            {/* Header */}
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-800 px-3">
              <div className="flex min-w-0 items-center gap-1.5">
                <span className="max-w-[130px] truncate text-xs text-zinc-500">
                  {currentWorkspace?.name || "Workspace"}
                </span>

                <ChevronRight className="size-3 text-zinc-700" />

                <span className="text-xs font-medium text-zinc-200">
                  Collections
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Help"
                  className="
                    flex size-7 items-center justify-center
                    rounded-md text-zinc-500
                    transition-colors
                    hover:bg-zinc-800
                    hover:text-zinc-200
                  "
                >
                  <HelpCircle className="size-3.5" />
                </button>

                <button
                  type="button"
                  title="Open"
                  className="
                    flex size-7 items-center justify-center
                    rounded-md text-zinc-500
                    transition-colors
                    hover:bg-zinc-800
                    hover:text-zinc-200
                  "
                >
                  <ExternalLink className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="shrink-0 border-b border-zinc-800 p-3">
              <div className="relative">
                <Search
                  className="
                    absolute left-3 top-1/2
                    size-3.5 -translate-y-1/2
                    text-zinc-500
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search collections..."
                  className="
                    h-8 w-full rounded-md
                    border border-zinc-800
                    bg-zinc-900/70
                    pl-9 pr-3
                    text-xs text-zinc-100
                    outline-none
                    placeholder:text-zinc-600
                    transition-all

                    focus:border-indigo-500/50
                    focus:bg-zinc-900
                    focus:ring-1
                    focus:ring-indigo-500/20
                  "
                />
              </div>
            </div>

            {/* New Collection */}
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-3 py-2">
              <div>
                <p className="text-xs font-medium text-zinc-300">Collections</p>

                <p className="text-[10px] text-zinc-600">
                  Organize your API requests
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="
                  h-7 gap-1.5
                  bg-indigo-600
                  px-2.5
                  text-xs
                  hover:bg-indigo-500
                "
              >
                <Plus className="size-3.5" />
                New
              </Button>
            </div>

            {/* Collections */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="size-5 animate-spin rounded-full border-2 border-zinc-700 border-t-indigo-500" />

                    <span className="text-xs text-zinc-600">
                      Loading collections...
                    </span>
                  </div>
                </div>
              ) : isError ? (
                <div className="flex h-full items-center justify-center px-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-300">
                      Failed to load collections
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      Please try refreshing the workspace.
                    </p>
                  </div>
                </div>
              ) : filteredCollections.length > 0 ? (
                <div className="py-1">
                  {filteredCollections.map((collection:any) => (
                    <div
                      key={collection.id}
                      className="
                        border-b border-zinc-900
                        px-2 py-1
                        transition-colors
                        hover:bg-zinc-900/60
                      "
                    >
                      <CollectionFolder collection={collection} />
                    </div>
                  ))}
                </div>
              ) : search ? (
                <div className="flex h-full items-center justify-center px-6">
                  <div className="text-center">
                    <Search className="mx-auto size-5 text-zinc-700" />

                    <p className="mt-2 text-xs font-medium text-zinc-400">
                      No collections found
                    </p>

                    <p className="mt-1 text-[11px] text-zinc-600">
                      Try a different search term.
                    </p>
                  </div>
                </div>
              ) : (
                <EmptyCollection />
              )}
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center px-6">
            <div className="text-center">
              <div className="mx-auto flex size-10 items-center justify-center rounded-lg bg-zinc-900">
                {(() => {
                  const item = sidebarItems.find(
                    (item) => item.label === activeTab,
                  );

                  const Icon = item?.icon || Archive;

                  return <Icon className="size-5 text-zinc-600" />;
                })()}
              </div>

              <p className="mt-3 text-sm font-medium text-zinc-400">
                {activeTab}
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                This section is coming soon.
              </p>
            </div>
          </div>
        )}
      </main>

      // ------- Modal --------
      <CreateCollection
        workspaceId={currentWorkspace?.id}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default TabbedSidebar;
