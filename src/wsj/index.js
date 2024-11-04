import * as utils from "../utils";
import { autocomplete } from "./autocomplete";
import simpul from "simpul";
import { correctChartDatetimeEnd } from "./correctChartDatetimeEnd";

const seriesKeyCache = {};

export async function wsj(symbol, timeframe) {
  const leverage = +symbol?.split(" ")[1]?.trim();

  symbol = utils.cleanSymbol(symbol);

  if (symbol === "BTC.X") symbol = "BTCUSD";

  const url = "https://api.wsj.net/api/michelangelo/timeseries/history?";

  const step = {
    day: "PT4M",
    week: "PT20M",
    week2: "PT40M",
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

  const seriesKey = seriesKeyCache[symbol] || `STOCK/US//${symbol}`;

  const option = {
    headers: {
      Accept: "application/json",
      "Dylan2010.EntitlementToken": "57494d5ed7ad44af85bc59a51dd87c90",
    },
  };

  const params = {
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
  };

  let response = await fetch(url + new URLSearchParams(params), option);

  let json = await response.json();

  if (json.error?.startsWith("Unknown instrument")) {
    let seriesKey2 = await autocomplete(symbol.replace(".X", ""));

    if (seriesKey2) {
      params.json = params.json.replace(seriesKey, seriesKey2);

      response = await fetch(url + new URLSearchParams(params), option);

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
      return i.Name === "PriorOpen";
    })?.Value,
    isBitcoin: json.Series[0].Ticker === "BTCUSD",
  };

  for (let i = 0; i < (json.TimeInfo.Ticks || []).length; i++) {
    let candle = {};

    let tickIndex = i;

    candle.datetime = json.TimeInfo.Ticks[tickIndex];

    candle.open = json.Series[0].DataPoints[i][0];

    candle.high = json.Series[0].DataPoints[i][1];

    candle.low = json.Series[0].DataPoints[i][2];

    candle.close = json.Series[0].DataPoints[i][3];

    candle.volume = json.Series[1].DataPoints[i][0];

    data.series.push(candle);
  }

  const pricehistory = simpul.pricehistory(data.series, {
    leverage: leverage,
    price: true,
    vwap: true,
    trend: true,
    macd: true,
    sma: true,
    volumefill: true,
    anchor: true,
    color: true,
    periods: [5, 10, 20, 50],
    scales: [
      "volume",
      "vwapdisc",
      "priceRangeDiff",
      "sma20Signal",
      "sma50Signal",
    ],
  });

  data.series = pricehistory.candles;

  for (let i = 0; i < data.series.length; i++) {
    const values = [
      data.series[i].sma5ColorVolumeGreen,
      data.series[i].sma10ColorsGreen,
    ];
    const signal = ["year10", "year20", "year50"]
      ? data.series[i].sma20SignalScale
      : data.series[i].sma50SignalScale;
    values.push(signal);
    data.series[i].rating = simpul.math.mean(values.filter(simpul.isNumber));
    if (data.series[i].rating > data.series[i - 1]?.rating) {
      data.series[i].ratingTrend = "up";
    } else if (data.series[i].rating < data.series[i - 1]?.rating) {
      data.series[i].ratingTrend = "down";
    }
  }

  data.last = pricehistory.curr;

  if (timeframe === "day") correctChartDatetimeEnd(data);

  return data;
}
