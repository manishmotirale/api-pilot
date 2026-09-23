"use client";

import {
  CreditCard,
  LogOut,
  Settings,
  User as UserIcon,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface UserData {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserButtonProps {
  user: UserData | null;
  onLogout?: () => void | Promise<void>;
  onSettings?: () => void;
  onProfile?: () => void;
  onBilling?: () => void;
  showBadge?: boolean;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  showEmail?: boolean;
  showMemberSince?: boolean;
}

export default function UserButton({
  user,
  onLogout,
  onSettings,
  onProfile,
  onBilling,
  showBadge = false,
  badgeText = "Pro",
  badgeVariant = "default",
  size = "md",
  showEmail = true,
  showMemberSince = true,
}: UserButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const getUserInitials = (name: string | null, email: string | null) => {
    if (name) {
      return name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }

    if (email) {
      return email.slice(0, 2).toUpperCase();
    }

    return "U";
  };

  const formatMemberSince = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const avatarSizes = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: async () => {
            if (onLogout) {
              await onLogout();
            }

            router.push("/sign-in");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const initials = getUserInitials(user.name, user.email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          disabled={isLoading}
          className="
            group
            h-auto
            gap-2
            rounded-xl
            px-2
            py-1.5
            hover:bg-accent/70
            focus-visible:ring-1
            focus-visible:ring-ring
          "
        >
          {/* Avatar */}
          <div className="relative">
            <Avatar
              className={`${avatarSizes[size]} border border-border shadow-sm`}
            >
              <AvatarImage
                src={user.image || undefined}
                alt={user.name || "User avatar"}
              />

              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Online indicator */}
            <span
              className="
                absolute
                bottom-0
                right-0
                h-2.5
                w-2.5
                rounded-full
                border-2
                border-background
                bg-emerald-500
              "
            />
          </div>

          {/* User info */}
          <div className="hidden min-w-0 text-left sm:block">
            <div className="flex max-w-[150px] items-center gap-2">
              <p className="truncate text-sm font-medium leading-none">
                {user.name || "User"}
              </p>

              {showBadge && (
                <Badge
                  variant={badgeVariant}
                  className="h-4 rounded-md px-1.5 text-[9px] font-semibold"
                >
                  {badgeText}
                </Badge>
              )}
            </div>

            {showEmail && user.email && (
              <p className="mt-1 max-w-[150px] truncate text-[11px] text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>

          <ChevronDown
            className="
              hidden
              h-4
              w-4
              text-muted-foreground
              transition-transform
              duration-200
              group-data-[state=open]:rotate-180
              sm:block
            "
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="
          w-[290px]
          overflow-hidden
          rounded-2xl
          border-border/60
          bg-background/95
          p-1.5
          shadow-2xl
          backdrop-blur-xl
        "
      >
        {/* Profile header */}
        <div className="rounded-xl bg-muted/50 p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border border-border shadow-sm">
              <AvatarImage
                src={user.image || undefined}
                alt={user.name || "User avatar"}
              />

              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-base font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold">
                  {user.name || "User"}
                </p>

                {showBadge && (
                  <Badge
                    variant={badgeVariant}
                    className="h-5 rounded-md px-1.5 text-[10px]"
                  >
                    {badgeText}
                  </Badge>
                )}
              </div>

              {user.email && (
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              )}

              {showMemberSince && (
                <p className="mt-1 text-[10px] text-muted-foreground/70">
                  Member since {formatMemberSince(user.createdAt)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Account section */}
        <div className="mt-1">
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Account
          </p>

          {onProfile && (
            <DropdownMenuItem
              onClick={onProfile}
              className="
                cursor-pointer
                rounded-lg
                px-3
                py-2.5
                focus:bg-accent
              "
            >
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <UserIcon className="h-4 w-4 text-blue-500" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium">Profile</span>
                <span className="text-[11px] text-muted-foreground">
                  Manage your profile
                </span>
              </div>
            </DropdownMenuItem>
          )}

          {onBilling && (
            <DropdownMenuItem
              onClick={onBilling}
              className="
                cursor-pointer
                rounded-lg
                px-3
                py-2.5
                focus:bg-accent
              "
            >
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                <CreditCard className="h-4 w-4 text-violet-500" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium">Billing</span>
                <span className="text-[11px] text-muted-foreground">
                  Manage your subscription
                </span>
              </div>
            </DropdownMenuItem>
          )}

          {onSettings && (
            <DropdownMenuItem
              onClick={onSettings}
              className="
                cursor-pointer
                rounded-lg
                px-3
                py-2.5
                focus:bg-accent
              "
            >
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                <Settings className="h-4 w-4 text-amber-500" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium">Settings</span>
                <span className="text-[11px] text-muted-foreground">
                  Preferences and configuration
                </span>
              </div>
            </DropdownMenuItem>
          )}
        </div>

        <DropdownMenuSeparator className="my-1" />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoading}
          className="
            cursor-pointer
            rounded-lg
            px-3
            py-2.5
            text-destructive
            focus:bg-destructive/10
            focus:text-destructive
          "
        >
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
            <LogOut className="h-4 w-4" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {isLoading ? "Signing out..." : "Sign out"}
            </span>

            <span className="text-[11px] text-destructive/60">
              End your current session
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
