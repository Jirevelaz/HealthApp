import React from "react";
import { cn } from "@/utils/cn";

export const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-semibold leading-none text-text-secondary",
      className
    )}
    {...props}
  />
));

Label.displayName = "Label";
