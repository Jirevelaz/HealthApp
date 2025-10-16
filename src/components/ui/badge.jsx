import React from "react";
import { cn } from "@/utils/cn";

const variants = {
  default: "bg-primary-soft text-primary",
  secondary: "bg-surface-muted/60 text-text-secondary",
  outline: "border border-outline/60 bg-transparent text-text-secondary",
  success: "bg-success/15 text-success",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
