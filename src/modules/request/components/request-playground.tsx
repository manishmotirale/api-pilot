"use client";

import { useHotkeys } from "react-hotkeys-hook";
import RequestEditor from "./request-editor";
import TabBar from "./tab-bar";
import { useRequestPlaygroundStore } from "../store/useRequestStore";
import { useState } from "react";
import { toast } from "sonner";
import SaveRequestToCollectionModal from "@/modules/collections/components/add-request-modal";
import { REST_METHOD } from "../../../../prisma/generated/enums";
import { Unplug } from "lucide-react";
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
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
          <Unplug size={80} className="text-indigo-400" />
        </div>

        <div className="space-y-2 rounded-lg bg-zinc-900 p-4">
          <div className="flex items-center justify-between gap-8">
            <kbd className="rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm text-indigo-400">
              Ctrl+G
            </kbd>

            <span className="font-semibold text-zinc-400">New Request</span>
          </div>

          <div className="flex items-center justify-between gap-8">
            <kbd className="rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm text-indigo-400">
              Ctrl+S
            </kbd>

            <span className="font-semibold text-zinc-400">Save Request</span>
          </div>
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
