import { Chart } from "./Chart";

export const Charts = () =>
  [
    {
      title: "Price, VWAP, SMA(10,20,50,100,200)",
      seriesConfigs: [
        ["priceClose", "Close Price", "#90a4ae"],
        ["vwap", "VWAP", "#311b92"],
        ["sma10", "SMA(10)", "#607d8b"],
        ["sma20", "SMA(20)", "#546e7a"],
        ["sma50", "SMA(50)", "#455a64"],
        ["sma100", "SMA(100)", "#37474f"],
        ["sma200", "SMA(200)", "#263238"],
      ],
    },
    {
      title: "Price Diversion",
      seriesConfigs: [
        ["vwapSignal", "VWAP Signal", "#311b92"],
        ["sma10Signal", "SMA(10) Signal", "#607d8b"],
        ["sma20Signal", "SMA(20) Signal", "#546e7a"],
        ["sma50Signal", "SMA(50) Signal", "#455a64"],
        ["sma100Signal", "SMA(100) Signal", "#37474f"],
        ["sma200Signal", "SMA(200) Signal", "#263238"],
        ["anchor0", "Anchor", "#424242"],
      ],
    },
    {
      title: "RSI, Candle Distribution, VVCVG",
      seriesConfigs: [
        ["rsi", "RSI", "#ef6c00"],
        ["sma5ColorVolumeGreen", "Candle Volume Green", "#2e7d32"],
        ["sma10ColorsGreen", "Candles Green", "#2e7d32"],
        ["vvcvg", "VVCVG", "#6a1b9a"],
        ["anchor0", "Anchor [0]", "#424242"],
        ["anchor100", "Anchor [100]", "#424242"],
      ],
    },
    {
      title: "MACD",
      seriesConfigs: [
        ["macd", "MACD", "#d81b60"],
        ["macdHist", "MACD Hist", "#ec407a"],
        ["macdSignal", "MACD Signal", "#ad1457"],
        ["anchor0", "Anchor", "#424242"],
      ],
    },
    {
      title: "Scaled: Volume, Value, Volatility",
      seriesConfigs: [
        ["volumeScale", "Volume", "#3f51b5"],
        ["sma1VwapValueScale", "VWAP Value", "#673ab7"],
        ["priceRangeScale", "Price Range", "#263238"],
      ],
    },
    {
      title: "Volume / VWAP Discrepancy",
      seriesConfigs: [
        ["volumeVwapValueDiscrepancy", "Volume / VWAP Value", "#311b92"],
        ["anchor0", "Anchor", "#424242"],
      ],
    },
    {
      title: "Social Sentiment",
      seriesConfigs: [
        ["messagesBullish", "Bullish", "#2e7d32"],
        ["messagesBearish", "Bearish", "#c62828"],
        ["messagesTotal", "All", "#424242"],
      ],
    },
  ].map((config) => <Chart key={config.title} {...config} />);
