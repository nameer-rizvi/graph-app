const simpul = require("simpul");

export async function wsj(SYMBOL, TIMEFRAME) {
  if (!SYMBOL?.trim()) throw new Error("Symbol is required");

  SYMBOL = SYMBOL.toUpperCase().trim();

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

  const CODES = [
    [
      "ARCX",
      [
        "SPY",
        "SPXL",
        "SOXL",
        "SOXS",
        "TMF",
        "HYG",
        "SCHD",
        "VTI",
        "VOO",
        "SPHY",
        "VYM",
        "VIG",
        "SPHD",
      ],
    ],
    ["BATS", ["UVXY"]],
    ["CoinDesk", ["BTC"]],
    ["OOTC", ["BKHY"]],
    [
      "XNAS",
      ["QQQ", "TQQQ", "SQQQ", "TLT", "VGLT", "VGIT", "VGSH", "ANGL", "BKCH"],
    ],
    ["XNYS", ["BRK.A", "BRK.B"]],
  ];

  let CODE = CODES[CODES.findIndex((c) => c[1].includes(SYMBOL))]?.[0];

  let SERIES_KEY = CODE
    ? CODE === "CoinDesk"
      ? `CRYPTOCURRENCY/US/CoinDesk/${SYMBOL}USD`
      : CODE === "XNYS"
      ? `STOCK/US/${CODE}/${SYMBOL}`
      : `FUND/US/${CODE}/${SYMBOL}`
    : `STOCK/US//${SYMBOL}`;

  const OPTION = {
    headers: {
      Accept: "application/json",
      "Dylan2010.EntitlementToken": "57494d5ed7ad44af85bc59a51dd87c90",
    },
  };

  const URL =
    "https://api.wsj.net/api/michelangelo/timeseries/history?" +
    new URLSearchParams({
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
    }).toString();

  const request = await fetch(URL, OPTION);

  const json = await request.json();

  if (json.error) throw new Error(json.error);

  if (!json.Series) return;

  const data = {
    djId: json.Series[0].DjId,
    symbol: json.Series[0].Ticker,
    name: json.Series[0].CommonName,
    type: json.Series[0].InstrumentType,
    country: json.Series[0].CountryCode,
    series: [],
  };

  const PriorClose = json.Series[0].ExtraData.find((i) => {
    return i.Name === "PriorClose";
  })?.Value;

  const periods = [5, 10, 20, 50, 100, 200];

  for (let i = 0; i < (json.TimeInfo.Ticks || []).length; i++) {
    let candle = {};

    let tickIndex = i;

    let tick = json.TimeInfo.Ticks[tickIndex];

    assignSession(json.Series[0], tick, candle);

    assignDateProps(tick, candle);

    candle.priceOpen = json.Series[0].DataPoints[i][0];

    candle.priceHigh = json.Series[0].DataPoints[i][1];

    candle.priceLow = json.Series[0].DataPoints[i][2];

    candle.priceLast = json.Series[0].DataPoints[i][3];

    candle.volume = json.Series[1].DataPoints[i][0];

    if (PriorClose && candle.priceLast) {
      candle.priceChange = simpul.math.change.percent(
        PriorClose,
        candle.priceLast
      );
    }

    let series = [...data.series, candle];

    assignVWAPData(candle, series);

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

    if (!candle.vwap) {
      assignSMA200SignalData(candle);
    }

    assignTrendData(candle, series);

    assignPriceCrossoverData(candle, series);

    data.series.push(candle);
  }

  assignLast(data);

  return data;
}

/*
 *
 * --> ASSIGN SESSION
 *
 */

function assignSession(series, tick, candle) {
  let session = series.MarketSessions?.find((marketSession) => {
    return tick >= marketSession.Start && tick < marketSession.End;
  })?.Kind;
  if (session) candle.session = session;
}

/*
 *
 * --> ASSIGN DATE PROPS
 *
 */

