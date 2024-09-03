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
        [
          "sma20",
          "SMA(20)",
          "#1b2429",
          ["$"],
          isTimeframes(["year10", "year20", "year50"]),
        ],
        [
          "sma50",
          "SMA(50)",
          "#1b2429",
          ["$"],
          isTimeframesNot(["year10", "year20", "year50"]),
        ],
      ],
    },
    {
      title: "Wave: Green Candles & Green Candle Volume",
      min: 0,
      max: 100,
      seriesConfigs: [
        ["sma10ColorsGreen", "Green Candles", "#2e7d32", []],
        ["sma5ColorVolumeGreen", "Green Candle Volume ", "#004d40", []],
        ["vvcvg", "VVCVG", "#1b2429", []],
        ["anchor50", "Anchor [50]", "#212121"],
      ],
    },
    {
      title: "Oscillator: SMA",
      seriesConfigs: [
        [
          "sma20Signal",
          "SMA(20) Signal",
          "#607d8b",
          [],
          isTimeframes(["year10", "year20", "year50"]),
        ],
        [
          "sma50Signal",
          "SMA(50) Signal",
          "#607d8b",
          [],
          isTimeframesNot(["year10", "year20", "year50"]),
        ],
        ["anchor0", "Anchor", "#212121"],
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

// {
//   title: "Scale: Volume, Value, Volatility",
//   seriesConfigs: [
//     ["volumeScale", "Volume", "#0d47a1", []],
//     ["sma1VwapValueScale", "Value", "#1a237e", []],
//     ["priceRangeDiffScale", "Volatility", "#1b2429", []],
//   ],
// },
