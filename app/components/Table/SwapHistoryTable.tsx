"use client";

import {usePortfolioStore} from "@/app/store/portfolioStore";
import {DataTable, type TableColumn} from "./index";

export default function SwapHistoryTable() {
  const history = usePortfolioStore((s) => s.history);

  const columns: TableColumn[] = [
    {key: "time", header: "Time"},
    {key: "from", header: "From"},
    {key: "to", header: "To"},
    {key: "fromAmt", header: "From Amt"},
    {key: "toAmt", header: "To Amt"},
  ];

  const rows = history.map((trade) => ({
    time: new Date(trade.time).toLocaleString(),
    from: trade.fromSymbol,
    to: trade.toSymbol,
    fromAmt: trade.fromAmount.toFixed(6),
    toAmt: trade.toAmount.toFixed(6),
  }));

  return <DataTable columns={columns} rows={rows} emptyText="No swaps" />;
}
