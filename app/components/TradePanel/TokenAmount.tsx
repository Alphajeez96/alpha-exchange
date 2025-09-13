"use client";
import {clsx} from "clsx";
import Image from "next/image";
import AssetSelector from "./AssetSelector";
import {useEffect, useRef, useState} from "react";
import {useAllMids} from "@/app/hooks/useMarketData";
import {useTokenImage} from "@/app/hooks/useTokenImage";
import {useAmountInput} from "@/app/hooks/useAmountInput";
import {formatAssetPrice} from "@/app/lib/formatCurrency";

interface TokenAmountProps {
  token: string;
  cardText: string;
  excluded?: string;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onTokenChange: (name: string) => void;
}

const TokenAmount = ({
  token,
  cardText,
  disabled,
  excluded,
  onTokenChange,
  placeholder = "0",
  value: externalValue,
  onChange,
}: TokenAmountProps) => {
  const {data: mids} = useAllMids();
  const [open, setOpen] = useState(false);
  const {src, handleError} = useTokenImage(token);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    normalize,
    handleBlur,
    handleChange,
    handleKeyDown,
    value: internalValue,
  } = useAmountInput();
  const value = externalValue ?? internalValue;

  const handleInputChange = (newValue: string) => {
    if (!externalValue) handleChange(newValue);
    onChange?.(newValue);
  };

  const handleInputBlur = () => {
    const next = normalize(value ?? "");
    if (next !== value) handleInputChange(next);
    handleBlur();
  };

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    const {signal} = controller;

    const onPointerDown = (e: Event) => {
      const target = e.target as Node | null;
      if (
        containerRef.current &&
        target &&
        !containerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown, {signal});
    document.addEventListener("pointerdown", onPointerDown, {signal});
    return () => controller.abort();
  }, [open]);

  const handleSelection = (name: string) => {
    onTokenChange(name);
    setOpen(false);
  };

  return (
    <div className="relative rounded-lg border border-border bg-surface-muted p-4 space-y-3">
      <label htmlFor={token} className="text-sm text-muted pb-1.5">
        {cardText}
      </label>

      <div className="flex items-center justify-between relative">
        <input
          id={token}
          type="text"
          value={value}
          inputMode="decimal"
          disabled={disabled}
          className="number-input"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          onChange={(e) => handleInputChange(e.target.value)}
        />

        <div ref={containerRef} className="relative">
          <button
            className="button ml-3 inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-2 text-sm relative"
            onClick={() => setOpen((open) => !open)}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={`asset-selector-${token}`}
          >
            <Image
              src={src}
              alt={token}
              width={20}
              height={20}
              onError={handleError}
            />
            <span>{token}</span>
            <Image
              src="/caret-down.svg"
              alt="Open"
              width={14}
              height={14}
              className={clsx("caret-down", open && "is-open")}
            />
          </button>

          <div className="absolute right-0 top-full z-20">
            <AssetSelector
              open={open}
              excluded={excluded}
              onClose={() => setOpen(false)}
              onSelect={(name) => handleSelection(name)}
            />
          </div>
        </div>
      </div>

      <div className="text-xs text-muted h-3.5 relative overflow-hidden">
        <span
          className={clsx(
            "block absolute transition-transform duration-300 ease-in-out translate-y-3",
            value && parseFloat(value) > 0 && "!translate-y-0"
          )}
        >
          {!value || parseFloat(value) === 0
            ? "$0.00"
            : `≈${formatAssetPrice(parseFloat(value) * (mids?.[token] ?? 0))}`}
        </span>
      </div>
    </div>
  );
};
export default TokenAmount;
