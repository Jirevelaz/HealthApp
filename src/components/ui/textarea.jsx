import React from "react";
import { cn } from "@/utils/cn";

export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[140px] w-full rounded-2xl border border-outline/40 bg-surface/40 px-4 py-3 text-sm text-text-primary shadow-soft-xl transition-colors placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
