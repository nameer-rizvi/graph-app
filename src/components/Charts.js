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
      title: "Volume",
      seriesConfigs: [["volume", "Volume", "#3f51b5"]],
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
      title: "VWAP Value [SMA(5), /10k]",
      seriesConfigs: [["sma5VwapValue", "VWAP Value", "#673ab7"]],
    },
    {
      title: "Candle Distribution [SMA(50)]",
      seriesConfigs: [
        ["sma50ColorsGreen", "Candles Green", "#4caf50"],
        ["sma50ColorsRed", "Candles Red", "#f44336"],
        ["sma50ColorsGray", "Candles Gray", "#9e9e9e"],
        ["sma50ColorVolumeGreen", "Candle Volume Green", "#81c784"],
        ["sma50ColorVolumeRed", "Candle Volume Red", "#e57373"],
        ["sma50ColorVolumeGray", "Candle Volume Gray", "#e0e0e0"],
      ],
    },
    // {
    //   title: "MACD",
    //   seriesConfigs: [
    //     ["macd", "MACD", "#ffffff"],
    //     ["macdHist", "MACD Hist", "#ffffff"],
    //     ["macdSignal", "MACD Signal", "#ffffff"],
    //   ],
    // },
  ].map((config) => <Chart key={config.title} {...config} />);
