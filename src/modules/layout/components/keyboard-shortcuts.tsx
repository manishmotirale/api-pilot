"use client";

import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Search,
  Save,
  Plus,
  RefreshCw,
  Edit3,
  Trash2,
  Copy,
  Command,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const KeyboardShortcuts = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (
        event.key === "?" &&
        (event.metaKey || event.ctrlKey || event.shiftKey)
      ) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };

    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, []);

  const shortcuts = [
    {
      category: "General",
      icon: Command,
      color: "from-cyan-500 to-blue-500",
      items: [
        {
          keys: ["⌘", "K"],
          pcKeys: ["Ctrl", "K"],
          description: "Open command palette / Search",
          icon: Search,
        },
        {
          keys: ["⌘", "?"],
          pcKeys: ["Ctrl", "?"],
          description: "Show keyboard shortcuts",
          icon: Keyboard,
        },
      ],
    },
    {
      category: "Requests",
      icon: RefreshCw,
      color: "from-purple-500 to-pink-500",
      items: [
        {
          keys: ["⌘", "S"],
          pcKeys: ["Ctrl", "S"],
          description: "Save current request",
          icon: Save,
        },
        {
          keys: ["⌘", "⇧", "N"],
          pcKeys: ["Ctrl", "Shift", "N"],
          description: "Create new request",
          icon: Plus,
        },
        {
          keys: ["⌘", "⇧", "R"],
          pcKeys: ["Ctrl", "Shift", "R"],
          description: "Rename request",
          icon: Edit3,
        },
      ],
    },
    {
      category: "Collections",
      icon: Copy,
      color: "from-orange-500 to-amber-500",
      items: [
        {
          keys: ["⌘", "⇧", "E"],
          pcKeys: ["Ctrl", "Shift", "E"],
          description: "Edit collection",
          icon: Edit3,
        },
        {
          keys: ["⌘", "⇧", "D"],
          pcKeys: ["Ctrl", "Shift", "D"],
          description: "Duplicate collection",
          icon: Copy,
        },
        {
          keys: ["⌘", "⌫"],
          pcKeys: ["Ctrl", "Del"],
          description: "Delete collection",
          icon: Trash2,
        },
      ],
    },
  ];

  const isMac =
    typeof window !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        className="group relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] transition-all duration-200 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
      >
        <Keyboard className="h-4 w-4 text-zinc-400 transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-400 group-hover:rotate-6" />
        <kbd className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-md border border-cyan-500/30 bg-cyan-500/20 text-[8px] font-bold text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
          ?
        </kbd>
      </button>

      <DialogContent
        className="
          max-w-2xl
          overflow-hidden
          rounded-2xl
          border
          border-white/[0.10]
          bg-[#0b0f17]/98
          p-0
          shadow-[0_30px_100px_rgba(0,0,0,0.65)]
          backdrop-blur-xl
        "
      >
        <DialogHeader className="border-b border-white/[0.08] bg-[#080b11] p-6">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-white">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-cyan-500/20
                to-blue-500/20
                ring-1
                ring-cyan-400/30
              "
            >
              <Keyboard className="h-5 w-5 text-cyan-400" />
            </div>
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            Master API Pilot with these powerful keyboard shortcuts
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="space-y-6">
            {shortcuts.map((section, idx) => (
              <div key={idx}>
                <div className="mb-3 flex items-center gap-2.5">
                  <div
                    className={`
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      bg-gradient-to-br
                      ${section.color}
                      bg-opacity-10
                      ring-1
                      ring-white/10
                    `}
                  >
                    <section.icon className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                    {section.category}
                  </h3>
                </div>

                <div className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="
                        group
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        border
                        border-white/[0.05]
                        bg-white/[0.02]
                        p-3
                        transition-all
                        duration-200
                        hover:border-white/[0.12]
                        hover:bg-white/[0.05]
                      "
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            bg-white/[0.05]
                            transition-all
                            group-hover:bg-white/[0.08]
                          "
                        >
                          <item.icon className="h-3.5 w-3.5 text-zinc-400 transition-colors group-hover:text-white" />
                        </div>
                        <span className="text-sm text-zinc-300">
                          {item.description}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {(isMac ? item.keys : item.pcKeys).map((key, keyIdx) => (
                          <kbd
                            key={keyIdx}
                            className="
                              flex
                              min-w-[28px]
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-white/[0.12]
                              bg-gradient-to-b
                              from-white/[0.08]
                              to-white/[0.04]
                              px-2
                              py-1.5
                              text-xs
                              font-semibold
                              text-zinc-300
                              shadow-[0_2px_8px_rgba(0,0,0,0.4)]
                            "
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-white/[0.08]
            bg-[#080b11]
            px-6
            py-4
          "
        >
          <p className="text-xs text-zinc-600">
            Press{" "}
            <kbd
              className="
                rounded
                border
                border-white/[0.08]
                bg-white/[0.04]
                px-1.5
                py-0.5
                text-zinc-400
              "
            >
              {isMac ? "⌘" : "Ctrl"}
            </kbd>{" "}
            +{" "}
            <kbd
              className="
                rounded
                border
                border-white/[0.08]
                bg-white/[0.04]
                px-1.5
                py-0.5
                text-zinc-400
              "
            >
              ?
            </kbd>{" "}
            to toggle
          </p>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="text-zinc-500 hover:text-white"
          >
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcuts;
