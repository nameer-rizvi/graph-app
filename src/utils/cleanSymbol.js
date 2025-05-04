export function cleanSymbol(symbol) {
  if (!symbol?.trim()) throw new Error("Symbol is required");

  symbol =
    symbol.toUpperCase().trim().split(" ")[0]?.replace(".X", "USD") || "";

  const currencies = [
    "BTC",
    "ETH",
    "USDT",
    "XRP",
    "SOL",
    "USDC",
    "DOGE",
    "ADA",
    "TRX",
    "SUI",
    "LINK",
    "SHIB",
    "BCH",
    "DOT",
    "DAI",
    "ONDO",
    "TRUMP",
  ];

  if (currencies.includes(symbol)) return `${symbol}USD`;

  return symbol;
}
