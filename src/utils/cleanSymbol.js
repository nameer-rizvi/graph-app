export function cleanSymbol(symbol) {
  if (!symbol?.trim()) throw new Error("Symbol is required");

  symbol = symbol.toUpperCase().trim().split(" ")[0];

  if (symbol === "BTC" || symbol === "BTCUSD") {
    return "BTC.X";
  } else if (symbol === "ETH" || symbol === "ETHUSD") {
    return "ETH.X";
  } else {
    return symbol;
  }
}
