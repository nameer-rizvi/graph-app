export function cleanSymbol(SYMBOL) {
  if (!SYMBOL?.trim()) throw new Error("Symbol is required");

  SYMBOL = SYMBOL.toUpperCase().trim().split(" ")[0];

  return SYMBOL === "BTC" || SYMBOL === "BTCUSD" ? "BTC.X" : SYMBOL;
}
