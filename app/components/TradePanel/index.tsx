"use client";

import Image from "next/image";
import {useState, useMemo} from "react";
import TokenAmount from "./TokenAmount";
import MoreInformation from "./MoreInformation";
import {useAllMids} from "@/app/hooks/useMarketData";
import {usePortfolioStore} from "@/app/store/portfolioStore";
import {formatCryptoAmount} from "@/app/lib/formatCurrency";

export default function TradePanel() {
  const {data: mids} = useAllMids();
  const recordSwap = usePortfolioStore((state) => state.recordSwap);
  const setHolding = usePortfolioStore((state) => state.setHolding);

  const [tokenState, setTokenState] = useState({
    payToken: "ETH",
    receiveToken: "BTC",
  });

  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");

  const handleTokenChange = (key: string, name: string) => {
    setTokenState((ts) => ({...ts, [key]: name}));
    setPayAmount("");
    setReceiveAmount("");
  };

  const handleSwapTokens = () => {
    setTokenState((ts) => ({
      payToken: ts.receiveToken,
      receiveToken: ts.payToken,
    }));
    setPayAmount(receiveAmount);
    setReceiveAmount(payAmount);
  };

  const rateText = useMemo(() => {
    const base = mids?.[tokenState.payToken];
    const quote = mids?.[tokenState.receiveToken];

    if (!base || !quote) return "";

    const rate = base / quote;
    const decimals = rate >= 1 ? 4 : 6;
    return `${rate.toFixed(decimals)} ${tokenState.receiveToken}`;
  }, [mids, tokenState.payToken, tokenState.receiveToken]);

  useMemo(() => {
    const payPrice = mids?.[tokenState.payToken];
    const receivePrice = mids?.[tokenState.receiveToken];

    if (!payAmount || !payPrice || !receivePrice) return setReceiveAmount("");

    const calculatedReceive = (parseFloat(payAmount) * payPrice) / receivePrice;
    setReceiveAmount(formatCryptoAmount(calculatedReceive));
  }, [payAmount, mids, tokenState.payToken, tokenState.receiveToken]);

  const canSwap =
    payAmount &&
    parseFloat(payAmount) > 0 &&
    receiveAmount &&
    parseFloat(receiveAmount) > 0;

  const handleSwap = () => {
    if (!canSwap) return;

    recordSwap({
      fromSymbol: tokenState.payToken,
      toSymbol: tokenState.receiveToken,
      fromAmount: parseFloat(payAmount),
      toAmount: parseFloat(receiveAmount),
    });

    setPayAmount("");
    setReceiveAmount("");
  };

  return (
    <section className="card p-4 sm:p-5 w-full max-w-md mx-auto">
      <div className="mt-4">
        <TokenAmount
          cardText="Pay with"
          token={tokenState.payToken}
          excluded={tokenState.receiveToken}
          value={payAmount}
          onChange={setPayAmount}
          onTokenChange={(name) => handleTokenChange("payToken", name)}
        />

        <div className="flex justify-center -my-3">
          <button
            className="button rounded-full border border-border bg-surface size-8 grid place-items-center z-10"
            onClick={handleSwapTokens}
            aria-label="Swap tokens"
          >
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
          value={receiveAmount}
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
          disabled={!canSwap}
          onClick={handleSwap}
          className="button mt-4 w-full text-sm rounded-lg bg-success text-background h-10 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{canSwap ? "Swap" : "Enter an amount to swap"}</span>
        </button>

        <MoreInformation />
      </div>
    </section>
  );
}
