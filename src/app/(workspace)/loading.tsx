import { Loader2 } from "lucide-react";
import React from "react";

const LoadingPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Loader */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-14 w-14 rounded-full border border-indigo-500/20" />

          <Loader2
            className="h-10 w-10 animate-spin text-indigo-500"
            strokeWidth={2}
          />
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Loading your workspace
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Preparing your API environment...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
