import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CardProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

export function Card({
  title,
  subtitle,
  children,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-4 border border-border bg-surface p-4",
        className
      )}
    >
      {title && (
        <div className="mb-1">
          <h3 className="text-fg font-display font-bold">{title}</h3>
          {subtitle && (
            <p className="text-muted text-sm mt-0.5">{subtitle}</p>
          )}
        </div>
      )}
      {children && <div>{children}</div>}
    </div>
  );
}
