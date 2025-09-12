"use client";

import {useQuery} from "@tanstack/react-query";
import {hyperliquidClient} from "@/app/lib/hyperliquid/client";
import {
  QUERYKEYS,
  type MidMap,
  type Candle,
  type Interval,
  type MetaResponse,
} from "@/app/lib/hyperliquid/types";

const REFRESH_MS = 2_000;

export const useAllMids = () => {
  return useQuery<MidMap>({
    queryKey: [QUERYKEYS.ALL_MIDS],
    queryFn: ({signal}) => hyperliquidClient.allMids(signal),
    refetchInterval: REFRESH_MS,
    staleTime: 1_000,
  });
};

export const useMeta = () => {
  return useQuery<MetaResponse>({
    queryKey: [QUERYKEYS.META],
    queryFn: ({signal}) => hyperliquidClient.meta(signal),
    staleTime: 60_000,
  });
};

export const useCandles = (
  asset: string,
  interval: Interval,
  startTime: number
) => {
  return useQuery<Candle[]>({
    queryKey: [QUERYKEYS.CANDLE_SNAPSHOT, asset, interval, startTime],
    queryFn: ({signal}) =>
      hyperliquidClient.candleSnapshot(asset, interval, startTime, signal),
    staleTime: 10_000,
  });
};
