import React from "react";
import { cn } from "@/utils/cn";

const SelectContext = React.createContext(null);

function useSelectContext(component) {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error(`${component} must be used within a <Select> component.`);
  }
  return context;
}

export function Select({
  value,
  defaultValue,
  onValueChange,
  children,
  className,
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const [open, setOpen] = React.useState(false);

  const resolvedValue = value !== undefined ? value : internalValue;

  const setValue = React.useCallback(
    (nextValue) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
      setOpen(false);
    },
    [onValueChange, value]
  );

  return (
    <SelectContext.Provider
      value={{
        value: resolvedValue,
        setValue,
        open,
        setOpen,
      }}
    >
      <div className={cn("relative", className)}>{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className, children, ...props }) {
  const { open, setOpen } = useSelectContext("SelectTrigger");
  return (
    <button
      type="button"
      className={cn(
        "flex h-11 w-full items-center justify-between rounded-xl border border-outline/40 bg-surface/40 px-4 py-2 text-sm font-medium text-text-primary shadow-soft-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0",
        className
      )}
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      {...props}
    >
      {children}
      <span
        className={cn(
          "ml-3 text-base text-text-muted transition-transform",
          open ? "-rotate-180" : "rotate-0"
        )}
      >
        ▾
      </span>
    </button>
  );
}

export function SelectValue({ placeholder, className }) {
  const { value } = useSelectContext("SelectValue");
  return (
    <span className={cn("truncate text-left text-text-primary", className)}>
      {value ? value : placeholder}
    </span>
  );
}

export function SelectContent({ className, children }) {
  const { open } = useSelectContext("SelectContent");

  if (!open) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-outline/60 bg-surface text-sm text-text-secondary shadow-soft-xl",
        className
      )}
      role="listbox"
    >
      {children}
    </div>
  );
}

export function SelectItem({ value, children, className, ...props }) {
  const { setValue, value: selected } = useSelectContext("SelectItem");
  const isActive = selected === value;

  return (
    <button
      type="button"
      className={cn(
        "flex w-full cursor-pointer items-center px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-muted/80 hover:text-text-primary",
        isActive && "bg-primary-soft text-primary",
        className
      )}
      onClick={() => setValue(value)}
      role="option"
      aria-selected={isActive}
      {...props}
    >
      {children}
    </button>
  );
}
