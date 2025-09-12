"use client";

import {create} from "zustand";
import {persist} from "zustand/middleware";

export type HoldingMap = Record<string, number>;

export type SwapRecord = {
  id: string;
  time: number;
  fromSymbol: string;
  toSymbol: string;
  fromAmount: number;
  toAmount: number;
};

type PortfolioState = {
  holdings: HoldingMap;
  history: SwapRecord[];
};

type PortfolioActions = {
  recordSwap: (params: {
    fromSymbol: string;
    toSymbol: string;
    fromAmount: number;
    toAmount: number;
  }) => void;
  setHolding: (symbol: string, quantity: number) => void;
  reset: () => void;
};

export type PortfolioStore = PortfolioState & PortfolioActions;

const generateHash = () => {
  const chars = "0123456789abcdef";
  let result = "0x";
  for (let i = 0; i < 16; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set) => ({
      holdings: {},
      history: [],

      recordSwap: ({fromSymbol, toSymbol, fromAmount, toAmount}) =>
        set((state) => {
          if (fromAmount <= 0 || toAmount <= 0) return state;
          const holdings = {...state.holdings};
          holdings[fromSymbol] = Math.max(
            0,
            (holdings[fromSymbol] ?? 0) - fromAmount
          );
          holdings[toSymbol] = (holdings[toSymbol] ?? 0) + toAmount;

          const record: SwapRecord = {
            id: generateHash(),
            time: Date.now(),
            fromSymbol,
            toSymbol,
            fromAmount,
            toAmount,
          };

          return {holdings, history: [record, ...state.history]};
        }),

      setHolding: (symbol, quantity) => {
        set((state) => ({holdings: {...state.holdings, [symbol]: quantity}}));
      },

      reset: () => set({holdings: {}, history: []}),
    }),
    {name: "alphaex-portfolio-store", version: 1}
  )
);
