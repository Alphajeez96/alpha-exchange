"use client";

import Image from "next/image";
import {useState, useMemo} from "react";
import TokenAmount from "./TokenAmount";
import MoreInformation from "./MoreInformation";
import {useAllMids} from "@/app/hooks/useMarketData";

export default function TradePanel() {
  const {data: mids} = useAllMids();

  const [tokenState, setTokenState] = useState({
    payToken: "ETH",
    receiveToken: "BTC",
  });

  const handleTokenChange = (key: string, name: string) => {
    setTokenState((ts) => ({...ts, [key]: name}));
  };

  const rateText = useMemo(() => {
    const base = mids?.[tokenState.payToken];
    const quote = mids?.[tokenState.receiveToken];

    if (!base || !quote) return "";

    const rate = base / quote;
    const decimals = rate >= 1 ? 4 : 6;
    return `${rate.toFixed(decimals)} ${tokenState.receiveToken}`;
  }, [mids, tokenState.payToken, tokenState.receiveToken]);

  return (
    <section className="card p-4 sm:p-5 w-full max-w-md mx-auto">
      <div className="mt-4">
        <TokenAmount
          cardText="Pay with"
          token={tokenState.payToken}
          excluded={tokenState.receiveToken}
          onTokenChange={(name) => handleTokenChange("payToken", name)}
        />

        <div className="flex justify-center -my-3">
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

        <TokenAmount
          disabled
          cardText="Receive in"
          token={tokenState.receiveToken}
          excluded={tokenState.payToken}
          onTokenChange={(name) => handleTokenChange("receiveToken", name)}
        />

        <div className="mt-3 flex items-center justify-between text-xs">
          {rateText && (
            <div className="text-success">
              1 {tokenState.payToken} = {rateText}
            </div>
          )}
          <div className="flex items-center gap-3 text-muted">
            <span className="i-heroicons-arrow-path-20-solid" />
            <span className="i-heroicons-bell-alert-20-solid" />
          </div>
        </div>

        <button
          disabled={true}
          className="button mt-4 w-full text-sm rounded-lg bg-success text-background h-10 font-semibold"
        >
          <span> Enter an amount to swap </span>
        </button>

        <MoreInformation />
      </div>
    </section>
  );
}
