"use client";

import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// import { useSuggestRequestName } from "@/modules/ai/hooks/ai-suggestion";
import { useRequestPlaygroundStore } from "../store/useRequestStore";

import { Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Suggestion {
  name: string;
  reasoning: string;
}

interface AddNameModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  tabId: string;
}

const AddNameModal = ({
  isModalOpen,
  setIsModalOpen,
  tabId,
}: AddNameModalProps) => {
  const { updateTab, tabs, markUnsaved } = useRequestPlaygroundStore();

//   const { mutateAsync, isPending } = useSuggestRequestName();

  const tab = tabs.find((tab) => tab.id === tabId);

  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // Load current request name
  useEffect(() => {
    if (tab) {
      setName(tab.title || "");
    }
  }, [tab, tabId]);

  // Save Request Name
  const handleSubmit = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Request name cannot be empty");
      return;
    }

    try {
      updateTab(tabId, {
        title: trimmedName,
      });

      markUnsaved(tabId, true);

      toast.success("Request name updated");

      setSuggestions([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update request name:", error);

      toast.error("Failed to update request name");
    }
  };

  // Generate AI Suggestions
  const handleGenerateSuggestions = async () => {
    if (!tab) {
      toast.error("Request not found");
      return;
    }

    try {
      const result = await mutateAsync({
        workspaceName: tab.workspaceId || "Default Workspace",

        method:
          (tab.method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE") || "GET",

        url: tab.url || "",

        description: `Request in collection ${tab.collectionId || ""}`,
      });

      if (result?.suggestions && result.suggestions.length > 0) {
        setSuggestions(result.suggestions);

        // Automatically select first suggestion
        setName(result.suggestions[0].name);

        toast.success("Generated name suggestions");
      } else {
        toast.error("No name suggestions generated");
      }
    } catch (error) {
      console.error("Failed to generate name suggestions:", error);

      toast.error("Failed to generate name suggestions");
    }
  };

// Close Modal
  const handleClose = () => {
    if (isPending) {
      return;
    }

    setSuggestions([]);
    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Rename Request"
      description="Give your request a name"
      isOpen={isModalOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitText="Save"
      submitVariant="default"
    >
      <div className="flex flex-col gap-4">
        {/* Request Name + AI Button */}
        <div className="flex items-center gap-2">
          <Input
            className="w-full border-zinc-700 bg-zinc-900 p-2 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500"
            placeholder="Request Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleGenerateSuggestions}
            disabled={isPending || !tab}
            title="Generate AI suggestions"
          >
            <Sparkles
              className={`size-5 text-indigo-500 ${
                isPending ? "animate-pulse" : ""
              }`}
            />
          </Button>
        </div>

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              AI Suggestions
            </div>

            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.name}-${index}`}
                type="button"
                className="flex w-full items-center justify-between gap-3 rounded-md border border-zinc-800 bg-zinc-900 p-3 text-left transition-colors hover:border-indigo-500/40 hover:bg-zinc-800"
                onClick={() => setName(suggestion.name)}
              >
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
                  {suggestion.name}
                </span>

                <span className="max-w-[55%] text-right text-xs text-zinc-400">
                  {suggestion.reasoning}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Request Information */}
        {tab && (
          <div className="rounded-md border border-zinc-800 bg-zinc-950 p-3">
            <div className="mb-1 text-xs font-medium text-zinc-500">
              Request
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded bg-zinc-800 px-2 py-1 text-xs font-bold text-indigo-400">
                {tab.method}
              </span>

              <span className="truncate text-xs text-zinc-400">
                {tab.url || "No URL specified"}
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddNameModal;
