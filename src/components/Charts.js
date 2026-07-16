import { useDataStore } from "../hooks";
import { useState } from "react";
import { Chart } from "./Chart";

function initialize(configs = []) {
  return configs.map((c) => {
    const defaultConfig = defaultConfigs.find((d) => c?.title === d?.title);
    return { ...c, seriesConfigs: defaultConfig?.seriesConfigs || [] };
  });
}

const defaultConfigs = [
  {
    show: true,
    title: "Price: Close, High, Low, SMA(20/50), SMA(100/200)",
    seriesConfigs: [
      ["priceClose", "Close", "#78909c", ["$"]],
      ["priceHigh", "High", "#33691e", ["$"]],
      ["priceLow", "Low", "#880e4f", ["$"]],
      ["sma20PriceMean", "SMA(20)", "#1b2429", ["$"]],
      ["sma50PriceMean", "SMA(50)", "#1b2429", ["$"]],
      ["sma100PriceMean", "SMA(100)", "#4a148c", ["$"]],
      ["sma200PriceMean", "SMA(200)", "#4a148c", ["$"]],
      ["ema5", "EMA5", "#f57c00", ["$"]],
      ["ema8", "EMA8", "#ef6c00", ["$"]],
      ["ema13", "EMA13", "#e65100", ["$"]],
      ["fibonacci0", "Fibonacci 0", "#ffb74d", ["$"]],
      ["fibonacci236", "Fibonacci .236", "#ffa726", ["$"]],
      ["fibonacci382", "Fibonacci .382", "#ff9800", ["$"]],
      ["fibonacci5", "Fibonacci .5", "#fb8c00", ["$"]],
      ["fibonacci618", "Fibonacci .618", "#f57c00", ["$"]],
      ["fibonacci786", "Fibonacci .786", "#ef6c00", ["$"]],
      ["fibonacci1", "Fibonacci 1", "#e65100", ["$"]],
      ["volumePriceLevel", "PL: Volume", "#05275b", ["$"]],
      ["pressureBuyingPriceLevel", "PL: Buying", "#50082e", ["$"]],
      ["pressureSellingPriceLevel", "PL: Selling", "#1f4113", ["$"]],
      ["volumeValuePriceLevel", "PL: Value", "#101655", ["$"]],
      ["priceRangeDiffPriceLevel", "PL: Volatility", "#141b1f", ["$"]],
    ],
  },
  {
    show: true,
    title: "Trade: Volume, Value, Volatility",
    min: 0,
    max: 100,
    seriesConfigs: [
      ["volumeN", "Volume", "#0d47a1", []],
      ["volumeValueN", "Value", "#1a237e", []],
      ["priceRangeDiffN", "Volatility", "#1b2429", []],
    ],
  },
  {
    show: true,
    title: "Oscillator: Close, High, Low, Mean",
    seriesConfigs: [
      ["sma10SignalSma20PriceMeanToPriceMean", "SMA(20) SMA", "#b0bec5", []],
      ["signalSma20PriceMeanToPriceClose", "SMA(20) Signal", "#78909c", []],
      ["signalSma20PriceMeanToPriceHigh", "SMA(20) Signal High", "#33691e", []],
      ["signalSma20PriceMeanToPriceLow", "SMA(20) Signal Low", "#880e4f", []],
      ["sma10SignalSma50PriceMeanToPriceMean", "SMA(50) SMA", "#b0bec5", []],
      ["signalSma50PriceMeanToPriceClose", "SMA(50) Signal", "#78909c", []],
      ["signalSma50PriceMeanToPriceHigh", "SMA(50) Signal High", "#33691e", []],
      ["signalSma50PriceMeanToPriceLow", "SMA(50) Signal Low", "#880e4f", []],
      ["anchor0", "Anchor", "#212121"],
    ],
  },
  {
    show: true,
    title: "Phase: Accumulation/Distribution",
    seriesConfigs: [
      ["phaseDistribution", "Distribution", "#33691e", []],
      ["phaseAccumulation", "Accumulation", "#880e4f", []],
    ],
  },
  {
    show: true,
    title: "Pressure: Buying/Selling",
    seriesConfigs: [
      ["pressureBuying", "Buying", "#880e4f", []],
      ["pressureSelling", "Selling", "#33691e", []],
    ],
  },
];

export function Charts() {
  const { defaultValue, value, update } = useDataStore(
    "configs",
    defaultConfigs,
  );

  const [configs, setConfigs] = useState(initialize(value || defaultValue));

  function toggleShow(config, index) {
    return () => {
      setConfigs((curr) => {
        const next = [...curr];
        next[index] = { ...next[index], show: !next[index].show };
        next.sort((a, b) => b.show - a.show);
        update(next);
        return next;
      });
    };
  }

  return configs.map((config, index) => (
    <Chart
      key={config.title || index}
      toggleShow={toggleShow(config, index)}
      index={index}
      {...config}
    />
  ));
}
