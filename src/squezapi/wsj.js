const utils = require("../utils");
const simpul = require("simpul");

const SERIES_KEY_CACHE = {};

export async function wsj(SYMBOL, TIMEFRAME) {
  SYMBOL = utils.cleanSymbol(SYMBOL);

  if (SYMBOL === "BTC.X") SYMBOL = "BTCUSD";

  const URL = "https://api.wsj.net/api/michelangelo/timeseries/history?";

  const STEP = {
    day: "PT5M",
    week: "PT10M",
    week2: "PT1H",
    year: "P1D",
    year5: "P7D",
    year10: "P1M",
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
    let SERIES_KEY_2 = await autocomplete(SYMBOL.replace(".X", ""));

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
  };

  const PriorClose = json.Series[0].ExtraData.find((i) => {
    return i.Name === "PriorClose";
  })?.Value;

  const periods = [5, 10, 20, 50, 100, 200];

  for (let i = 0; i < (json.TimeInfo.Ticks || []).length; i++) {
    let candle = {};

    let tickIndex = i;

    let tick = json.TimeInfo.Ticks[tickIndex];

    candle.anchor0 = 0;

    candle.anchor50 = 50;

    candle.anchor100 = 100;

    candle.date = new Date(tick);

    candle.priceOpen = json.Series[0].DataPoints[i][0];

    candle.priceHigh = json.Series[0].DataPoints[i][1];

    candle.priceLow = json.Series[0].DataPoints[i][2];

    candle.priceLast = json.Series[0].DataPoints[i][3];

    candle.volume = json.Series[1].DataPoints[i][0];

    candle.volumeS = candle.volume;

    candle.priceChange = simpul.math.change.percent(
      PriorClose,
      candle.priceLast,
    );

    let series = [...data.series, candle];

    assignVWAPData(candle, series);

    assignVWAPData(candle, series.slice(-1), 1);

    assignRSIData(candle, series, OPTION);

    assignEMAData(candle, series);

    assignMACDData(candle, series, OPTION); // Needs to be after assignEMAData()

    assignColorData(candle, series);

    for (let period of periods) {
      let seriesSlice = series.slice(-period);

      assignSMAData(candle, seriesSlice, period);

      assignVWAPData(candle, seriesSlice, period);

      assignColorData(candle, seriesSlice, period);
    }

    data.series.push(candle);
  }

  if (data) {
    scale(data.series, "volumeS");

    scale(data.series, "sma1VwapValue");

    for (let i = 0; i < data.series.length; i++) {
      data.series[i].volumeVwapDiscrepancy = simpul.math.change.num(
        data.series[i].volumeS,
        data.series[i].sma1VwapValue,
      );
    }
  }

  assignLast(data);

  return data;
}

/*
 *
 * --> AUTOCOMPLETE
 *
 */

async function autocomplete(SYMBOL) {
  const url =
    "https://services.dowjones.com/autocomplete/data?" +
    new URLSearchParams({
      count: 1,
      q: SYMBOL,
      need: "symbol",
      it: [
        "fund",
        "exchangetradedfund",
        "stock",
        "Index",
        "Currency",
        "Benchmark",
        "Future",
        "Bond",
        "CryptoCurrency",
      ],
    });
  const response = await fetch(url);
  const json = await response.json();
  return json?.symbols?.[0]?.chartingSymbol;
}

/*
 *
 * --> ASSIGN VWAP DATA
 *
 */

function assignVWAPData(candle, series, period) {
  let price = 0;
  let pv = 0;
  let v = 0;
  for (let s of series) {
    if (s.priceHigh && s.priceLow && s.priceLast && s.volume) {
      price = simpul.math.mean([s.priceHigh, s.priceLow, s.priceLast]);
      pv += price * s.volume;
      v += s.volume;
    }
  }
  let vwap = +(pv / v).toFixed(3);
  let vwapSignal = simpul.math.change.percent(vwap, price);
  let vwapValue = pv;
  if (period) {
    candle[`sma${period}VolumeTotal`] = v / period;
    candle[`sma${period}Vwap`] = vwap;
    candle[`sma${period}VwapSignal`] = vwapSignal;
    candle[`sma${period}VwapValue`] = vwapValue / period;
  } else {
    candle.volumeTotal = v;
    candle.vwap = vwap;
    candle.vwapSignal = vwapSignal;
    candle.vwapValue = vwapValue;
  }
}

/*
 *
 * --> ASSIGN RSI DATA
 *
 */

