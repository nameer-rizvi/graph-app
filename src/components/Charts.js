import { Chart } from "./Chart";

export const Charts = () =>
  [
    {
      title: "Price vs. VWAP vs. SMA(10,20,50,100,200)",
      seriesConfigs: [
        ["priceLast", "Close Price", "#2196f3"],
        ["vwap", "VWAP", "#9c27b0"],
        ["sma10", "SMA(10)", "#b2dfdb"],
        ["sma20", "SMA(20)", "#4db6ac"],
        ["sma50", "SMA(50)", "#009688"],
        ["sma100", "SMA(100)", "#00796b"],
        ["sma200", "SMA(200)", "#004d40"],
      ],
    },
    {
      title: "Signals",
      seriesConfigs: [
        ["vwapSignal", "VWAP", "#9c27b0"],
        ["sma10Signal", "SMA(10)", "#b2dfdb"],
        ["sma20Signal", "SMA(20)", "#4db6ac"],
        ["sma50Signal", "SMA(50)", "#009688"],
        ["sma100Signal", "SMA(100)", "#00796b"],
        ["sma200Signal", "SMA(200)", "#004d40"],
      ],
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
        ["messagesBullish", "Bullish", "#19b682"],
        ["messagesBearish", "Bearish", "#fe433d"],
        ["messagesTotal", "Messages", "#616161"],
      ],
    },
  ].map((config) => <Chart key={config.title} {...config} />);
