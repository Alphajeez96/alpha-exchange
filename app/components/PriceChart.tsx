"use client";

import {useEffect, useId} from "react";

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

  const symbol = `BINANCE:${(baseSymbol || "ETH").toUpperCase()}USDT`;

  useEffect(() => {
    if (typeof window === "undefined") return;

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
    });

    return () => {
      active = false;
    };
  }, [symbol, containerId]);

  return (
    <div className="w-full h-full">
      <div id={containerId} className="w-full h-full" />
    </div>
  );
};

export default PriceChart;
