"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EmptyState } from "./EmptyState";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface TableProps {
  columns: TableColumn[];
  data: Record<string, any>[];
  loading?: boolean;
  emptyMessage?: string;
  sortKey?: string;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
  className?: string;
  renderRow?: (row: Record<string, any>, index: number) => ReactNode;
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-surface-2 rounded animate-pulse w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function Table({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available.",
  sortKey,
  sortDir,
  onSort,
  className,
  renderRow,
}: TableProps) {
  return (
    <div className="overflow-x-auto rounded-4 border border-border bg-surface">
      <table className={cn("w-full border-collapse", className)}>
        <thead>
          <tr>
            {columns.map((col) => {
              const isSorted = sortKey === col.key;
              const label = col.label;
              const SortIcon = !col.sortable
                ? null
                : isSorted && sortDir === "asc"
                  ? ArrowUp
                  : isSorted && sortDir === "desc"
                    ? ArrowDown
                    : ArrowUpDown;

              return (
                <th
                  key={col.key}
                  className={cn(
                    "text-left px-4 py-3",
                    "text-muted text-xs uppercase tracking-wider font-medium",
                    "border-b border-border",
                    col.sortable && "cursor-pointer select-none hover:text-fg-2 transition-colors"
                  )}
                  onClick={() => col.sortable && onSort?.(col.key)}
                  aria-sort={
                    isSorted
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  <span className="inline-flex items-center gap-1.5">
                    {label}
                    {SortIcon && (
                      <SortIcon
                        size={14}
                        className={cn(
                          "shrink-0",
                          isSorted ? "text-accent" : "text-muted/50"
                        )}
                      />
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <>
              <SkeletonRow cols={columns.length} />
              <SkeletonRow cols={columns.length} />
              <SkeletonRow cols={columns.length} />
            </>
          )}

          {!loading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8">
                <EmptyState
                  title={emptyMessage}
                  className="py-8"
                />
              </td>
            </tr>
          )}

          {!loading &&
            data.length > 0 &&
            data.map((row, i) => {
              if (renderRow) return renderRow(row, i);

              return (
                <tr
                  key={row.id ?? i}
                  className="transition-colors hover:bg-surface-2"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-sm text-fg border-b border-border last:border-b-0"
                    >
                      {row[col.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
