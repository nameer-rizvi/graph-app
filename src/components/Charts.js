import { Chart } from "./Chart";

export const Charts = () =>
  [
    {
      title: "Price vs. SMA(20) vs.VWAP",
      seriesConfigs: [
        ["priceLast", "Close Price", "#2196f3"],
        ["sma20", "SMA(20)", "#009688"],
        ["vwap", "VWAP", "#ab47bc"],
      ],
    },
    {
      title: "VWAP Signal",
      seriesConfigs: [["vwapSignal", "VWAP Signal", "#ab47bc"]],
    },
    {
      title: "RSI",
      seriesConfigs: [["rsi", "RSI", "#ff9800"]],
    },
    {
      title: "MACD",
      seriesConfigs: [
        ["macd", "MACD", "#f06292"],
        ["macdHist", "MACD Hist", "#e91e63"],
        ["macdSignal", "MACD Signal", "#c2185b"],
      ],
    },
    {
      title: "Volume",
      seriesConfigs: [["volume", "Volume", "#3f51b5"]],
    },
    {
      title: "Candle Distribution",
      seriesConfigs: [
        ["candlesGreen", "Candles Green", "#4caf50"],
        ["candlesRed", "Candles Red", "#f44336"],
        ["candlesGray", "Candles Gray", "#9e9e9e"],
      ],
    },
    {
      title: "Candle Volume Distribution",
      seriesConfigs: [
        ["candleVolumeGreen", "Candle Volume Green", "#4caf50"],
        ["candleVolumeRed", "Candle Volume Red", "#f44336"],
        ["candleVolumeGray", "Candle Volume Gray", "#9e9e9e"],
      ],
    },
    {
      title: "Candle Volume Discrepancy (Green)",
      seriesConfigs: [
        [
          "candleVolumeDiscrepancy",
          "Candle Volume Discrepancy (Green)",
          "#8bc34a",
        ],
      ],
    },
  ].map((config) => <Chart key={config.title} {...config} />);
