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
    {key: "qty", header: "Qty"},
    {key: "mark", header: "Mark"},
    {key: "value", header: "Value"},
  ];

  const rows = useMemo(() => {
    return Object.entries(holdings).map(([symbol, qty]) => {
      const mark = mids?.[symbol] ?? 0;
      const value = qty * mark;
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
      <td className="px-3 py-2"></td>
      <td className="px-3 py-2"></td>
      <td className="px-3 py-2 font-medium">{formatAssetPrice(totalUsd)}</td>
    </tr>
  );

  return (
    <DataTable
      columns={columns}
      rows={rows}
      footer={footer}
      emptyText="No holdings"
    />
  );
}
