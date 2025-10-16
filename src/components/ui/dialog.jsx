import React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

const DialogContext = React.createContext(null);

function useDialogContext(component) {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error(`${component} must be used within a <Dialog> component.`);
  }
  return context;
}

export function Dialog({ open: openProp, onOpenChange, children }) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(openProp ?? false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const setOpen = (next) => {
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  };

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogContent({ className, children, ...props }) {
  const { open, setOpen } = useDialogContext("DialogContent");

  if (!open) {
    return null;
  }

  if (typeof document === "undefined") {
    return null;
  }

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
        <div
          className={cn(
            "relative z-10 w-[92vw] max-w-lg rounded-3xl border border-outline/50 bg-surface p-6 text-text-primary shadow-soft-xl",
            className
          )}
          {...props}
        >
          {children}
        </div>
    </div>
  );

  return createPortal(content, document.body);
}

export function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-b border-outline/40 pb-4",
        className
      )}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }) {
  return (
    <h2
      className={cn(
        "text-xl font-semibold leading-tight text-text-primary",
        className
      )}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-sm text-text-muted", className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }) {
  return (
    <div className={cn("mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end", className)} {...props} />
  );
}
