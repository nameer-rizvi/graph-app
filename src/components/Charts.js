import { Chart } from "./Chart";

export const Charts = () =>
  [
    {
      title: "Price (High, Low, Close), VWAP",
      seriesConfigs: [
        ["priceClose", "Price Close", "#78909c", ["$"]],
        ["priceHigh", "Price High", "#33691e", ["$"]],
        ["priceLow", "Price Low", "#880e4f", ["$"]],
        ["vwap", "VWAP", "#311b92", ["$"]],
        // ["sma10", "SMA(10)", "#607d8b", ["$"]],
        // ["sma20", "SMA(20)", "#546e7a", ["$"]],
        // ["sma50", "SMA(50)", "#455a64", ["$"]],
        // ["sma100", "SMA(100)", "#37474f", ["$"]],
        // ["sma200", "SMA(200)", "#263238", ["$"]],
      ],
    },
    {
      title: "RSI, Candle Distribution, VVCVG",
      min: 0,
      max: 100,
      seriesConfigs: [
        ["rsi", "RSI", "#bf360c"],
        ["vvcvg", "VVCVG", "#01579b"],
        [
          "sma5ColorVolumeGreen",
          "Candle Volume Green",
          "#558b2f",
          undefined,
          (data) => data?.data?.symbol !== "BTCUSD",
        ],
        [
          "sma10ColorsGreen",
          "Candles Green",
          "#689f38",
          undefined,
          (data) => data?.data?.symbol === "BTCUSD",
        ],
        ["anchor50", "Anchor [50]", "#212121"],
      ],
    },
    // {
    //   title: "MACD",
    //   seriesConfigs: [
    //     ["macd", "MACD", "#880e4f"],
    //     ["macdHist", "MACD Hist", "#ad1457"],
    //     ["macdSignal", "MACD Signal", "#c2185b"],
    //     ["anchor0", "Anchor", "#212121"],
    //   ],
    // },
    {
      title: "Volume, Value, Volatility",
      seriesConfigs: [
        ["volumeScale", "Volume", "#0d47a1"],
        ["sma1VwapValueScale", "VWAP Value", "#4527a0"],
        ["priceRangeDiffScale", "Price Range", "#263238"],
      ],
    },
    {
      title: "Price Diversion",
      seriesConfigs: [
        ["vwapSignal", "VWAP", "#311b92", ["%"]],
        ["volumeVwapValueDiscrepancy", "Volume / VWAP Value", "#283593"],
        ["sma10Signal", "SMA(10)", "#607d8b", ["%"]],
        // ["sma20Signal", "SMA(20)", "#546e7a", ["%"]],
        // ["sma50Signal", "SMA(50)", "#455a64", ["%"]],
        // ["sma100Signal", "SMA(100)", "#37474f", ["%"]],
        // ["sma200Signal", "SMA(200)", "#263238", ["%"]],
        ["anchor0", "Anchor", "#212121"],
      ],
    },
    {
      title: "Social Sentiment",
      seriesConfigs: [
        ["messagesBullish", "Bullish", "#1b5e20"],
        ["messagesBearish", "Bearish", "#b71c1c"],
        ["messagesTotal", "All", "#212121"],
      ],
    },
  ].map((config) => <Chart key={config.title} {...config} />);
