"use client";
import Image from "next/image";
import {useMemo, useState} from "react";
import {motion, AnimatePresence} from "motion/react";
import {useTokenImage} from "@/app/hooks/useTokenImage";

type Token = {symbol: string; name: string};

const SAMPLE_TOKENS: Token[] = [
  {symbol: "ETH", name: "Ethereum"},
  {symbol: "USDT", name: "Tether"},
  {symbol: "USDC", name: "USD Coin"},
  {symbol: "BTC", name: "Bitcoin"},
  {symbol: "ARB", name: "Arbitrum"},
];

interface AssetSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (symbol: string) => void;
}

const AssetSelector = ({open, onClose, onSelect}: AssetSelectorProps) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_TOKENS;
    return SAMPLE_TOKENS.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <AnimatePresence mode="wait">
      {open ? (
        <motion.div
          key="asset-selector"
          initial={{opacity: 0, y: 6}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: 6}}
          transition={{duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94]}}
          className="mt-1.5 w-64 rounded-lg border border-border bg-surface shadow-lg p-2"
          role="listbox"
        >
          <input
            autoFocus
            value={query}
            placeholder="Search token"
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md bg-surface-muted border border-border px-2 py-1.5 text-sm outline-none"
          />
          <div className="mt-2 max-h-60 overflow-auto divide-y divide-border/60">
            {filtered.map((token) => (
              <TokenRow
                key={token.symbol}
                token={token}
                onClick={() => {
                  onSelect(token.symbol);
                  onClose();
                }}
              />
            ))}
            {!filtered.length && (
              <div className="p-3 text-xs text-muted">No tokens found</div>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

const TokenRow = ({token, onClick}: {token: Token; onClick: () => void}) => {
  const {src, handleError} = useTokenImage(token.symbol, 16);
  return (
    <button
      onClick={onClick}
      className="button w-full flex items-center gap-2 p-2 text-sm bg-transparent hover:opacity-75 active:scale-100"
    >
      <Image
        src={src}
        width={16}
        height={16}
        alt={token.symbol}
        onError={handleError}
      />
      <span className="font-medium">{token.symbol}</span>
      <span className="text-muted">{token.name}</span>
    </button>
  );
};

export default AssetSelector;
