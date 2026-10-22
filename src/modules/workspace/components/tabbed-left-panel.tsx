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
      label: "REST APIs",
      key: "rest",
      link: "/",
    },
    {
      icon: Globe,
      label: "Realtime",
      key: "realtime",
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
            const isActive = activeTab === item.key;

            return (
              <Hint key={item.key} label={item.label} side="right">
                <Link
                  href={item.link}
                  className={`group flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-cyan-400"
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-all duration-300 ${!isActive && 'group-hover:scale-110 group-hover:rotate-12'}`} />
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
