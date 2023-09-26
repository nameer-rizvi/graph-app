export function cleanSymbol(SYMBOL) {
  if (!SYMBOL?.trim()) throw new Error("Symbol is required");

  if (SYMBOL.toLowerCase() === "btc") SYMBOL = "BTC.X";

  return SYMBOL.toUpperCase().trim();
}
