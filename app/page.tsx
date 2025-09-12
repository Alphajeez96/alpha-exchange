// import Image from "next/image";
import {ComponentType} from "react";
import TradePanel from "./components/TradePanel";
import PortfolioTable from "./components/Table/PortfolioTable";
import SwapHistoryTable from "./components/Table/SwapHistoryTable";

export default function Home() {
  const tables: {title: string; component: ComponentType}[] = [
    {title: "Portfolio", component: PortfolioTable},
    {title: "Transaction History", component: SwapHistoryTable},
  ];
  return (
    <div className="min-h-screen p-6 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Alpha Exchange</h1>
        </header>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TradePanel />
          <div className="lg:col-span-2 rounded-lg border border-border bg-surface p-4">
            {/* <PriceChart /> */}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tables.map(({title, component: Component}) => (
            <div
              key={title}
              className="rounded-lg border border-border bg-surface p-3"
            >
              <h3 className="text-sm font-medium mb-2">{title}</h3>
              <Component />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
