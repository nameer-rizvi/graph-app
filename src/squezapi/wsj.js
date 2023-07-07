const simpul = require("simpul");

export async function wsj(SYMBOL, TIMEFRAME) {
  if (!SYMBOL?.trim()) throw new Error("Symbol is required");

  const STEP = {
    day: "PT5M",
    week: "PT10M",
    week2: "PT1H",
    month: "P1D",
    quarter: "P1D",
    year: "P1D",
    year5: "P7D",
    year10: "P1M",
  }[TIMEFRAME || "day"];

  const TIMEFRAME2 = {
    day: "D1",
    week: "D5",
    week2: "D10",
    month: "P29D",
    quarter: "P3M",
    year: "P1Y",
    year5: "P5Y",
    year10: "P10Y",
  }[TIMEFRAME || "day"];

  if (
    SYMBOL.toLowerCase().includes("btc") ||
    SYMBOL.toLowerCase().includes("bitcoin")
  ) {
    SYMBOL = "CRYPTOCURRENCY/US/CoinDesk/BTCUSD";
  } else if (SYMBOL.toLowerCase().includes("spy")) {
    SYMBOL = "FUND/US/ARCX/SPY";
  } else if (SYMBOL.toLowerCase().includes("spxl")) {
    SYMBOL = "FUND/US/ARCX/SPXL";
  } else if (SYMBOL.toLowerCase().includes("soxl")) {
    SYMBOL = "FUND/US/ARCX/SOXL";
  } else if (SYMBOL.toLowerCase().includes("soxs")) {
    SYMBOL = "FUND/US/ARCX/SOXS";
  } else if (SYMBOL.toLowerCase().includes("tmf")) {
    SYMBOL = "FUND/US/ARCX/TMF";
  } else if (SYMBOL.toLowerCase().includes("tlt")) {
    SYMBOL = "FUND/US/XNAS/TLT";
  } else if (SYMBOL.toLowerCase().includes("hyg")) {
    SYMBOL = "FUND/US/ARCX/HYG";
  } else if (SYMBOL.toLowerCase().endsWith("qqq")) {
    SYMBOL = `FUND/US/XNAS/${SYMBOL}`;
  } else if (SYMBOL.toLowerCase().endsWith("uvxy")) {
    SYMBOL = "FUND/US/BATS/UVXY";
  } else if (!SYMBOL.includes("/")) {
    SYMBOL = `STOCK/US//${SYMBOL}`;
  }

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
            Key: SYMBOL,
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
              {
                Kind: "RelativeStrengthIndex",
                SeriesId: "i5",
                Parameters: [
                  {
                    Name: "Period",
                    Value: 14,
                  },
                ],
              },
              {
                Kind: "MovingAverageConvergenceDivergence",
                SeriesId: "i2",
                Parameters: [
                  {
                    Name: "EMA1",
                    Value: 12,
                  },
                  {
                    Name: "EMA2",
                    Value: 26,
                  },
                  {
                    Name: "SignalLine",
                    Value: 9,
                  },
                ],
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

  for (let i = 0; i < (json.TimeInfo.Ticks || []).length; i++) {
    let tick = json.TimeInfo.Ticks[i];
    let session = data.MarketSessions?.find((marketSession) => {
      return tick >= marketSession.Start && tick < marketSession.End;
    })?.Kind;
    data.series.push({
      session,
      date: new Date(tick),
      priceOpen: json.Series[0].DataPoints[i][0],
      priceHigh: json.Series[0].DataPoints[i][1],
      priceLow: json.Series[0].DataPoints[i][2],
      priceLast: json.Series[0].DataPoints[i][3],
      volume: json.Series[1].DataPoints[i][0],
      rsi: json.Series[2].DataPoints[i][0],
      macd: json.Series[3].DataPoints[i][0],
      macdSignal: json.Series[3].DataPoints[i][1],
      macdHist: json.Series[3].DataPoints[i][2],
    });
  }

  const PriorClose = json.Series[0].ExtraData.find((i) => {
    return i.Name === "PriorClose";
  })?.Value;

  let prevs = [];

  let periods = [1, 5, 10, 20, 50, 100, 200];

  for (let i of data.series) {
    prevs.push(i);
    makeCandlestickDataPriceChange(i, PriorClose);
    makeCandlestickDataVWAP(prevs, null, i);
    makeCandlestickDataColor(prevs, null, i);
    for (let period of periods) {
      if (prevs.length >= period) {
        let prevsSlice = prevs.slice(-period);
        makeCandlestickDataSMA(prevsSlice, period, i);
        makeCandlestickDataEMA(prevsSlice, period, i);
        makeCandlestickDataVolume(prevsSlice, period, i);
        makeCandlestickDataVWAP(prevsSlice, period, i);
        makeCandlestickDataColor(prevsSlice, period, i);
      }
    }
  }

  for (let i = data.series.length - 1; i >= 0; i--) {
    if (data.series[i].priceLast) {
      data.last = data.series[i];
      break;
    }
  }

  return data;
}

/*
 *
 * MAKE CANDLE DATA [PRICE CHANGE]
 *
 */

function makeCandlestickDataPriceChange(i, PriorClose) {
  if (PriorClose && i.priceLast) {
    i.priceChange = simpul.math.change.percent(PriorClose, i.priceLast);
  }
}

/*
 *
 * MAKE CANDLE DATA [VWAP]
 *
 */

function makeCandlestickDataVWAP(prevs, period, i) {
  let price = 0;
  let pv = 0;
  let v = 0;
  for (let p of prevs) {
    if (p.priceHigh && p.priceLow && p.priceLast && p.volume) {
      price = (p.priceHigh + p.priceLow + p.priceLast) / 3;
      pv += price * p.volume;
      v += p.volume;
    }
  }
  let vwap = +(pv / v).toFixed(3);
  let vwapSignal = -simpul.math.change.percent(price, vwap);
  let vwapValue = pv;
  if (period) {
    i[`sma${period}Vwap`] = vwap;
    i[`sma${period}VwapSignal`] = vwapSignal;
    i[`sma${period}VwapValue`] = vwapValue;
  } else {
    i.vwap = vwap;
    i.vwapSignal = vwapSignal;
    i.vwapValue = vwapValue;
    i.volumeTotal = v;
    i.value = price * i.volume;
  }
}
/*
 *
 * MAKE CANDLE DATA [COLOR]
 *
 */

function makeCandlestickDataColor(prevs, period, i) {
  let getCandle = (a, b) => (a < b ? "green" : a > b ? "red" : "gray");
  let candles = { green: 0, red: 0, gray: 0, total: 0 };
  let candleVolume = { green: 0, red: 0, gray: 0, total: 0 };
  for (let p of prevs) {
    if (p.priceOpen && p.priceLast) {
      let candle = getCandle(p.priceOpen, p.priceLast);
      candles[candle]++;
      candles.total++;
      if (typeof p.volume === "number") {
        candleVolume[candle] += p.volume;
        candleVolume.total += p.volume;
      }
    }
  }
  let getPercent = (num) => simpul.math.percent(num, candles.total);
  let getPercent2 = (num) => simpul.math.percent(num, candleVolume.total);
  if (period) {
    let prevsPriceOpen = prevs[0]?.priceOpen;
    let prevsPriceLast = prevs[prevs.length - 1]?.priceLast;
    i[`sma${period}Candle`] = getCandle(prevsPriceOpen, prevsPriceLast);
    i[`sma${period}CandlesGreen`] = getPercent(candles.green);
    i[`sma${period}CandlesRed`] = getPercent(candles.red);
    i[`sma${period}CandlesGray`] = getPercent(candles.gray);
    i[`sma${period}CandleVolumeGreen`] = getPercent2(candleVolume.green);
    i[`sma${period}CandleVolumeRed`] = getPercent2(candleVolume.red);
    i[`sma${period}CandleVolumeGray`] = getPercent2(candleVolume.gray);
    i[`sma${period}CandleVolumeDiscrepancy`] =
      i[`sma${period}CandlesGreen`] / i[`sma${period}CandleVolumeGreen`] - 1;
  } else {
    i.candle = getCandle(i.priceOpen, i.priceLast);
    i.candlesGreen = getPercent(candles.green);
    i.candlesRed = getPercent(candles.red);
    i.candlesGray = getPercent(candles.gray);
    i.candleVolumeGreen = getPercent2(candleVolume.green);
    i.candleVolumeRed = getPercent2(candleVolume.red);
    i.candleVolumeGray = getPercent2(candleVolume.gray);
    i.candleVolumeDiscrepancy = i.candlesGreen / i.candleVolumeGreen - 1;
  }
}

/*
 *
 * MAKE CANDLE DATA [SMA]
 *
 */

function makeCandlestickDataSMA(prevs, period, i) {
  let sum = prevs.reduce((r, p) => r + p.priceLast, 0);
  i[`sma${period}`] = +(sum / period).toFixed(3);
}

/*
 *
 * MAKE CANDLE DATA [EMA]
 *
 */

function makeCandlestickDataEMA(prevs, period, i) {
  let key = `ema${period}`;
  let last = prevs[prevs.length - 2];
  let previousEMA = last?.[key] ?? last?.[`sma${period}`];
  if (previousEMA) {
    let k = 2 / (period + 1);
    i[key] = k * (i.priceLast - previousEMA) + previousEMA;
  }
}

/*
 *
 * MAKE CANDLE DATA [VOLUME]
 *
 */

function makeCandlestickDataVolume(prevs, period, i) {
  let sum = prevs.reduce((r, p) => r + p.volume, 0);
  i[`sma${period}Volume`] = +(sum / period).toFixed(3);
}
