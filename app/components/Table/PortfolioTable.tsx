"use client";

import {useMemo} from "react";
import Image from "next/image";
import {useAllMids} from "@/app/hooks/useMarketData";
import {DataTable, type TableColumn} from "./index";
import {usePortfolioStore} from "@/app/store/portfolioStore";
import {formatCryptoAmount, formatAssetPrice} from "@/app/lib/formatCurrency";
import {useTokenImage} from "@/app/hooks/useTokenImage";

const TokenImage = ({symbol}: {symbol: string}) => {
  const {src, handleError} = useTokenImage(symbol, 20);
  return (
    <Image
      src={src}
      alt={symbol}
      width={20}
      height={20}
      onError={handleError}
      className="rounded-full"
    />
  );
};

export default function PortfolioTable() {
  const holdings = usePortfolioStore((s) => s.holdings);
  const {data: mids} = useAllMids();

  const columns: TableColumn[] = [
    {key: "asset", header: "Asset"},
    {key: "qty", header: "Qty", className: "text-right"},
    {key: "mark", header: "Price", className: "text-right"},
    {key: "value", header: "Value", className: "text-right"},
    {key: "allocation", header: "% Allocation", className: "text-right"},
    {key: "change24h", header: "24h", className: "text-right"},
  ];

  const rows = useMemo(() => {
    const totalValue = Object.entries(holdings).reduce(
      (sum, [symbol, qty]) => sum + qty * (mids?.[symbol] ?? 0),
      0
    );

    return Object.entries(holdings).map(([symbol, qty]) => {
      const mark = mids?.[symbol] ?? 0;
      const value = qty * mark;
      const allocation = totalValue > 0 ? (value / totalValue) * 100 : 0;

      // Mocked 24h change 🧐
      const change24h = Math.random() * 20 - 10;
      const changeColor = change24h >= 0 ? "text-green-500" : "text-red-500";

      return {
        asset: (
          <div className="flex items-center gap-2">
            <TokenImage symbol={symbol} />
            <span className="font-medium">{symbol}</span>
          </div>
        ),
        qty: formatCryptoAmount(qty),
        mark: mark ? formatAssetPrice(mark) : "-",
        value: formatAssetPrice(value),
        allocation: `${allocation.toFixed(2)}%`,
        change24h: (
          <span className={changeColor}>
            {change24h >= 0 ? "+" : ""}
            {change24h.toFixed(1)}%
          </span>
        ),
        _searchSymbol: symbol,
      };
    });
  }, [holdings, mids]);

  const totalUsd = useMemo(() => {
    return Object.entries(holdings).reduce(
      (sum, [symbol, qty]) => sum + qty * (mids?.[symbol] ?? 0),
      0
    );
  }, [holdings, mids]);

  const footer = (
    <tr className="border-0">
      <td className="px-3 py-2 font-medium">Total</td>
      <td className="px-3 py-2 text-right"></td>
      <td className="px-3 py-2 text-right"></td>
      <td className="px-3 py-2 font-medium text-right">
        {formatAssetPrice(totalUsd)}
      </td>
      <td className="px-3 py-2 font-medium text-right">100%</td>
      <td className="px-3 py-2 text-right"></td>
    </tr>
  );

  return (
    <DataTable
      title="Portfolio"
      columns={columns}
      rows={rows}
      searchFields={["_searchSymbol"]}
      footer={footer}
      emptyText="No holdings"
    />
  );
}
