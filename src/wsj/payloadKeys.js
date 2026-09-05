import settings from "./settings.json";

export const payloadKeys = [
  "volumeTrend", // Used by data card
  "date",
  "priceOpen",
  "priceClose",
  "priceHigh",
  "priceLow",
  "sma20PriceMean",
  "sma50PriceMean",
  "sma100PriceMean",
  "sma200PriceMean",
  "volumeN",
  "volumeValueN",
  "priceRangeDiffN",
  "sma10SignalSma20PriceMeanToPriceMean",
  "signalSma20PriceMeanToPriceClose",
  "signalSma20PriceMeanToPriceHigh",
  "signalSma20PriceMeanToPriceLow",
  "sma10SignalSma50PriceMeanToPriceMean",
  "signalSma50PriceMeanToPriceClose",
  "signalSma50PriceMeanToPriceHigh",
  "signalSma50PriceMeanToPriceLow",
  "anchor0",
  "phaseDistribution",
  "phaseAccumulation",
  "pressureBuying",
  "pressureSelling",
  ...(settings.ema ? ["ema5", "ema8", "ema13"] : []),
  ...(settings.fibonacci
    ? [
        "fibonacci0",
        "fibonacci236",
        "fibonacci382",
        "fibonacci5",
        "fibonacci618",
        "fibonacci786",
        "fibonacci1",
      ]
    : []),
  ...(settings.priceLevels
    ? [
        "volumePriceLevel",
        "phaseAccumulationPriceLevel",
        "phaseDistributionPriceLevel",
        "pressureBuyingPriceLevel",
        "pressureSellingPriceLevel",
        "volumeValuePriceLevel",
        "priceRangeDiffPriceLevel",
      ]
    : []),
];
