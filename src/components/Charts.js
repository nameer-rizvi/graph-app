import { Chart } from "./Chart";

export const Charts = () =>
  [
    {
      title: "Price (High, Low, Close), VWAP, SMA",
      seriesConfigs: [
        ["priceClose", "Price Close", "#78909c", ["$"]],
        ["priceHigh", "Price High", "#33691e", ["$"]],
        ["priceLow", "Price Low", "#880e4f", ["$"]],
        ["vwap", "VWAP", "#311b92", ["$"]],
        ["sma20", "SMA(20)", "#1b2429", ["$"], isTimeframes(["year10"])],
        [
          "sma50",
          "SMA(50)",
          "#1b2429",
          ["$"],
          isTimeframesNot(["year10", "day"]),
        ],
      ],
    },
    {
      title: "Price Diversion",
      seriesConfigs: [
        ["sma10Signal", "SMA(10) Signal", "#607d8b", ["%", "+"]],
        // ["vwapSignal", "VWAP", "#311b92", ["%", "+"]],
        [
          "sma20Signal",
          "SMA(20) Signal",
          "#1b2429",
          ["%", "+"],
          isTimeframes(["year10"]),
        ],
        [
          "sma50Signal",
          "SMA(50) Signal",
          "#1b2429",
          ["%", "+"],
          isTimeframesNot(["year10", "day"]),
        ],
        ["anchor0", "Anchor", "#212121"],
      ],
    },
    {
      title: "Green Candle Index",
      min: 0,
      max: 100,
      seriesConfigs: [
        ["sma10ColorsGreen", "Green Candles", "#4caf50", []],
        ["sma5ColorVolumeGreen", "Green Candle Volume ", "#1b5e20", []],
        ["anchor50", "Anchor [50]", "#212121"],
      ],
    },
    {
      title: "Volume / VWAP Value Discrepancy Index",
      seriesConfigs: [
        ["volumeVwapValueDiscrepancy", "Discrepancy", "#283593", ["%", "+"]],
        ["anchor0", "Anchor", "#212121"],
      ],
    },
    {
      title: "Social Sentiment",
      seriesConfigs: [
        ["messagesBullish", "Bullish", "#1b5e20", []],
        ["messagesBearish", "Bearish", "#b71c1c", []],
        ["messagesTotal", "All", "#212121", []],
      ],
    },
  ].map((config) => <Chart key={config.title} {...config} />);

function isTimeframes(timeframes) {
  return (data) => timeframes.includes(data?.timeframe?.value);
}

function isTimeframesNot(timeframes) {
  return (data) => !timeframes.includes(data?.timeframe?.value);
}

function hasVolume(data) {
  return data?.data?.series?.some((i) => typeof i.volume === "number");
}

// ["rsi", "RSI", "#bf360c", []],
// ["vvcvg", "VVCVG", "#01579b", []],
// {
//   title: "Volume, Value, Volatility",
//   seriesConfigs: [
//     ["volumeScale", "Volume", "#0d47a1", []],
//     ["sma1VwapValueScale", "VWAP Value", "#4527a0", []],
//     ["priceRangeDiffScale", "Price Volatility", "#1b2429", []],
//   ],
// },
// {
//   title: "On Balance Volume",
//   seriesConfigs: [
//     ["obvScale", "On Balance Volume", "#880e4f", []],
//     ["anchor0", "Anchor", "#212121", []],
//   ],
// },
// {
//   title: "MACD",
//   seriesConfigs: [
//     ["macd", "MACD", "#880e4f", []],
//     ["macdHist", "MACD Hist", "#ad1457", []],
//     ["macdSignal", "MACD Signal", "#c2185b", []],
//     ["anchor0", "Anchor", "#212121", []],
//   ],
// },
