"use client";
import {useCallback, useEffect, useState} from "react";
import {createFallbackImg} from "@/app/lib/createFallbackImg";
export const useTokenImage = (symbol: string, size = 20) => {
  const cdn = `https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/128/color/${symbol.toLowerCase()}.png`;
  const [src, setSrc] = useState<string>(cdn);

  useEffect(() => {
    setSrc(cdn);
  }, [cdn]);

  const handleError = useCallback(() => {
    const dataUrl = createFallbackImg(symbol, {size});
    if (dataUrl) setSrc(dataUrl);
  }, [symbol, size]);

  return {src, handleError};
};
