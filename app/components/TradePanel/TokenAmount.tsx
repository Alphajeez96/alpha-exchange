"use client";
import Image from "next/image";
import {useState, useCallback, useEffect} from "react";
import {createFallbackImg} from "@/app/lib/createFallbackImg";

interface TokenAmountProps {
  token: string;
  cardText: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function TokenAmount({
  token,
  cardText,
  disabled,
  placeholder = "0",
}: TokenAmountProps) {
  const tokenCdnUrl = `https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/128/color/${token.toLowerCase()}.png`;
  const [src, setSrc] = useState<string>(tokenCdnUrl);

  const handleError = useCallback(() => {
    const dataUrl = createFallbackImg(token);
    if (dataUrl) setSrc(dataUrl);
  }, [token]);

  useEffect(() => {
    setSrc(tokenCdnUrl);
  }, [tokenCdnUrl]);
  return (
    <div className="relative rounded-lg border border-border bg-surface-muted p-4 space-y-3">
      <label htmlFor={token} className="text-sm text-muted pb-1.5">
        {cardText}
      </label>
      <div className="flex items-center justify-between">
        <input
          id={token}
          disabled={disabled}
          className="bg-transparent text-2xl outline-none w-full max-w-3/5 placeholder:text-muted"
          placeholder={placeholder}
        />
        <button className="button ml-3 inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-2 text-sm">
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
      </div>
      <div className="text-xs text-muted">~$0</div>
    </div>
  );
}
