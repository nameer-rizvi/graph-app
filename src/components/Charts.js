import { Chart } from "./Chart";

const sma20Timeframes = ["year10", "year20", "year50"];

export const Charts = () =>
  [
    {
      title: "Price: Close, High, Low, VWAP, SMA",
      seriesConfigs: [
        ["priceClose", "Close", "#78909c", ["$"]],
        ["priceHigh", "High", "#33691e", ["$"]],
        ["priceLow", "Low", "#880e4f", ["$"]],
        ["vwap", "VWAP", "#311b92", ["$"]],
        ["sma20", "SMA(20)", "#1b2429", ["$"], isTimeframes(sma20Timeframes)],
        [
          "sma50",
          "SMA(50)",
          "#1b2429",
          ["$"],
          isTimeframesNot(sma20Timeframes),
        ],
      ],
    },
    {
      title: "Scale: Volume, Value, Volatility",
      min: 0,
      max: 100,
      seriesConfigs: [
        ["volumeN", "Volume", "#0d47a1", []],
        ["sma1VwapValueN", "Value", "#1a237e", []],
        ["priceRangeDiffN", "Rating", "#1b2429", []],
      ],
    },
    {
      title: "Momentum: Green vs. Red",
      min: 0,
      max: 100,
      seriesConfigs: [
        ["sma10ColorsGreen", "Green Candles", "#2e7d32", []],
        ["sma10ColorsRed", "Red Candles", "#c62828", []],
        ["anchor50", "Anchor", "#212121"],
      ],
    },
    {
      title: "Oscillator: SMA Signal (Close)",
      seriesConfigs: [
        [
          "sma20SignalPriceClose",
          "SMA(20) Signal",
          "#78909c",
          [],
          isTimeframes(sma20Timeframes),
        ],
        [
          "sma20SignalPriceHigh",
          "SMA(20) Signal High",
          "#33691e",
          [],
          isTimeframes(sma20Timeframes),
        ],
        [
          "sma20SignalPriceLow",
          "SMA(20) Signal Low",
          "#880e4f",
          [],
          isTimeframes(sma20Timeframes),
        ],
        [
          "sma50SignalPriceClose",
          "SMA(50) Signal",
          "#78909c",
          [],
          isTimeframesNot(sma20Timeframes),
        ],
        [
          "sma50SignalPriceHigh",
          "SMA(50) Signal High",
          "#33691e",
          [],
          isTimeframesNot(sma20Timeframes),
        ],
        [
          "sma50SignalPriceLow",
          "SMA(50) SignalLow",
          "#880e4f",
          [],
          isTimeframesNot(sma20Timeframes),
        ],
        ["anchor0", "Anchor", "#212121"],
      ],
    },
  ].map((config, index) => <Chart key={config.title || index} {...config} />);

function isTimeframes(timeframes) {
  return (data) => timeframes.includes(data?.timeframe?.value);
}

function isTimeframesNot(timeframes) {
  return (data) => !timeframes.includes(data?.timeframe?.value);
}
