import React from "react";
import { cn } from "@/utils/cn";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "glass-card text-text-primary",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 px-6 py-5",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("text-lg font-semibold text-text-primary", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-sm text-text-muted", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return (
    <div className={cn("px-6 py-5 text-text-secondary", className)} {...props} />
  );
}
