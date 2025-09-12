export const formatNumber = (
  value: number,
  options: {
    showSymbol?: boolean;
  } = {}
): string => {
  const {showSymbol = true} = options;

  if (value === 0) {
    return showSymbol ? "$0.00" : "0";
  }

  const isLargeValue = value >= 1;
  const minimumFractionDigits = showSymbol ? 2 : 0;
  const maximumFractionDigits = isLargeValue ? 4 : 8;

  const formatter = new Intl.NumberFormat("en-US", {
    style: showSymbol ? "currency" : "decimal",
    currency: "USD",
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return formatter.format(value);
};

export const formatAssetPrice = (price: number): string => formatNumber(price);
export const formatCryptoAmount = (amount: number): string =>
  formatNumber(amount, {showSymbol: false});
