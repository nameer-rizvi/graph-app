import { Chart } from "./Chart";

export const Charts = () =>
  [
    {
      title: "Price vs. SMA(20) vs.VWAP",
      seriesConfigs: [
        ["priceLast", "Close Price", "#2196f3"],
        ["sma20", "SMA(20)", "#009688"],
        ["vwap", "VWAP", "#9c27b0"],
      ],
    },
    {
      title: "VWAP Signal",
      seriesConfigs: [["vwapSignal", "VWAP Signal", "#8e24aa"]],
    },
    {
      title: "RSI",
      seriesConfigs: [["rsi", "RSI", "#ff9800"]],
    },
    {
      title: "Candle Distribution",
      seriesConfigs: [
        ["sma20ColorsGreen", "Candles Green", "#4caf50"],
        // ["sma20ColorsRed", "Candles Red", "#f44336"],
        // ["sma20ColorsGray", "Candles Gray", "#9e9e9e"],
        ["sma20ColorVolumeGreen", "Candle Volume Green", "#a5d6a7"],
        // ["sma20ColorVolumeRed", "Candle Volume Red", "#ef5350"],
        // ["sma20ColorVolumeGray", "Candle Volume Gray", "#bdbdbd"],
      ],
    },
    {
      title: "MACD",
      seriesConfigs: [
        ["macd", "MACD", "#c2185b"],
        ["macdHist", "MACD Hist", "#d81b60"],
        ["macdSignal", "MACD Signal", "#f06292"],
      ],
    },
    {
      title: "Volume",
      seriesConfigs: [["sma5Volume", "Volume", "#3f51b5"]],
    },
    {
      title: "VWAP Value",
      seriesConfigs: [["sma5VwapValue", "VWAP Value", "#673ab7"]],
    },
  ].map((config) => <Chart key={config.title} {...config} />);
