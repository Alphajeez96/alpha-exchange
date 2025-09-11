// import Image from "next/image";
import TradePanel from "./components/TradePanel";

export default function Home() {
  return (
    <div className="min-h-screen p-6 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            Alpha Exchange — Paper Trading
          </h1>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TradePanel />
          <div className="lg:col-span-2 rounded-lg border border-border bg-surface p-4">
            {/* <PriceChart /> */}
          </div>
        </section>
      </div>
    </div>
  );
}
