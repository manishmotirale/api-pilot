"use client";

import Image from "next/image";
import UserButton from "@/modules/authentication/components/user-button";
import InviteMember from "./invite-member";
import { UserProps, WorkspaceProps } from "../types";
import SearchBar from "./search-bar";
import WorkSpace from "./workspace";
import KeyboardShortcuts from "./keyboard-shortcuts";
import RequestHistory from "@/modules/request/components/request-history";

interface Props {
  user: UserProps;
  workspace: WorkspaceProps;
}

const Header = ({ user, workspace }: Props) => {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center border-b border-white/[0.07] bg-[#080b11]/95 px-3 backdrop-blur-xl sm:px-4 lg:px-6">
      {/* Gradient line at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      {/* Logo & Brand */}
      <div className="flex min-w-fit items-center gap-3">
        <div className="group flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-500/5 hover:to-blue-500/5">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-purple-500/10 shadow-lg shadow-cyan-500/20 transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-400/50 group-hover:shadow-xl group-hover:shadow-cyan-400/30">
            <Image 
              src="/ApiPilot.gif" 
              alt="API Pilot" 
              width={28} 
              height={28}
              className="relative z-10 transition-transform duration-300 group-hover:scale-110"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-cyan-400/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="hidden min-w-0 sm:block">
            <h1 className="flex items-center gap-1 text-base font-bold leading-none tracking-tight">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                API
              </span>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                Pilot
              </span>
            </h1>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
              API Testing Platform
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar - Centered */}
      <div className="mx-2 flex min-w-0 flex-1 justify-center sm:mx-4 lg:mx-6">
        <div className="relative w-full max-w-md lg:max-w-lg">
          <SearchBar />
        </div>
      </div>

      {/* Actions - Right Side with proper spacing */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <div className="hidden lg:block">
          <RequestHistory />
        </div>
        
        <KeyboardShortcuts />

        <InviteMember />

        <div className="hidden sm:block">
          <WorkSpace />
        </div>

        <div className="mx-1 hidden h-6 w-px bg-white/[0.07] sm:block" />

        <UserButton user={user} size="sm" />
      </div>
    </header>
  );
};

export default Header;
