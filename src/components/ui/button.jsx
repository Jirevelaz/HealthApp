import React from "react";
import { cn } from "@/utils/cn";

const baseStyles =
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-40";

const variants = {
  default:
    "bg-primary text-white shadow-soft-xl hover:brightness-110 focus-visible:ring-primary",
  ghost:
    "bg-transparent text-text-secondary hover:bg-surface-muted/60 focus-visible:ring-primary/40",
  outline:
    "border border-outline/60 bg-surface/60 text-text-secondary hover:bg-surface focus-visible:ring-primary/50",
  soft:
    "bg-primary-soft text-primary hover:bg-primary-soft/80 focus-visible:ring-primary",
  destructive:
    "bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger/70",
};

const sizes = {
  default: "h-11 px-5",
  sm: "h-9 px-4 text-sm",
  lg: "h-12 px-7 text-base",
  icon: "h-11 w-11",
};

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
