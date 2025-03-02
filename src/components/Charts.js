import { Chart } from "./Chart";

export const Charts = () =>
  [
    {
      title: "Price: Close, High, Low, VWAP, SMA",
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
      title: "Scale: Volume, Value, Volatility",
      min: 0,
      max: 100,
      seriesConfigs: [
        ["volumeScale", "Volume", "#0d47a1", []],
        ["sma1VwapValueScale", "Value", "#1a237e", []],
        ["priceRangeDiffScale", "Volatility", "#1b2429", []],
      ],
    },
    {
      title: "Wave: Green Candles, Green Volume",
      min: 0,
      max: 100,
      seriesConfigs: [
        ["sma10ColorsGreen", "Green Candles", "#2e7d32", []],
        ["sma5ColorVolumeGreen", "Green Volume ", "#004d40", []],
        ["rating", "Rating", "#1b2429", []],
      ],
    },
    {
      title: "Oscillator: SMA Signal (Close)",
      seriesConfigs: [
        [
          "sma20Signal",
          "SMA(20) Signal",
          "#78909c",
          [],
          isTimeframes(["year10", "year20", "year50"]),
        ],
        [
          "sma20SignalHigh",
          "SMA(20) Signal High",
          "#33691e",
          [],
          isTimeframes(["year10", "year20", "year50"]),
        ],
        [
          "sma20SignalLow",
          "SMA(20) Signal Low",
          "#880e4f",
          [],
          isTimeframes(["year10", "year20", "year50"]),
        ],
        [
          "sma50Signal",
          "SMA(50) Signal",
          "#78909c",
          [],
          isTimeframesNot(["year10", "year20", "year50"]),
        ],
        [
          "sma50SignalHigh",
          "SMA(50) Signal High",
          "#33691e",
          [],
          isTimeframesNot(["year10", "year20", "year50"]),
        ],
        [
          "sma50SignalLow",
          "SMA(50) SignalLow",
          "#880e4f",
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
