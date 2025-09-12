"use client";

import clsx from "clsx";
import {ReactNode, useState, useMemo} from "react";

export type TableColumn = {key: string; header: ReactNode; className?: string};
export const DataTable = ({
  columns,
  rows,
  footer,
  emptyText = "No data",
  header,
  searchable = true,
  searchFields = [],
  title,
}: {
  columns: TableColumn[];
  rows: Array<Record<string, ReactNode>>;
  footer?: ReactNode;
  emptyText?: string;
  header?: ReactNode;
  searchable?: boolean;
  searchFields?: string[];
  title?: string;
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = useMemo(() => {
    if (!searchable || !searchQuery.trim() || !searchFields.length) return rows;

    const query = searchQuery.toLowerCase();
    return rows.filter((row) =>
      searchFields.some((field) =>
        String(row[field]).toLowerCase().includes(query)
      )
    );
  }, [rows, searchQuery, searchFields, searchable]);

  const searchHeader =
    searchable && title ? (
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium">{title}</h3>
        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 rounded-md bg-surface-muted border border-border px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>
    ) : (
      header
    );

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-surface">
      {searchHeader && (
        <div className="p-3 border-b border-border">{searchHeader}</div>
      )}
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
          {!filteredRows.length ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-2 text-center text-muted"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            filteredRows.map((row, i) => (
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
};
