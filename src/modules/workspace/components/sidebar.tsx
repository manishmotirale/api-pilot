"use client";

import { Button } from "@/components/ui/button";
import {
  Archive,
  Clock,
  Code,
  ExternalLink,
  HelpCircle,
  Loader2,
  Plus,
  Search,
  Share2,
} from "lucide-react";
import { useMemo, useState } from "react";

import CollectionFolder from "@/modules/collections/components/collection-folder";
import { useCollections } from "@/modules/collections/hooks/collection";
import EmptyCollections from "@/modules/collections/components/empty-collection";
import CreateCollection from "@/modules/collections/components/create-collection";

interface Props {
  currentWorkspace: {
    id: string;
    name: string;
  };
}

const TabbedSidebar = ({ currentWorkspace }: Props) => {
  const [activeTab, setActiveTab] = useState("Collections");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter collections based on search
  const filteredCollections = useMemo(() => {
    if (!collections) return [];

    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return collections;
    }

    return collections.filter((collection) =>
      collection.name.toLowerCase().includes(search),
    );
  }, [collections, searchTerm]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-950">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-950 px-6 text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
          <Archive className="h-5 w-5 text-red-400" />
        </div>

        <p className="text-sm font-medium text-zinc-300">
          Failed to load collections
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          Please try refreshing the page.
        </p>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "Collections":
        return (
          <div className="flex h-full min-h-0 flex-col bg-zinc-950 text-zinc-100">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="max-w-[150px] truncate text-sm text-zinc-400"
                  title={currentWorkspace.name}
                >
                  {currentWorkspace.name}
                </span>

                <span className="text-zinc-600">›</span>

                <span className="text-sm font-medium text-zinc-200">
                  Collections
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  title="Help"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  title="Open in new window"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="shrink-0 border-b border-zinc-800 p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search collections..."
                  className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-900 pl-9 pr-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 transition-colors focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* New Collection */}
            <div className="shrink-0 border-b border-zinc-800 p-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(true)}
                className="h-8 w-full justify-start gap-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
              >
                <Plus className="h-4 w-4" />

                <span className="text-sm font-medium">New Collection</span>
              </Button>
            </div>

            {/* Collections */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {filteredCollections.length > 0 ? (
                <div className="p-2">
                  {filteredCollections.map((collection) => (
                    <div
                      key={collection.id}
                      className="w-full border-b border-zinc-900 last:border-b-0"
                    >
                      <CollectionFolder collection={collection} />
                    </div>
                  ))}
                </div>
              ) : searchTerm.trim() ? (
                <div className="flex h-full min-h-[200px] flex-col items-center justify-center px-6 text-center">
                  <Search className="mb-3 h-6 w-6 text-zinc-600" />

                  <p className="text-sm font-medium text-zinc-400">
                    No collections found
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Try searching with a different name.
                  </p>
                </div>
              ) : (
                <EmptyCollections />
              )}
            </div>
          </div>
        );

      case "History":
        return (
          <div className="flex h-full items-center justify-center bg-zinc-950 px-6 text-center">
            <div>
              <Clock className="mx-auto mb-3 h-8 w-8 text-zinc-600" />

              <p className="text-sm font-medium text-zinc-400">History</p>

              <p className="mt-1 text-xs text-zinc-600">
                Request history will appear here.
              </p>
            </div>
          </div>
        );

      case "Share":
        return (
          <div className="flex h-full items-center justify-center bg-zinc-950 px-6 text-center">
            <div>
              <Share2 className="mx-auto mb-3 h-8 w-8 text-zinc-600" />

              <p className="text-sm font-medium text-zinc-400">Share</p>

              <p className="mt-1 text-xs text-zinc-600">
                Workspace sharing options will appear here.
              </p>
            </div>
          </div>
        );

      case "Code":
        return (
          <div className="flex h-full items-center justify-center bg-zinc-950 px-6 text-center">
            <div>
              <Code className="mx-auto mb-3 h-8 w-8 text-zinc-600" />

              <p className="text-sm font-medium text-zinc-400">Code</p>

              <p className="mt-1 text-xs text-zinc-600">
                Code generation options will appear here.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full bg-zinc-900">
      {/* Left Icon Navigation */}
      <div className="flex w-12 shrink-0 flex-col items-center border-r border-zinc-800 bg-zinc-900 py-3">
        <div className="flex flex-col gap-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveTab(item.label)}
                title={item.label}
                className={`relative flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                    : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                <Icon className="h-4 w-4" />

                {isActive && (
                  <span className="absolute -left-[13px] h-5 w-0.5 rounded-full bg-indigo-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Sidebar Content */}
      <div className="min-w-0 flex-1 overflow-hidden">{renderTabContent()}</div>

      {/* Create Collection Modal */}
      <CreateCollection
        workspaceId={currentWorkspace.id}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default TabbedSidebar;
