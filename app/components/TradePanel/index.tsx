import Image from "next/image";
import TokenAmount from "./TokenAmount";
import MoreInformation from "./MoreInformation";

export default function TradePanel() {
  return (
    <section className="card p-4 sm:p-5 w-full max-w-md mx-auto">
      <div className="mt-4">
        <TokenAmount token="ETH" />

        <div className="flex justify-center -my-2">
          <button className="button rounded-full border border-border bg-surface size-8 grid place-items-center z-10">
            <Image
              src="/toggle-arrow.svg"
              width={20}
              height={20}
              alt="Toggle"
              className="ml-[3px] mt-[2px] hover:opacity-80"
            />
          </button>
        </div>

        <TokenAmount token="USDT" />

        <div className="mt-3 flex items-center justify-between text-xs">
          <div className="text-success">1 ETH = 1861.7 USDT</div>
          <div className="flex items-center gap-3 text-muted">
            <span className="i-heroicons-arrow-path-20-solid" />
            <span className="i-heroicons-bell-alert-20-solid" />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <button className="rounded-md bg-success/15 text-success border border-success/30 py-2 font-medium">
            Maximum Return
          </button>
          <button className="rounded-md bg-surface border border-border py-2 text-muted">
            Lowest Gas
          </button>
        </div>

        <MoreInformation />

        <button className="mt-4 w-full rounded-md bg-success text-black py-2 font-medium">
          CONNECT WALLET
        </button>
      </div>
    </section>
  );
}
