"use client";

import Image from "next/image";
import {DataTable, type TableColumn} from "./index";
import {usePortfolioStore} from "@/app/store/portfolioStore";
import {formatCryptoAmount} from "@/app/lib/formatCurrency";
import {useTokenImage} from "@/app/hooks/useTokenImage";

const TokenImage = ({symbol}: {symbol: string}) => {
  const {src, handleError} = useTokenImage(symbol, 16);
  return (
    <Image
      src={src}
      alt={symbol}
      width={16}
      height={16}
      onError={handleError}
      className="rounded-full"
    />
  );
};

const formatHash = (hash: string) => {
  if (hash.length <= 10) return hash;
  return `${hash.slice(0, 6)}****${hash.slice(-6)}`;
};

const formatAge = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
};

export default function SwapHistoryTable() {
  const history = usePortfolioStore((s) => s.history);

  const columns: TableColumn[] = [
    {key: "hash", header: "Hash"},
    {key: "from", header: "From"},
    {key: "to", header: "To"},
    {key: "fromAmt", header: "From Amt", className: "text-right"},
    {key: "toAmt", header: "To Amt", className: "text-right"},
    {key: "age", header: "Age", className: "text-right"},
  ];

  const rows = history.map((trade) => ({
    hash: (
      <span className="text-blue-500 font-mono text-sm">
        {formatHash(trade.id)}
      </span>
    ),
    from: (
      <div className="flex items-center gap-2">
        <TokenImage symbol={trade.fromSymbol} />
        <span className="font-medium">{trade.fromSymbol}</span>
      </div>
    ),
    to: (
      <div className="flex items-center gap-2">
        <TokenImage symbol={trade.toSymbol} />
        <span className="font-medium">{trade.toSymbol}</span>
      </div>
    ),
    fromAmt: formatCryptoAmount(trade.fromAmount),
    toAmt: formatCryptoAmount(trade.toAmount),
    age: formatAge(trade.time),
  }));

  return <DataTable columns={columns} rows={rows} emptyText="No swaps" />;
}
