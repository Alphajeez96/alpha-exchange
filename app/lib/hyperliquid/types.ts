export type MidMap = Record<string, number>;
export type Interval = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

export interface CoinMeta {
  name: string;
  szDecimals: number;
  maxLeverage: number;
  isDelisted?: boolean;
}

export interface Token {
  name: string;
  price: number;
  isDelisted?: boolean;
  szDecimals?: number;
  maxLeverage?: number;
}

export interface MetaResponse {
  universe?: Token[];
  marginTables?: unknown[];
  coins?: CoinMeta[];
}

export interface Candle {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v?: number;
}

export enum QUERYKEYS {
  META = "meta",
  ALL_MIDS = "allMids",
  CANDLE_SNAPSHOT = "candleSnapshot",
}
