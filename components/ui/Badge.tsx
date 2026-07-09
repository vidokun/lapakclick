import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "success" | "warning" | "error" | "info";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-positive/20 text-positive",
  warning: "bg-amber/20 text-amber",
  error: "bg-negative/20 text-negative",
  info: "bg-accent/20 text-accent",
};

export function Badge({
  variant = "info",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full text-xs px-2 py-0.5 font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
