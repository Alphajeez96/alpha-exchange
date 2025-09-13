"use client";
import {useCallback, useState} from "react";

interface useAmountInputOptions {
  maxDecimals?: number;
  allowZero?: boolean;
  maxValue?: number;
}

export const useAmountInput = ({
  maxDecimals = 12,
  allowZero = true,
  maxValue,
}: useAmountInputOptions = {}) => {
  const [value, setValue] = useState("");

  const validateInput = useCallback(
    (input: string): string => {
      let cleaned = "";
      for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if ((char >= "0" && char <= "9") || char === ".") {
          cleaned += char;
        }
      }

      // Prevent multiple decimal points
      const firstDecimalIndex = cleaned.indexOf(".");
      if (firstDecimalIndex !== -1) {
        const afterDecimal = cleaned.substring(firstDecimalIndex + 1);

        let decimalCount = 0;
        for (let i = 0; i < afterDecimal.length; i++) {
          if (afterDecimal[i] === ".") {
            decimalCount++;
          }
        }
        if (decimalCount > 0) {
          let result = cleaned.substring(0, firstDecimalIndex + 1);
          for (let i = 0; i < afterDecimal.length; i++) {
            if (afterDecimal[i] !== ".") {
              result += afterDecimal[i];
            }
          }
          cleaned = result;
        }
      }

      // Prevent leading zeros
      if (cleaned.length > 1 && cleaned[0] === "0" && cleaned[1] !== ".") {
        let startIndex = 0;
        while (startIndex < cleaned.length - 1 && cleaned[startIndex] === "0") {
          startIndex++;
        }
        cleaned = cleaned.substring(startIndex);
      }

      // Limit decimal places
      if (cleaned.includes(".")) {
        const [integer, decimal] = cleaned.split(".");
        if (decimal.length > maxDecimals) {
          cleaned = `${integer}.${decimal.substring(0, maxDecimals)}`;
        }
      }

      if (maxValue !== undefined && cleaned !== "" && cleaned !== ".") {
        const num = Number(cleaned);
        if (!Number.isNaN(num) && num > maxValue) {
          return String(maxValue);
        }
      }

      if (cleaned === "" || cleaned === ".") return allowZero ? "0" : "";
      if (cleaned === "00") return "0";

      return cleaned;
    },
    [maxDecimals, allowZero, maxValue]
  );

  const handleChange = useCallback(
    (inputValue: string) => {
      const validated = validateInput(inputValue);
      setValue(validated);
    },
    [validateInput]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const char = e.key;
      if (
        [
          "Backspace",
          "Delete",
          "Tab",
          "Escape",
          "Enter",
          "Home",
          "End",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
        ].includes(char)
      ) {
        return;
      }

      if (
        (e.ctrlKey || e.metaKey) &&
        ["a", "c", "v", "x", "z"].includes(char.toLowerCase())
      ) {
        return;
      }

      if (char === "." && !value.includes(".")) return;

      if (char === "0" && value === "0") {
        e.preventDefault();
        return;
      }

      if (char < "0" || char > "9") e.preventDefault();
    },
    [value]
  );

  const handleBlur = useCallback(() => {
    if (!value) return;
    let next = value;

    if (next.endsWith(".")) {
      next = next.slice(0, -1);
    }

    if (next.startsWith(".")) {
      next = `0${next}`;
    }
    const normalized = validateInput(next);
    if (normalized !== value) setValue(normalized);
  }, [value, validateInput]);

  return {
    value,
    handleChange,
    handleKeyDown,
    handleBlur,
    setValue,
    normalize: validateInput,
  };
};
