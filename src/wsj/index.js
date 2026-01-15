import * as utils from "../utils";
import { autocomplete } from "./autocomplete";
import futures from "../wsj/futures.json";
import pricehistory from "pricehistory";

const seriesKeyCache = {};

export async function wsj(_symbol, timeframe) {
  const symbol = utils.cleanSymbol(_symbol);

  if (!symbol) throw new Error("Symbol is required");

  const urlString = "https://api.wsj.net/api/michelangelo/timeseries/history";

  const url = new URL(urlString);

  const seriesKey =
    symbol === "BTCUSD"
      ? "CRYPTOCURRENCY/US/KRAKEN/BTCUSD"
      : seriesKeyCache[symbol] || `STOCK/US//${symbol}`;

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
    year50: "P2M",
  }[timeframe || "year"];

  const timeframe2 = {
    day: "D1",
    week: "D5",
    week2: "D10",
    year: "P1Y",
    year5: "P5Y",
    year10: "P10Y",
    year20: "P20Y",
    year50: "P50Y",
  }[timeframe || "year"];

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

  if (json.error?.toLowerCase().includes("unknown instrument")) {
    const seriesKey2 = await autocomplete(symbol);
    if (seriesKey2) {
      let urlSearchParamJson = url.searchParams.get("json");
      urlSearchParamJson = urlSearchParamJson.replace(seriesKey, seriesKey2);
      url.searchParams.set("json", urlSearchParamJson);
      response = await fetch(url, option);
      json = await response.json();
      if (!json.error) seriesKeyCache[symbol] = seriesKey2;
    } else {
      throw new Error("Symbol not supported.");
    }
  }

  if (json.error) throw new Error(json.error);

  if (!json.Series) throw new Error("Series does not exist.");

  const data = {
    djId: json.Series[0].DjId,
    symbol: json.Series[0].Ticker,
    name: json.Series[0].CommonName,
    type: json.Series[0].InstrumentType,
    country: json.Series[0].CountryCode,
    series: [],
    step: step,
    timeframe: timeframe,
    basePrice: json.Series[0].ExtraData.find((i) => {
      return i.Name === "PriorClose" || i.Name === "PriorOpen";
    })?.Value,
    isCurrency:
      json.Series[0].InstrumentType.toLowerCase().includes("currency"),
    isCrypto: json.Series[0].InstrumentType.toLowerCase() === "cryptocurrency",
    isFutures: json.Series[0].InstrumentType.toLowerCase() === "future",
    volume: 0,
    volumeValue: 0,
  };

  if (data.isFutures) {
    data.future = futures.find((f) => f.wsj === symbol.replace("00", ""));
  }

  for (let i = 0; i < (json.TimeInfo.Ticks || []).length; i++) {
    data.series.push({
      datetime: json.TimeInfo.Ticks[i],
      open: json.Series[0].DataPoints[i][0],
      high: json.Series[0].DataPoints[i][1],
      low: json.Series[0].DataPoints[i][2],
      close: json.Series[0].DataPoints[i][3],
      volume: json.Series[1].DataPoints[i][0],
    });
  }

  data.series = pricehistory(data.series, {
    leverage: +_symbol?.trim().split(" ")[1]?.trim() || undefined,
    basePrice: data.basePrice,
    price: true,
    sma: [10],
    trend: true,
    // vwap: true,
    // color: true,
    // macd: true,
    // rsi: true,
    // periods: [5, 10, 20, 50],
    // anchor: [0, 50, 100],
    // normalize: ["volume", "sma1VwapValue", "priceRangeDiff"],
    // signalize: true,
  });

  for (const candle of data.series) {
    data.volume += candle.volume || 0;
    data.volumeValue += candle.volumeValue || 0;
  }

  data.last = data.series[data.series.length - 1];

  return data;
}
