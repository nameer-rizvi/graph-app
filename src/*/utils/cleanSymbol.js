import simpul from "simpul";
import futures from "../wsj/futures.json";

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

  if (clean.startsWith("/")) {
    const future = futures.find((f) => f.code === clean.slice(1).toLowerCase());
    if (future?.wsj) {
      return future.wsj + "00";
    } else {
      throw new Error(`Config for futures code ("${clean}") does not exist.`);
    }
  }

  return clean;
}
