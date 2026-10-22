"use client";

import { useHotkeys } from "react-hotkeys-hook";
import RequestEditor from "./request-editor";
import TabBar from "./tab-bar";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import { useState } from "react";
import { toast } from "sonner";
import SaveRequestToCollectionModal from "@/modules/collections/components/add-request-modal";
import { REST_METHOD } from "../../../../prisma/generated/enums";
import { Unplug, Save, Plus, Zap } from "lucide-react";
import { useSaveRequest } from "../hooks/request";

export default function PlaygroundPage() {
  const { tabs, activeTabId, addTab } = useRequestPlaygroundStore();

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const { mutateAsync, isPending } = useSaveRequest(activeTab?.requestId!);

  const [showSaveModal, setShowSaveModal] = useState(false);

  const getCurrentRequestData = () => {
    if (!activeTab) {
      return {
        name: "Untitled Request",
        method: REST_METHOD.GET,
        url: "https://echo.hoppscotch.io",
      };
    }

    return {
      name: activeTab.title || "Untitled Request",
      method: (activeTab.method as REST_METHOD) || REST_METHOD.GET,
      url: activeTab.url || "https://echo.hoppscotch.io",
    };
  };

  // Save Request Hotkey
  useHotkeys(
    "ctrl+s, meta+s",
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!activeTab) {
        toast.error("No active request to save");
        return;
      }

      // If request already belongs to a collection,
      // update the existing request.
      if (activeTab.collectionId) {
        try {
          await mutateAsync({
            url: activeTab.url || "https://echo.hoppscotch.io",
            method: activeTab.method as REST_METHOD,
            name: activeTab.title || "Untitled Request",
            body: activeTab.body,
            headers: activeTab.headers,
            parameters: activeTab.parameters,
          });

          toast.success("Request updated");
        } catch (err) {
          console.error("Failed to update request:", err);
          toast.error("Failed to update request");
        }
      } else {
        // Request is not inside a collection,
        // so open the save-to-collection modal.
        setShowSaveModal(true);
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    },
    [activeTab],
  );

  // New Request Hotkey
  useHotkeys(
    "ctrl+g, meta+shift+n",
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      addTab();
      toast.success("New request created");
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    },
    [],
  );

  // Empty State
  if (!activeTab) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-8 p-8">
        {/* Icon */}
        <div
          className="
            group
            relative
            flex
            h-48
            w-48
            items-center
            justify-center
            rounded-3xl
            border
            border-white/[0.08]
            bg-gradient-to-br
            from-blue-500/5
            to-cyan-500/5
            shadow-[0_0_60px_rgba(59,130,246,0.08)]
            transition-all
            duration-500
            hover:shadow-[0_0_80px_rgba(59,130,246,0.15)]
          "
        >
          <div
            className="
              absolute
              inset-0
              rounded-3xl
              bg-gradient-to-br
              from-blue-500/10
              to-cyan-500/10
              opacity-0
              transition-opacity
              duration-500
              group-hover:opacity-100
            "
          />
          <Unplug
            size={96}
            className="
              relative
              text-cyan-500/60
              transition-all
              duration-500
              group-hover:scale-110
              group-hover:text-cyan-400
            "
          />
        </div>

        {/* Title */}
        <div className="text-center">
          <h3 className="mb-2 text-2xl font-semibold text-white">
            No Active Request
          </h3>
          <p className="text-sm text-zinc-500">
            Create a new request or open an existing one to get started
          </p>
        </div>

        {/* Shortcuts */}
        <div className="grid gap-3 sm:grid-cols-2">
          {/* New Request */}
          <div
            className="
              group
              flex
              items-center
              gap-4
              rounded-xl
              border
              border-white/[0.08]
              bg-gradient-to-r
              from-purple-500/5
              to-pink-500/5
              p-4
              transition-all
              duration-200
              hover:border-purple-500/30
              hover:from-purple-500/10
              hover:to-pink-500/10
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-purple-500/20
                to-pink-500/20
                ring-1
                ring-purple-400/30
                transition-transform
                duration-200
                group-hover:scale-110
              "
            >
              <Plus className="h-6 w-6 text-purple-400 transition-transform duration-300 group-hover:rotate-90" />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <kbd
                  className="
                    flex
                    h-6
                    min-w-6
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-white/[0.12]
                    bg-gradient-to-b
                    from-white/[0.08]
                    to-white/[0.04]
                    px-2
                    text-xs
                    font-semibold
                    text-purple-400
                    shadow-sm
                  "
                >
                  Ctrl
                </kbd>
                <span className="text-xs text-zinc-600">+</span>
                <kbd
                  className="
                    flex
                    h-6
                    min-w-6
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-white/[0.12]
                    bg-gradient-to-b
                    from-white/[0.08]
                    to-white/[0.04]
                    px-2
                    text-xs
                    font-semibold
                    text-purple-400
                    shadow-sm
                  "
                >
                  G
                </kbd>
              </div>
              <span className="text-sm font-medium text-zinc-300">
                New Request
              </span>
            </div>
          </div>

          {/* Save Request */}
          <div
            className="
              group
              flex
              items-center
              gap-4
              rounded-xl
              border
              border-white/[0.08]
              bg-gradient-to-r
              from-blue-500/5
              to-cyan-500/5
              p-4
              transition-all
              duration-200
              hover:border-blue-500/30
              hover:from-blue-500/10
              hover:to-cyan-500/10
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-blue-500/20
                to-cyan-500/20
                ring-1
                ring-blue-400/30
                transition-transform
                duration-200
                group-hover:scale-110
              "
            >
              <Save className="h-6 w-6 text-blue-400 transition-transform duration-300 group-hover:-rotate-12" />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <kbd
                  className="
                    flex
                    h-6
                    min-w-6
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-white/[0.12]
                    bg-gradient-to-b
                    from-white/[0.08]
                    to-white/[0.04]
                    px-2
                    text-xs
                    font-semibold
                    text-blue-400
                    shadow-sm
                  "
                >
                  Ctrl
                </kbd>
                <span className="text-xs text-zinc-600">+</span>
                <kbd
                  className="
                    flex
                    h-6
                    min-w-6
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-white/[0.12]
                    bg-gradient-to-b
                    from-white/[0.08]
                    to-white/[0.04]
                    px-2
                    text-xs
                    font-semibold
                    text-blue-400
                    shadow-sm
                  "
                >
                  S
                </kbd>
              </div>
              <span className="text-sm font-medium text-zinc-300">
                Save Request
              </span>
            </div>
          </div>
        </div>

        {/* Quick Tip */}
        <div
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-cyan-500/20
            bg-cyan-500/5
            px-4
            py-2.5
          "
        >
          <Zap className="h-4 w-4 text-cyan-400" />
          <p className="text-xs text-zinc-400">
            Press{" "}
            <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-cyan-400">
              ⌘ ?
            </kbd>{" "}
            to see all keyboard shortcuts
          </p>
        </div>
      </div>
    );
  }
  // Main Playground
  return (
    <div className="flex h-full flex-col">
      <TabBar />

      <div className="flex-1 overflow-auto">
        <RequestEditor />
      </div>

      {/* Save Request Modal */}
      <SaveRequestToCollectionModal
        isModalOpen={showSaveModal}
        setIsModalOpen={setShowSaveModal}
        requestData={getCurrentRequestData()}
        initialName={getCurrentRequestData().name}
      />
    </div>
  );
}
