import { Chart } from "./Chart";

export const Charts = () =>
  [
    {
      title: "Price vs. VWAP vs. SMA(10,20,50,100,200)",
      seriesConfigs: [
        ["priceLast", "Close Price", "#90a4ae"],
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
        ["vwapSignal", "VWAP", "#311b92"],
        ["sma10Signal", "SMA(10)", "#607d8b"],
        ["sma20Signal", "SMA(20)", "#546e7a"],
        ["sma50Signal", "SMA(50)", "#455a64"],
        ["sma100Signal", "SMA(100)", "#37474f"],
        ["sma200Signal", "SMA(200)", "#263238"],
        ["anchor0", "Anchor", "#424242"],
      ],
    },
    {
      title: "Volume vs. VWAP Value",
      seriesConfigs: [
        ["volumeS", "Volume", "#3f51b5"],
        ["sma1VwapValue", "VWAP Value", "#673ab7"],
      ],
    },
    {
      title: "Volume / VWAP Value Discrepancy",
      seriesConfigs: [
        ["volumeVwapDiscrepancy", "Discrepancy", "#311b92"],
        ["anchor0", "Anchor", "#424242"],
      ],
    },
    {
      title: "RSI vs. Candle Distribution",
      seriesConfigs: [
        ["rsi", "RSI", "#ef6c00"],
        ["sma5ColorVolumeGreen", "Candle Volume Green", "#2e7d32"],
        ["sma5ColorsGreen", "Candles Green", "#2e7d32"],
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
      title: "Social Sentiment",
      seriesConfigs: [
        ["messagesBullish", "Bullish", "#2e7d32"],
        ["messagesBearish", "Bearish", "#c62828"],
        ["messagesTotal", "All", "#424242"],
      ],
    },
  ].map((config) => <Chart key={config.title} {...config} />);
