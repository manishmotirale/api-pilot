"use client";

import { Archive, Upload } from "lucide-react";
import React from "react";

const EmptyCollections = () => {
  return (
    <div className="flex h-full flex-1 items-center justify-center px-6 py-10">
      <div className="flex max-w-xs flex-col items-center text-center">
        {/* Icon */}
        <div
          className="
            mb-5
            flex size-16
            items-center justify-center
            rounded-xl
            border border-zinc-800
            bg-zinc-900/60
            shadow-lg
            shadow-black/20
          "
        >
          <Archive className="size-7 text-zinc-600" />
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-zinc-300">
          No collections yet
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs leading-relaxed text-zinc-600">
          Collections help you organize your API requests and keep your
          workspace clean.
        </p>

        {/* Import Button */}
        <button
          type="button"
          className="
            mt-5
            flex h-9
            items-center justify-center
            gap-2
            rounded-md
            border border-zinc-800
            bg-zinc-900
            px-4
            text-xs
            font-medium
            text-zinc-300
            transition-all

            hover:border-indigo-500/30
            hover:bg-indigo-500/10
            hover:text-indigo-400

            focus:outline-none
            focus:ring-2
            focus:ring-indigo-500/20
          "
        >
          <Upload className="size-3.5" />
          Import Collection
        </button>

        {/* Hint */}
        <p className="mt-4 text-[10px] text-zinc-700">
          Or create one using the <span className="text-zinc-500">New</span>{" "}
          button above.
        </p>
      </div>
    </div>
  );
};

export default EmptyCollections;
