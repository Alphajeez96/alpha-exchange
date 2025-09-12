import {
  QUERYKEYS,
  type Candle,
  type MidMap,
  type Interval,
  type MetaResponse,
} from "./types";

const BASE_URL = "https://api.hyperliquid.xyz/info";
type Body = Record<string, unknown>;

async function postJson<TResponse>(
  body: Body,
  signal?: AbortSignal
): Promise<TResponse> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body),
    signal,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Hyperliquid error ${res.status}: ${text}`);
  }
  return (await res.json()) as TResponse;
}

export const hyperliquidClient = {
  allMids: (signal?: AbortSignal) =>
    postJson<MidMap>({type: QUERYKEYS.ALL_MIDS}, signal),

  meta: (signal?: AbortSignal) =>
    postJson<MetaResponse>({type: QUERYKEYS.META}, signal),

  candleSnapshot: (
    coin: string,
    interval: Interval,
    startTime: number,
    signal?: AbortSignal
  ) =>
    postJson<Candle[]>(
      {
        type: QUERYKEYS.CANDLE_SNAPSHOT,
        req: {coin, interval, startTime},
      },
      signal
    ),
};
