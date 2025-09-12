"use client";

import {useEffect, useId, useState} from "react";

declare global {
  interface Window {
    TradingView?: {
      widget: new (opts: {
        symbol: string;
        container_id: string;
        autosize: boolean;
        theme: string;
        interval: string;
        timezone: string;
        style: string;
        locale: string;
        hide_top_toolbar: boolean;
        hide_legend: boolean;
        allow_symbol_change: boolean;
        studies: string[];
      }) => unknown;
    };
  }
}

type PriceChartProps = {
  baseSymbol?: string;
};

const PriceChart = ({baseSymbol}: PriceChartProps) => {
  const id = useId().replace(/:/g, "");
  const containerId = `tv_${id}`;
  const [isLoading, setIsLoading] = useState(true);

  const symbol = `BINANCE:${(baseSymbol || "ETH").toUpperCase()}USDT`;

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsLoading(true);
    const loadScript = () =>
      new Promise<void>((resolve) => {
        if (window.TradingView) return resolve();
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });

    let active = true;
    loadScript().then(() => {
      if (!active || !window.TradingView) return;

      const container = document.getElementById(containerId);
      if (container) container.innerHTML = "";

      new window.TradingView.widget({
        symbol,
        container_id: containerId,
        autosize: true,
        theme: "dark",
        interval: "60",
        timezone: "Etc/UTC",
        style: "1",
        locale: "en",
        hide_top_toolbar: false,
        hide_legend: false,
        allow_symbol_change: true,
        studies: [],
      });

      setTimeout(() => {
        if (active) setIsLoading(false);
      }, 1000);
    });

    return () => {
      active = false;
    };
  }, [symbol, containerId]);

  return (
    <div className="w-full h-full relative">
      <div id={containerId} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <div className="text-muted text-sm">
            Loading
            <span className="animate-pulse">...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceChart;
