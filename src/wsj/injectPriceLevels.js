export const keys = [
  "volume",
  "volumeValue",
  "priceRangeDiff",
  "phaseAccumulation",
  "phaseDistribution",
  "pressureBuying",
  "pressureSelling",
];

export function injectPriceLevels(series = []) {
  const store = keys.reduce((r, k) => ({ ...r, [k]: {} }), {});

  for (const candle of series) {
    for (const key of keys) {
      if (
        candle[key] > store[key][key] ||
        (store[key][key] === undefined && typeof candle[key] === "number")
      ) {
        store[key] = candle;
      }
    }
    const priceLevels = Object.entries(store).reduce((r, [k, o]) => {
      return { ...r, [`${k}PriceLevel`]: o.priceClose };
    }, {});
    Object.assign(candle, priceLevels);
  }
}
