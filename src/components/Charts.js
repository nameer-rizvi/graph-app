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
        ["sma20ColorVolumeGreen", "Candle Volume Green", "#a5d6a7"],
      ],
    },
    {
      title: "MACD",
      seriesConfigs: [
        ["macd", "MACD", "#c2185b"],
        ["macdHist", "MACD Hist", "#f06292"],
        ["macdSignal", "MACD Signal", "#d81b60"],
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
    {
      title: "Social Sentiment",
      seriesConfigs: [
        ["messagesTotal", "Messages", "#bdbdbd"],
        ["messagesBullish", "Bullish", "#19b682"],
        ["messagesBearish", "Bearish", "#fe433d"],
      ],
    },
  ].map((config) => <Chart key={config.title} {...config} />);
