"use client";

import {DataTable, type TableColumn} from "./index";
import {usePortfolioStore} from "@/app/store/portfolioStore";
import {formatCryptoAmount} from "@/app/lib/formatCurrency";

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
    fromAmt: formatCryptoAmount(trade.fromAmount),
    toAmt: formatCryptoAmount(trade.toAmount),
  }));

  return <DataTable columns={columns} rows={rows} emptyText="No swaps" />;
}
