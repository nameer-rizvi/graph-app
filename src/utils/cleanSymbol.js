export function cleanSymbol(symbol) {
  if (!symbol?.trim()) throw new Error("Symbol is required");

  symbol = symbol.toUpperCase().trim().split(" ")[0];

  return symbol === "BTC" || symbol === "BTCUSD" ? "BTC.X" : symbol;
}
