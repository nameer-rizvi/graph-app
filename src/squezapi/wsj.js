const utils = require("../utils");
const { wsj_autocomplete } = require("./wsj_autocomplete");
const simpul = require("simpul");

const SERIES_KEY_CACHE = {};

export async function wsj(SYMBOL, TIMEFRAME) {
  const LEVERAGE = +SYMBOL?.split(" ")[1];

  SYMBOL = utils.cleanSymbol(SYMBOL);

  if (SYMBOL === "BTC.X") SYMBOL = "BTCUSD";

  const URL = "https://api.wsj.net/api/michelangelo/timeseries/history?";

  const STEP = {
    day: "PT4M",
    week: "PT20M",
    week2: "PT40M",
    year: "P1D",
    year5: "P7D",
    year10: "P14D",
  }[TIMEFRAME || "day"];

  const TIMEFRAME2 = {
    day: "D1",
    week: "D5",
    week2: "D10",
    year: "P1Y",
    year5: "P5Y",
    year10: "P10Y",
  }[TIMEFRAME || "day"];

  const SERIES_KEY = SERIES_KEY_CACHE[SYMBOL] || `STOCK/US//${SYMBOL}`;

  const OPTION = {
    headers: {
      Accept: "application/json",
      "Dylan2010.EntitlementToken": "57494d5ed7ad44af85bc59a51dd87c90",
    },
  };

  const PARAMS = {
    ckey: "57494d5ed7",
    json: JSON.stringify({
      EntitlementToken: OPTION.headers["Dylan2010.EntitlementToken"],
      Step: STEP,
      TimeFrame: TIMEFRAME2,
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
      UseExtendedTimeFrame: true,
      WantPriorClose: true,
      Series: [
        {
          Key: SERIES_KEY,
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

  let response = await fetch(URL + new URLSearchParams(PARAMS), OPTION);

  let json = await response.json();

  if (json.error?.startsWith("Unknown instrument")) {
    let SERIES_KEY_2 = await wsj_autocomplete(SYMBOL.replace(".X", ""));

    if (SERIES_KEY_2) {
      PARAMS.json = PARAMS.json.replace(SERIES_KEY, SERIES_KEY_2);

      response = await fetch(URL + new URLSearchParams(PARAMS), OPTION);

      json = await response.json();

      if (!json.error) SERIES_KEY_CACHE[SYMBOL] = SERIES_KEY_2;
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
    timeframe: TIMEFRAME,
    basePrice: json.Series[0].ExtraData.find((i) => {
      return i.Name === "PriorClose";
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
    volumefill: true,
    anchor: true,
    trend: true,
    leverage: LEVERAGE,
    scales: ["vwapdisc", "priceRangeDiff", "vvcvg"],
    basePrice: data.basePrice,
  });

  data.series = pricehistory.candles;

  // for (let candle of data.series) {}

  data.last = pricehistory.curr;

  if (TIMEFRAME === "day") correctChartDatetimeEnd(data);

  return data;
}

function correctChartDatetimeEnd(data) {
  const curr = EST(new Date());
  const last = EST(data.last.dateObject);
  const isDate = curr.getDate() === last.getDate();
  const isEarly = last.getHours() < (data.isBitcoin ? 17 : 20);
  if (isDate && isEarly) {
    const time = data.isBitcoin ? "17:00:00" : "20:00:00";
    const date = new Date(`${last.toDateString()} ${time} EST`);
    data.series.push({ dateObject: date });
  }
}

function EST(date) {
  const d = date.toLocaleString("en-US", { timeZone: "America/New_York" });
  return new Date(d);
}
