"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  FileText,
  Braces,
  BookOpen,
  Code2,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
  X,
} from "lucide-react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const SearchBar = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };

    document.addEventListener("keydown", down);

    return () => {
      document.removeEventListener("keydown", down);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          group
          flex
          h-full
          w-full
          items-center
          rounded-xl
          border
          border-white/[0.08]
          bg-white/[0.035]
          px-3
          text-left
          transition-all
          duration-200
          hover:border-white/[0.13]
          hover:bg-white/[0.055]
          focus:outline-none
          focus:ring-1
          focus:ring-blue-500/40
        "
      >
        {/* Search icon */}
        <Search
          className="
            mr-2.5
            h-4
            w-4
            shrink-0
            text-zinc-600
            transition-colors
            group-hover:text-zinc-400
          "
        />

        {/* Placeholder */}
        <span className="flex-1 truncate text-xs text-zinc-500">
          Search requests, collections...
        </span>

        {/* Shortcut */}
        <div className="hidden items-center gap-1 sm:flex">
          <kbd
            className="
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-md
              border
              border-white/[0.08]
              bg-white/[0.04]
              px-1.5
              text-[10px]
              font-medium
              text-zinc-500
            "
          >
            Ctrl
          </kbd>

          <kbd
            className="
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-md
              border
              border-white/[0.08]
              bg-white/[0.04]
              px-1.5
              text-[10px]
              font-medium
              text-zinc-500
            "
          >
            K
          </kbd>
        </div>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="
          overflow-hidden
          rounded-2xl
          border
          border-white/[0.10]
          bg-[#0b0f17]
          p-0
          shadow-[0_30px_100px_rgba(0,0,0,0.65)]
        "
      >
        {/* Search input */}
        <div className="border-b border-white/[0.07] bg-[#0b0f17]">
          <CommandInput
            placeholder="Search requests, collections, commands..."
            className="
              h-14
              border-0
              bg-transparent
              text-sm
              text-white
              placeholder:text-zinc-600
              focus:ring-0
            "
          />
        </div>

        {/* Results */}
        <CommandList className="max-h-[420px] bg-[#0b0f17] p-2">
          <CommandEmpty className="py-12 text-center text-sm text-zinc-600">
            No results found.
          </CommandEmpty>

          {/* Quick actions */}
          <CommandGroup
            heading={
              <span className="px-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
                Quick actions
              </span>
            }
          >
            <CommandItem
              value="pre-request script"
              onSelect={() => setOpen(false)}
              className="
                my-1
                rounded-xl
                px-3
                py-2.5
                text-zinc-300
                data-[selected=true]:bg-white/[0.06]
                data-[selected=true]:text-white
              "
            >
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <Code2 className="h-4 w-4 text-blue-400" />
              </div>

              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium">Pre-request Script</span>

                <span className="text-[11px] text-zinc-600">
                  Configure request scripts
                </span>
              </div>
            </CommandItem>

            <CommandItem
              value="tests"
              onSelect={() => setOpen(false)}
              className="
                my-1
                rounded-xl
                px-3
                py-2.5
                text-zinc-300
                data-[selected=true]:bg-white/[0.06]
                data-[selected=true]:text-white
              "
            >
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <FileText className="h-4 w-4 text-emerald-400" />
              </div>

              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium">Tests</span>

                <span className="text-[11px] text-zinc-600">
                  Manage API tests
                </span>
              </div>
            </CommandItem>

            <CommandItem
              value="variables"
              onSelect={() => setOpen(false)}
              className="
                my-1
                rounded-xl
                px-3
                py-2.5
                text-zinc-300
                data-[selected=true]:bg-white/[0.06]
                data-[selected=true]:text-white
              "
            >
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                <Braces className="h-4 w-4 text-violet-400" />
              </div>

              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium">Variables</span>

                <span className="text-[11px] text-zinc-600">
                  Manage environment variables
                </span>
              </div>
            </CommandItem>

            <CommandItem
              value="documentation"
              onSelect={() => setOpen(false)}
              className="
                my-1
                rounded-xl
                px-3
                py-2.5
                text-zinc-300
                data-[selected=true]:bg-white/[0.06]
                data-[selected=true]:text-white
              "
            >
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
                <BookOpen className="h-4 w-4 text-cyan-400" />
              </div>

              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium">Documentation</span>

                <span className="text-[11px] text-zinc-600">
                  View API documentation
                </span>
              </div>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="my-2 bg-white/[0.06]" />

          {/* Example recent section */}
          <CommandGroup
            heading={
              <span className="px-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
                Navigation
              </span>
            }
          >
            <CommandItem
              value="all requests"
              onSelect={() => setOpen(false)}
              className="
                rounded-xl
                px-3
                py-2.5
                text-zinc-400
                data-[selected=true]:bg-white/[0.06]
                data-[selected=true]:text-white
              "
            >
              <Search className="mr-3 h-4 w-4 text-zinc-600" />
              <span className="text-sm">All requests</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>

        {/* ================= FOOTER ================= */}
        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-white/[0.07]
            bg-[#080b11]
            px-3
            py-2.5
          "
        >
          <div className="flex items-center gap-4">
            <Shortcut
              keys={
                <>
                  <ArrowUp />
                  <ArrowDown />
                </>
              }
              label="Navigate"
            />

            <Shortcut keys={<CornerDownLeft />} label="Select" />
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="
              flex
              items-center
              gap-1.5
              text-[10px]
              text-zinc-600
              transition-colors
              hover:text-zinc-400
            "
          >
            <kbd
              className="
                flex
                h-5
                items-center
                justify-center
                rounded-md
                border
                border-white/[0.07]
                bg-white/[0.03]
                px-1.5
                text-[9px]
              "
            >
              ESC
            </kbd>

            <span>Close</span>

            <X className="h-3 w-3" />
          </button>
        </div>
      </CommandDialog>
    </>
  );
};

function Shortcut({ keys, label }: { keys: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-zinc-600">
      <div className="flex items-center gap-0.5">
        {React.Children.map(keys, (key) => (
          <kbd
            className="
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-md
              border
              border-white/[0.07]
              bg-white/[0.03]
              px-1
              text-zinc-500
            "
          >
            {key}
          </kbd>
        ))}
      </div>

      <span>{label}</span>
    </div>
  );
}

export default SearchBar;
