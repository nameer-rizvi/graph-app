import { Chart } from "./Chart";

export const Charts = () =>
  [
    {
      title: "Price: High, Low, Close, VWAP, SMA",
      seriesConfigs: [
        ["priceClose", "Close", "#78909c", ["$"]],
        ["priceHigh", "High", "#33691e", ["$"]],
        ["priceLow", "Low", "#880e4f", ["$"]],
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
      title: "Scale: Volume, Value, Volatility",
      seriesConfigs: [
        ["volumeScale", "Volume", "#0d47a1", []],
        ["sma1VwapValueScale", "Value", "#1a237e", []],
        ["priceRangeDiffScale", "Volatility", "#1b2429", []],
      ],
    },
    {
      title: "Wave: Green Candles & Green Candle Volume",
      min: 0,
      max: 100,
      seriesConfigs: [
        ["sma10ColorsGreen", "Green Candles", "#1b5e20", []],
        ["sma5ColorVolumeGreen", "Green Candle Volume ", "#004d40", []],
        ["anchor50", "Anchor [50]", "#212121"],
      ],
    },
    {
      title: "Discrepancy: Volume / Value, SMA(10)",
      seriesConfigs: [
        ["volumeVwapValueDiscrepancy", "Volume / Value", "#283593", ["%", "+"]],
        ["sma10Signal", "SMA(10)", "#1b2429", ["%", "+"]],
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
// ["vwapSignal", "VWAP", "#311b92", ["%", "+"]],
// [
//   "sma20Signal",
//   "SMA(20) Signal",
//   "#1b2429",
//   ["%", "+"],
//   isTimeframes(["year10"]),
// ],
// [
//   "sma50Signal",
//   "SMA(50) Signal",
//   "#1b2429",
//   ["%", "+"],
//   isTimeframesNot(["year10", "day"]),
// ],
