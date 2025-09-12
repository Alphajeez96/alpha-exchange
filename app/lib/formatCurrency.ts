const formatCurrency = (
  value: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSymbol?: boolean;
  } = {}
): string => {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 8,
    showSymbol = true,
  } = options;

  const formatter = new Intl.NumberFormat("en-US", {
    style: showSymbol ? "currency" : "decimal",
    currency: "USD",
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return formatter.format(value);
};

export const formatAssetPrice = (price: number): string => {
  if (price === 0) return "$0.00";

  return formatCurrency(price, {
    minimumFractionDigits: 2,
    maximumFractionDigits: price >= 1 ? 4 : 8,
  });
};