function assignRSIData(candle, series, OPTION) {
  let prev = series[series.length - 2];
  if (series.length === 15) {
    let gain = 0;
    let loss = 0;
    for (let i = 0; i < series.length; i++) {
      let currPrice = series[i]?.priceLast;
      let prevPrice = series[i - 1]?.priceLast;
      let change = currPrice - prevPrice;
      if (change > 0) gain += change;
      if (change < 0) loss += Math.abs(change);
    }
    let averageGain = gain / 14;
    let averageLoss = loss / 14;
    let rsi = 100 - 100 / (1 + averageGain / averageLoss);
    candle.averageGain = averageGain;
    candle.averageLoss = averageLoss;
    candle.rsi = rsi;
  } else if (prev?.rsi) {
    let gain = prev.averageGain * 13;
    let loss = prev.averageLoss * 13;
    let change = candle.priceLast - prev.priceLast;
    if (change > 0) gain += change;
    if (change < 0) loss += Math.abs(change);
    let averageGain = gain / 14;
    let averageLoss = loss / 14;
    let rsi = 100 - 100 / (1 + averageGain / averageLoss);
    candle.averageGain = averageGain;
    candle.averageLoss = averageLoss;
    candle.rsi = rsi;
  } else {
    candle.averageGain = 0;
    candle.averageLoss = 0;
    candle.rsi = 0;
  }
}

/*
 *
 * --> ASSIGN EMA DATA
 *
 */

function assignEMAData(candle, series) {
  assignEMA(9, series, candle);
  assignEMA(12, series, candle);
  assignEMA(26, series, candle);
}

function assignEMA(period, series, candle, numKey = "priceLast") {
  let key = `ema${period}`;
  if (series.length > period) {
    let prev = series[series.length - 2];
    if (numKey !== "priceLast") key += numKey;
    let prevEMA = prev[key];
    if (!prevEMA) {
      let nums = series.slice(-(period + 1), -1).map((c) => c[numKey]); // Exclude current candle.
      if (nums.length === period) prevEMA = simpul.math.mean(nums);
    }
    if (prevEMA) {
      let k = 2 / (period + 1);
      candle[key] = candle[numKey] * k + prevEMA * (1 - k);
    }
  } else {
    candle[key] = 0;
  }
}

/*
 *
 * --> ASSIGN MACD DATA
 *
 */

function assignMACDData(candle, series, OPTION) {
  if (candle.ema12 && candle.ema26) {
    candle.macd = candle.ema12 - candle.ema26;
    assignEMA(9, series, candle, "macd");
    candle.macdSignal = candle.ema9macd;
    candle.macdHist = candle.macd - candle.macdSignal;
  } else {
    candle.macd = 0;
    candle.macdSignal = 0;
    candle.macdHist = 0;
  }
}

/*
 *
 * --> ASSIGN COLOR DATA
 *
 */

function assignColorData(candle, series, period) {
  let countColor = { green: 0, red: 0, gray: 0, total: 0 };
  let countVolume = { green: 0, red: 0, gray: 0, total: 0 };
  let getColor = (a, b) => (a > b ? "green" : a < b ? "red" : "gray");
  for (let s of series) {
    if (s.priceOpen && s.priceLast) {
      let color = getColor(s.priceLast, s.priceOpen);
      countColor[color]++;
      countColor.total++;
      if (typeof s.volume === "number") {
        countVolume[color] += s.volume;
        countVolume.total += s.volume;
      }
    }
  }
  let getPercent = (num) => simpul.math.percent(num, countColor.total);
  let getPercent2 = (num) => simpul.math.percent(num, countVolume.total);
  if (period) {
    let seriesPriceOpen = series[0]?.priceOpen;
    let seriesPriceLast = series[series.length - 1]?.priceLast;
    candle[`sma${period}Color`] = getColor(seriesPriceOpen, seriesPriceLast);
    candle[`sma${period}ColorsGreen`] = getPercent(countColor.green);
    candle[`sma${period}ColorVolumeGreen`] = getPercent2(countVolume.green);
  } else {
    candle.color = getColor(candle.priceLast, candle.priceOpen);
    candle.colorsGreen = getPercent(countColor.green);
    candle.colorVolumeGreen = getPercent2(countVolume.green);
  }
}

/*
 *
 * --> ASSIGN SMA DATA
 *
 */

function assignSMAData(candle, series, period) {
  if (!candle[`sma${period}`] && candle.priceLast) {
    let sma = simpul.math.mean(series.map((c) => c.priceLast));
    candle[`sma${period}`] = sma;
    candle[`sma${period}Signal`] = simpul.math.change.percent(
      sma,
      candle.priceLast,
    );
  }
  if (candle.rsi) {
    let sma = simpul.math.mean(series.map((c) => c.rsi));
    candle[`sma${period}Rsi`] = sma;
  }
  if (candle.volume) {
    let sma = simpul.math.mean(series.map((c) => c.volume));
    candle[`sma${period}Volume`] = sma;
  }
}

/*
 *
 * --> ASSIGN LAST
 *
 */

function assignLast(data) {
  for (let i = data.series.length - 1; i >= 0; i--) {
    if (data.series[i].priceLast) {
      data.last = data.series[i];
      break;
    }
  }
}

/*
 *
 * --> SCALE
 *
 */

function scale(array, propName) {
  let high = 0;
  let low = 0;
  for (let item of array) {
    if (item[propName] > high) {
      high = item[propName];
    } else if (item[propName] < low) {
      low = item[propName];
    }
  }
  let size = (high - low) / 100;
  for (let item of array) {
    item[propName] = item[propName] / size;
  }
}
