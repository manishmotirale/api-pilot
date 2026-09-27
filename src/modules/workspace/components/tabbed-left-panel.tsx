"use client";

import { Hint } from "@/components/ui/hint";
import { Globe, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TabbedLeftPanel = () => {
  const pathname = usePathname();

  const activeTab = pathname === "/realtime" ? "realtime" : "rest";

  const sidebarItems = [
    {
      icon: LinkIcon,
      label: "rest",
      link: "/",
    },
    {
      icon: Globe,
      label: "realtime",
      link: "/realtime",
    },
  ];

  return (
    <div className="flex h-full bg-zinc-950">
      {/* Sidebar */}
      <div className="flex w-12 flex-col items-center border-r border-zinc-800 bg-zinc-900 py-4">
        <div className="flex flex-col gap-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;

            return (
              <Hint key={item.label} label={item.label} side="right">
                <Link
                  href={item.link}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              </Hint>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabbedLeftPanel;
