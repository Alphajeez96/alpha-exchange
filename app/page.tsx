"use client";

import {ComponentType, useState} from "react";
import TradePanel from "./components/TradePanel";
import PriceChart from "./components/PriceChart";
import PortfolioTable from "./components/Table/PortfolioTable";
import TransactionHistoryTable from "./components/Table/TransactionHistoryTable";

export default function Home() {
  const [payToken, setPayToken] = useState("ETH");
  const tables: {title: string; component: ComponentType}[] = [
    {title: "Portfolio", component: PortfolioTable},
    {title: "Transaction History", component: TransactionHistoryTable},
  ];
  return (
    <div className="min-h-screen p-6 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Alpha Exchange</h1>
        </header>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TradePanel onTokenChange={setPayToken} />
          <div className="lg:col-span-2 rounded-lg border border-border bg-surface p-4">
            <PriceChart baseSymbol={payToken} />
          </div>
        </section>

        <section className="space-y-6 mb-10">
          {tables.map(({title, component: Component}) => (
            <div
              key={title}
              className="rounded-lg border border-border bg-surface p-3"
            >
              <div className="max-h-136 overflow-y-auto">
                <Component />
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
