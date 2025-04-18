import * as utils from "../utils";
import { autocomplete, replaceSeriesKey } from "./autocomplete";
import pricehistory from "pricehistory";
import { correctChartDatetimeEnd } from "./correctChartDatetimeEnd";

const seriesKeyCache = {};

export async function wsj(symbol, timeframe) {
  const leverage = +symbol?.trim().split(" ")[1]?.trim();

  symbol = utils.cleanSymbol(symbol);

  if (symbol === "BTC.X") {
    symbol = "BTCUSD";
  } else if (symbol === "ETH.X") {
    symbol = "ETHUSD";
  }

  const urlString = "https://api.wsj.net/api/michelangelo/timeseries/history";

  const url = new URL(urlString);

  const seriesKey = seriesKeyCache[symbol] || `STOCK/US//${symbol}`;

  const option = {
    headers: {
      Accept: "application/json",
      "Dylan2010.EntitlementToken": "57494d5ed7ad44af85bc59a51dd87c90",
    },
  };

  const step = {
    day: "PT5M",
    week: "PT15M",
    week2: "PT30M",
    year: "P1D",
    year5: "P7D",
    year10: "P14D",
    year20: "P1M",
    year50: "P3M",
  }[timeframe || "day"];

  const timeframe2 = {
    day: "D1",
    week: "D5",
    week2: "D10",
    year: "P1Y",
    year5: "P5Y",
    year10: "P10Y",
    year20: "P20Y",
    year50: "P50Y",
  }[timeframe || "day"];

  url.search = new URLSearchParams({
    ckey: "57494d5ed7",
    json: JSON.stringify({
      EntitlementToken: option.headers["Dylan2010.EntitlementToken"],
      Step: step,
      timeframe: timeframe2,
      ShowPreMarket: true,
      ShowAfterHours: true,
      FilterClosedPoints: true,
      FilterNullSlots: true,
      IncludeClosedSlots: false,
      IncludeCurrentQuotes: false,
      IncludeMockTick: true,
      IncludeOfficialClose: true,
      InjectOpen: false,
      ResetTodaysAfterHoursPercentChange: false,
      UseExtendedtimeframe: true,
      WantPriorClose: true,
      Series: [
        {
          Key: seriesKey,
          Dialect: "Charting",
          Kind: "Ticker",
          SeriesId: "s1",
          DataTypes: ["Open", "High", "Low", "Last"],
          Indicators: [
            {
              Kind: "Volume",
              SeriesId: "i2",
              Parameters: [],
            },
          ],
        },
      ],
    }),
  });

  let response = await fetch(url, option);

  let json = await response.json();

  if (json.error?.startsWith("Unknown instrument")) {
    const seriesKey2 = await autocomplete(symbol.replace(".X", ""));
    if (seriesKey2) {
      replaceSeriesKey(url, seriesKey, seriesKey2);
      response = await fetch(url, option);
      json = await response.json();
      if (!json.error) seriesKeyCache[symbol] = seriesKey2;
    }
  }

  if (json.error) throw new Error(json.error);

  if (!json.Series) return;

  const data = {
    djId: json.Series[0].DjId,
    symbol: json.Series[0].Ticker,
    name: json.Series[0].CommonName,
    type: json.Series[0].InstrumentType,
    country: json.Series[0].CountryCode,
    series: [],
    timeframe: timeframe,
    basePrice: json.Series[0].ExtraData.find((i) => {
      return i.Name === "PriorClose" || i.Name === "PriorOpen";
    })?.Value,
    isBitcoin: json.Series[0].Ticker === "BTCUSD",
    isEthereum: json.Series[0].Ticker === "ETHUSD",
  };

  data.isCrypto = data.isBitcoin || data.isEthereum;

  for (let i = 0; i < (json.TimeInfo.Ticks || []).length; i++) {
    const candle = {};
    const tickIndex = i;
    candle.datetime = json.TimeInfo.Ticks[tickIndex];
    candle.open = json.Series[0].DataPoints[i][0];
    candle.high = json.Series[0].DataPoints[i][1];
    candle.low = json.Series[0].DataPoints[i][2];
    candle.close = json.Series[0].DataPoints[i][3];
    candle.volume = json.Series[1].DataPoints[i][0];
    data.series.push(candle);
  }

  data.series = pricehistory(data.series, {
    leverage: leverage,
    price: true,
    volumeFill: true,
    vwap: true,
    sma: true,
    trend: true,
    color: true,
    periods: [5, 10, 20, 50],
    anchor: [0, 50, 100],
    normalize: ["volume", "sma1VwapValue", "priceRangeDiff"],
  });

  data.last = data.series[data.series.length - 1];

  if (timeframe === "day") correctChartDatetimeEnd(data);

  return data;
}
