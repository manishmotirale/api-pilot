"use client";

import { Search, Command, Sparkles } from "lucide-react";

import UserButton from "@/modules/authentication/components/user-button";
import InviteMember from "./invite-member";

import { UserProps, WorkspaceProps } from "../types";
import SearchBar from "./search-bar";
import WorkSpace from "./workspace";

interface Props {
  user: UserProps;
  workspace: WorkspaceProps;
}

const Header = ({ user, workspace }: Props) => {
  return (
    <header
      className="
        relative
        flex
        h-16
        w-full
        items-center
        border-b
        border-white/[0.07]
        bg-[#080b11]/95
        px-3
        backdrop-blur-xl
        sm:px-4
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-blue-500/40
          to-transparent
        "
      />

      <div className="flex min-w-0 items-center">
        <div
          className="
            group
            flex
            cursor-pointer
            items-center
            gap-2.5
            rounded-xl
            px-2
            py-1.5
            transition-colors
            hover:bg-white/[0.04]
          "
        >
          <div
            className="
              relative
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              border
              border-blue-400/20
              bg-blue-500/[0.08]
              shadow-[0_0_20px_rgba(59,130,246,0.08)]
            "
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-400/5" />

            <Sparkles className="relative h-4 w-4 text-blue-400 transition-transform duration-300 group-hover:scale-110" />
          </div>

          {/* Brand */}
          <div className="hidden min-w-0 sm:block">
            <p className="text-sm font-semibold leading-none tracking-tight text-white">
              API<span className="text-blue-400">Pilot</span>
            </p>

            <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-600">
              API Workspace
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex min-w-0 flex-1 justify-center px-3 sm:px-6">
        <div
          className="
            relative
            w-full
            max-w-xl
          "
        >
          <div
            className="
              group
              relative
              flex
              h-10
              items-center
              overflow-hidden
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.035]
              transition-all
              duration-200
              hover:border-white/[0.12]
              hover:bg-white/[0.045]
              focus-within:border-blue-500/30
              focus-within:bg-white/[0.05]
              focus-within:shadow-[0_0_25px_rgba(59,130,246,0.06)]
            "
          >
            <Search
              className="
                ml-3
                h-4
                w-4
                shrink-0
                text-zinc-600
                transition-colors
                group-focus-within:text-blue-400
              "
            />

            <div className="min-w-0 flex-1">
              <SearchBar />
            </div>

            {/* Shortcut */}
            <div className="mr-2 hidden items-center gap-1 rounded-md border border-white/[0.07] bg-white/[0.03] px-1.5 py-1 text-[10px] text-zinc-600 md:flex">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {/* Invite */}
        <div className="rounded-lg transition-colors hover:bg-white/[0.04]">
          <InviteMember />
        </div>

        <div className="rounded-lg transition-colors hover:bg-white/[0.04]">
          {/* @ts-ignore */}
          <WorkSpace workspace={workspace} />
        </div>

        <div className="mx-1 hidden h-7 w-px bg-white/[0.07] sm:block" />

        {/* User */}
        <UserButton user={user} size="sm" />
      </div>
    </header>
  );
};

export default Header;
