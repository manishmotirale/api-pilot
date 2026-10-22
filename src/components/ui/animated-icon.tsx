import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedIconProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: "pulse" | "bounce" | "spin" | "ping" | "wiggle" | "glow" | "float";
  speed?: "slow" | "normal" | "fast";
}

export function AnimatedIcon({
  children,
  animation = "pulse",
  speed = "normal",
  className,
  ...props
}: AnimatedIconProps) {
  const animationClasses = {
    pulse: {
      slow: "animate-pulse-slow",
      normal: "animate-pulse",
      fast: "animate-pulse-fast",
    },
    bounce: {
      slow: "animate-bounce-slow",
      normal: "animate-bounce",
      fast: "animate-bounce-fast",
    },
    spin: {
      slow: "animate-spin-slow",
      normal: "animate-spin",
      fast: "animate-spin-fast",
    },
    ping: {
      slow: "animate-ping-slow",
      normal: "animate-ping",
      fast: "animate-ping-fast",
    },
    wiggle: {
      slow: "animate-wiggle-slow",
      normal: "animate-wiggle",
      fast: "animate-wiggle-fast",
    },
    glow: {
      slow: "animate-glow-slow",
      normal: "animate-glow",
      fast: "animate-glow-fast",
    },
    float: {
      slow: "animate-float-slow",
      normal: "animate-float",
      fast: "animate-float-fast",
    },
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center",
        animationClasses[animation][speed],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
