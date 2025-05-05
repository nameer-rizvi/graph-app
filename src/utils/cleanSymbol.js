import simpul from "simpul";

export function cleanSymbol(dirty) {
  if (!simpul.isStringValid(dirty)) throw new Error("Symbol is required");

  const clean = simpul
    .trim(dirty, " ")
    .split(" ")[0]
    .toUpperCase()
    .replace("-", ".")
    .replace(".X", "USD");

  const cryptocurrencies = [
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

  if (cryptocurrencies.includes(clean)) return `${clean}USD`;

  return clean;
}
