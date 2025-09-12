"use client";

import clsx from "clsx";
import {ReactNode} from "react";

export type TableColumn = {key: string; header: ReactNode; className?: string};
export const DataTable = ({
  columns,
  rows,
  footer,
  emptyText = "No data",
}: {
  columns: TableColumn[];
  rows: Array<Record<string, ReactNode>>;
  footer?: ReactNode;
  emptyText?: string;
}) => (
  <div className="rounded-lg border border-border overflow-hidden bg-surface">
    <table className="min-w-full text-sm">
      <thead className="bg-surface-muted">
        <tr className="text-left border-0">
          {columns.map((col) => (
            <th
              key={col.key}
              className={clsx("px-3 py-2 font-medium", col.className)}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {!rows.length ? (
          <tr>
            <td
              colSpan={columns.length}
              className="px-3 py-2 text-center text-muted"
            >
              {emptyText}
            </td>
          </tr>
        ) : (
          rows.map((row, i) => (
            <tr key={i} className="border-t border-border text-left">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={clsx("px-3 py-2", col?.className ?? "")}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
      {footer && (
        <tfoot className="border-t border-border bg-surface">{footer}</tfoot>
      )}
    </table>
  </div>
);
