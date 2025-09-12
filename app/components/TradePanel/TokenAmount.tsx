"use client";
import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import {useTokenImage} from "@/app/hooks/useTokenImage";
import AssetSelector from "./AssetSelector";

interface TokenAmountProps {
  token: string;
  cardText: string;
  disabled?: boolean;
  placeholder?: string;
}

const TokenAmount = ({
  token,
  cardText,
  disabled,
  placeholder = "0",
}: TokenAmountProps) => {
  const [open, setOpen] = useState(false);
  const {src, handleError} = useTokenImage(token);
  const containerRef = useRef<HTMLDivElement>(null);

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

    document.addEventListener("pointerdown", onPointerDown, {signal});
    document.addEventListener("keydown", onKeyDown, {signal});
    return () => controller.abort();
  }, [open]);

  return (
    <div className="relative rounded-lg border border-border bg-surface-muted p-4 space-y-3">
      <label htmlFor={token} className="text-sm text-muted pb-1.5">
        {cardText}
      </label>
      <div className="flex items-center justify-between relative">
        <input
          id={token}
          disabled={disabled}
          className="bg-transparent text-2xl outline-none w-full max-w-3/5 placeholder:text-muted"
          placeholder={placeholder}
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
              className="caret-down"
            />
          </button>
          <div className="absolute right-0 top-full z-20">
            <AssetSelector
              open={open}
              onClose={() => setOpen(false)}
              onSelect={() => setOpen(false)}
            />
          </div>
        </div>
      </div>
      <div className="text-xs text-muted">~$0</div>
    </div>
  );
};
export default TokenAmount;