function assignDateProps(tick, candle) {
  let date = new Date(tick);
  candle.dateString = date.toLocaleString();
  candle.dateObject = date;
  candle.dateYear = date.getFullYear();
  candle.dateQuarter = Math.floor((date.getMonth() + 3) / 3);
  candle.dateMonth = date.getMonth() + 1;
  candle.dateMonthName = date.toLocaleString("default", { month: "long" });
  candle.dateDate = date.getDate();
  candle.dateWeekday = date.getDay();
  candle.dateWeekdayName = date.toLocaleDateString("default", {
    weekday: "long",
  });
  candle.dateHour = date.getHours();
  candle.dateMinute = date.getMinutes();
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
      price = (s.priceHigh + s.priceLow + s.priceLast) / 3;
      pv += price * s.volume;
      v += s.volume;
    }
  }
  let vwap = +(pv / v).toFixed(3);
  let vwapSignal = -simpul.math.change.percent(price, vwap);
  let vwapValue = pv;
  if (period) {
    candle[`sma${period}Vwap`] = vwap;
    candle[`sma${period}VwapSignal`] = vwapSignal;
    candle[`sma${period}VwapValue`] = vwapValue / period;
  } else {
    candle.vwap = vwap;
    candle.vwapSignal = vwapSignal;
    candle.vwapValue = vwapValue;
    candle.volumeTotal = v;
    candle.value = price * candle.volume;
  }
}

/*
 *
 * --> ASSIGN RSI DATA
 *
 */

