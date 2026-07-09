import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-4 border border-border bg-surface p-4",
        "flex flex-col gap-1",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-muted text-xs uppercase tracking-wider font-medium">
          {label}
        </p>
        {icon && (
          <span className="text-muted/50 shrink-0 ml-2">
            {icon}
          </span>
        )}
      </div>
      <p className="text-fg text-2xl font-bold font-display tabular-nums">
        {value}
      </p>
      {trend && (
        <div
          className={cn(
            "inline-flex items-center gap-1 text-xs font-medium",
            trend.positive ? "text-positive" : "text-negative"
          )}
        >
          {trend.positive ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          )}
          <span>{trend.value}%</span>
        </div>
      )}
    </div>
  );
}
