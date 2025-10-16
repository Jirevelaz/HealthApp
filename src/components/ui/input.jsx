import React from "react";
import { cn } from "@/utils/cn";

export const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-outline/40 bg-surface/40 px-4 py-2 text-sm text-text-primary shadow-soft-xl transition-colors placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