function assignRSIData(candle, series, OPTION) {
  if (OPTION.API_QUERY_JSON_SERIES_INDICATOR_RSI !== true) {
    let prev = series[series.length - 2];
    if (series.length === 15) {
      let gain = 0;
      let loss = 0;
      for (let i = 0; i < series.length; i++) {
        let currPrice = series[i]?.priceLast;
        let prevPrice = series[i - 1]?.priceLast;
        let change = simpul.math.change.num(prevPrice, currPrice);
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
      let change = simpul.math.change.num(prev.priceLast, candle.priceLast);
      if (change > 0) gain += change;
      if (change < 0) loss += Math.abs(change);
      let averageGain = gain / 14;
      let averageLoss = loss / 14;
      let rsi = 100 - 100 / (1 + averageGain / averageLoss);
      candle.averageGain = averageGain;
      candle.averageLoss = averageLoss;
      candle.rsi = rsi;
    }
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
  if (series.length > period) {
    let prev = series[series.length - 2];
    let key = `ema${period}`;
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
  }
}

/*
 *
 * --> ASSIGN MACD DATA
 *
 */

function assignMACDData(candle, series, OPTION) {
  if (OPTION.API_QUERY_JSON_SERIES_INDICATOR_MACD !== true) {
    if (candle.ema12 && candle.ema26) {
      candle.macd = candle.ema12 - candle.ema26;
      assignEMA(9, series, candle, "macd");
      candle.macdSignal = candle.ema9macd;
      candle.macdHist = candle.macd - candle.macdSignal;
    }
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
    candle[`sma${period}ColorsRed`] = getPercent(countColor.red);
    candle[`sma${period}ColorsGray`] = getPercent(countColor.gray);
    candle[`sma${period}ColorVolumeGreen`] = getPercent2(countVolume.green);
    candle[`sma${period}ColorVolumeRed`] = getPercent2(countVolume.red);
    candle[`sma${period}ColorVolumeGray`] = getPercent2(countVolume.gray);
    candle[`sma${period}ColorVolumeDiscrepancy`] =
      candle[`sma${period}ColorsGreen`] /
        candle[`sma${period}ColorVolumeGreen`] -
      1;
  } else {
    candle.color = getColor(candle.priceLast, candle.priceOpen);
    candle.colorsGreen = getPercent(countColor.green);
    candle.colorsRed = getPercent(countColor.red);
    candle.colorsGray = getPercent(countColor.gray);
    candle.colorVolumeGreen = getPercent2(countVolume.green);
    candle.colorVolumeRed = getPercent2(countVolume.red);
    candle.colorVolumeGray = getPercent2(countVolume.gray);
    candle.colorVolumeDiscrepancy =
      candle.colorsGreen / candle.colorVolumeGreen - 1;
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
 * --> ASSIGN SMA200 SIGNAL DATA
 *
 */

function assignSMA200SignalData(candle) {
  // Placeholder for vwap, for BTC.
  const price = (candle.priceHigh + candle.priceLow + candle.priceLast) / 3;
  candle.vwap = candle.sma200;
  candle.vwapSignal = -simpul.math.change.percent(price, candle.vwap);
}

/*
 *
 * --> ASSIGN TREND DATA
 *
 */

const trends = [
  "priceChange",
  "priceRange",
  "volume",
  "vwap",
  "vwapSignal",
  "vwapValue",
  "averageGain",
  "averageLoss",
  "rsi",
  "ema9",
  "ema12",
  "ema26",
  "macd",
  "macdSignal",
  "macdHist",
  "colorsGreen",
  "colorVolumeGreen",
  "colorVolumeDiscrepancy",
  "sma5",
  "sma5Rsi",
  "sma5Volume",
  "sma5Vwap",
  "sma5VwapSignal",
  "sma5VwapValue",
  "sma5ColorsGreen",
  "sma5ColorVolumeGreen",
  "sma5ColorVolumeDiscrepancy",
  "sma10",
  "sma10Rsi",
  "sma10Volume",
  "sma10Vwap",
  "sma10VwapSignal",
  "sma10VwapValue",
  "sma10ColorsGreen",
  "sma10ColorVolumeGreen",
  "sma10ColorVolumeDiscrepancy",
  "sma20",
  "sma20Rsi",
  "sma20Volume",
  "sma20Vwap",
  "sma20VwapSignal",
  "sma20VwapValue",
  "sma20ColorsGreen",
  "sma20ColorVolumeGreen",
  "sma20ColorVolumeDiscrepancy",
  "sma50",
  "sma50Rsi",
  "sma50Volume",
  "sma50Vwap",
  "sma50VwapSignal",
  "sma50VwapValue",
  "sma50ColorsGreen",
  "sma50ColorVolumeGreen",
  "sma50ColorVolumeDiscrepancy",
  "sma100",
  "sma100Rsi",
  "sma100Volume",
  "sma100Vwap",
  "sma100VwapSignal",
  "sma100VwapValue",
  "sma100ColorsGreen",
  "sma100ColorVolumeGreen",
  "sma100ColorVolumeDiscrepancy",
  "sma200",
  "sma200Rsi",
  "sma200Volume",
  "sma200Vwap",
  "sma200VwapSignal",
  "sma200VwapValue",
  "sma200ColorsGreen",
  "sma200ColorVolumeGreen",
  "sma200ColorVolumeDiscrepancy",
];

function assignTrendData(candle, series) {
  let prev = series[series.length - 2];
  for (let prop of trends) {
    if (simpul.isNumber(candle[prop]) && simpul.isNumber(prev?.[prop])) {
      if (candle[prop] > prev[prop]) {
        candle[`${prop}Trend`] = "up";
      } else if (candle[prop] < prev[prop]) {
        candle[`${prop}Trend`] = "down";
      } else {
        candle[`${prop}Trend`] = "";
      }
    }
  }
}

/*
 *
 * --> ASSIGN CROSSOVER DATA
 *
 */

const pricecrossovers = [
  "priceOpen",
  "priceHigh",
  "priceLow",
  "priceLast",
  "vwap",
  "ema9",
  "ema12",
  "ema26",
  "sma5",
  "sma5Vwap",
  "sma10",
  "sma10Vwap",
  "sma20",
  "sma20Vwap",
  "sma50",
  "sma50Vwap",
  "sma100",
  "sma100Vwap",
  "sma200",
  "sma200Vwap",
];

function assignPriceCrossoverData(candle, series) {
  let prev = series[series.length - 2];
  if (prev) {
    for (let prop of pricecrossovers) {
      for (let prop2 of pricecrossovers) {
        if (prop !== prop2) {
          let state = "";
          if (prev[prop] <= prev[prop2] && candle[prop] > candle[prop2]) {
            state = "crossover";
          } else if (
            prev[prop] >= prev[prop2] &&
            candle[prop] < candle[prop2]
          ) {
            state = "crossunder";
          } else if (candle[prop] === candle[prop2]) {
            state = "equal";
          } else if (candle[prop] > candle[prop2]) {
            state = "over";
          } else if (candle[prop] < candle[prop2]) {
            state = "under";
          }
          if (state) candle[`${prop}_to_${prop2}`] = state;
        }
      }
    }
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
