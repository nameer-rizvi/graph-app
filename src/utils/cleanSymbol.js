import simpul from "simpul";
import futures from "../wsj/futures.json";

export function cleanSymbol(dirty) {
  if (!simpul.isStringNonEmpty(dirty)) return;

  const clean = simpul.trim(dirty, " ").split(" ")[0].toUpperCase();

  const cryptocurrencies = [
    "ADA",
    "BCH",
    "BONK",
    "BTC",
    "DAI",
    "DOGE",
    "DOT",
    "ETH",
    "LINK",
    "ONDO",
    "SHIB",
    "SOL",
    "SUI",
    "TRUMP",
    "TRX",
    "USDC",
    "USDT",
    "XRP",
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
