"use client";

import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSuggestRequestName } from "@/modules/ai/hooks/ai-suggestion";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRequestPlaygroundStore } from "../store/useRequestStore";

interface AddNameModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  tabId: string;
}

interface Suggestion {
  name: string;
  reasoning: string;
}

const AddNameModal = ({
  isModalOpen,
  setIsModalOpen,
  tabId,
}: AddNameModalProps) => {
  const { updateTab, tabs, markUnsaved } = useRequestPlaygroundStore();

  const { mutateAsync, isPending } = useSuggestRequestName();

  const tab = tabs.find((t) => t.id === tabId);

  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // Update the input whenever the selected tab changes
  useEffect(() => {
    if (tab) {
      setName(tab.title || "");
    }
  }, [tab]);

  // Clear suggestions whenever the modal opens for a different request
  useEffect(() => {
    if (isModalOpen) {
      setSuggestions([]);
    }
  }, [isModalOpen, tabId]);

  const handleSubmit = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Request name cannot be empty");
      return;
    }

    if (!tab) {
      toast.error("Request not found");
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

      if (!result.suggestions || result.suggestions.length === 0) {
        toast.error("No name suggestions were generated");
        return;
      }

      setSuggestions(result.suggestions);

      // Automatically select the first suggestion
      setName(result.suggestions[0].name);

      toast.success("Generated name suggestions");
    } catch (error) {
      console.error("Failed to generate name suggestions:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate name suggestions",
      );
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setName(suggestion.name);
  };

  return (
    <Modal
      title="Rename Request"
      description="Give your request a name"
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleSubmit}
      submitText="Save"
      submitVariant="default"
    >
      <div className="flex flex-col gap-4">
        {/* Request Name Input */}
        <div className="flex items-center justify-center gap-2">
          <Input
            className="w-full border-zinc-700 bg-zinc-900 p-2 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500"
            placeholder="Request Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
          />

          {/* AI Suggest Button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleGenerateSuggestions}
            disabled={isPending || !tab}
            title="Generate AI name suggestions"
          >
            <Sparkles
              className={`h-5 w-5 ${
                isPending ? "animate-pulse text-zinc-500" : "text-indigo-500"
              }`}
            />
          </Button>
        </div>

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              AI Suggestions
            </p>

            {suggestions.map((suggestion, index) => (
              <button
                type="button"
                key={`${suggestion.name}-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex w-full flex-col items-start gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-left transition hover:border-indigo-500/50 hover:bg-zinc-800"
              >
                <span className="text-sm font-medium text-white">
                  {suggestion.name}
                </span>

                <span className="text-xs leading-relaxed text-zinc-400">
                  {suggestion.reasoning}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isPending && (
          <p className="text-xs text-zinc-500">
            Generating request name suggestions...
          </p>
        )}
      </div>
    </Modal>
  );
};

export default AddNameModal;
