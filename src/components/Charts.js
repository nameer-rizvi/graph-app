import { useDataStore } from "../hooks";
import { useState } from "react";
import { Chart } from "./Chart";

const sma20Timeframes = ["year10", "year20", "year50"];

function isTimeframes(timeframes) {
  return (data) => timeframes.includes(data?.timeframe?.value);
}

function isTimeframesNot(timeframes) {
  return (data) => !timeframes.includes(data?.timeframe?.value);
}

function initialize(configs = []) {
  return configs.map((c) => {
    const defaultConfig = defaultConfigs.find((d) => c.title === d.title);
    return { ...c, seriesConfigs: defaultConfig?.seriesConfigs || [] };
  });
}

const defaultConfigs = [
  {
    show: true,
    title: "Price: Close, High, Low, VWAP, SMA",
    seriesConfigs: [
      ["priceClose", "Close", "#78909c", ["$"]],
      ["priceHigh", "High", "#33691e", ["$"]],
      ["priceLow", "Low", "#880e4f", ["$"]],
      ["vwap", "VWAP", "#311b92", ["$"]],
      ["sma20PriceMean", "SMA(20)", "#1b2429", ["$"]],
      ["sma50PriceMean", "SMA(50)", "#1b2429", ["$"]],
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
    title: "Oscillator: SMA Signal (Close)",
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
      ["pressureSelling", "Selling", "#33691e", []],
      ["pressureBuying", "Buying", "#880e4f", []],
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
