"use client";
import Image from "next/image";
import {useMemo, useState} from "react";
import {Token} from "@/app/lib/hyperliquid/types";
import {motion, AnimatePresence} from "motion/react";
import {useTokenImage} from "@/app/hooks/useTokenImage";
import {useAllMids, useMeta} from "@/app/hooks/useMarketData";
import {formatAssetPrice} from "@/app/lib/formatCurrency";

interface AssetSelectorProps {
  open: boolean;
  excluded?: string;
  onClose: () => void;
  onSelect: (symbol: string) => void;
}
const AssetSelector = ({
  open,
  onClose,
  onSelect,
  excluded,
}: AssetSelectorProps) => {
  const {data: meta} = useMeta();
  const {data: mids} = useAllMids();
  const [query, setQuery] = useState("");

  const coinOptions = useMemo(() => {
    return (meta?.universe ?? [])
      .map((token) => ({
        ...token,
        name: token?.name ?? "",
        price: mids?.[token?.name] ?? 0,
      }))
      .filter((token) => !token.isDelisted && token.name !== excluded);
  }, [mids, meta?.universe, excluded]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return coinOptions;
    return coinOptions.filter((token) => token.name.toLowerCase().includes(q));
  }, [query, coinOptions]);

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
                key={token.name}
                token={token}
                onClick={() => {
                  onSelect(token.name);
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
  const {src, handleError} = useTokenImage(token.name, 16);
  return (
    <button
      onClick={onClick}
      className="button w-full flex items-center gap-2 p-2 text-sm bg-transparent hover:opacity-75 active:scale-100"
    >
      <Image
        src={src}
        width={16}
        height={16}
        alt={token.name}
        onError={handleError}
      />
      <span className="font-medium">{token.name}</span>
      <span className="text-muted">{formatAssetPrice(token.price)}</span>
    </button>
  );
};

export default AssetSelector;
