import { list, get, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import scrapefrom from "scrapefrom";
import { wsj } from "../../../wsj";
import simpul from "simpul";

export const maxDuration = 60;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const screener = searchParams.get("screener")?.toLowerCase() ?? "";

    const timeframe = searchParams.get("timeframe")?.toLowerCase() ?? "";

    const isValidRequest =
      ["etfs", "equities"].includes(screener) &&
      ["daily", "weekly", "monthly"].includes(timeframe);

    if (!isValidRequest) throw new Error("Invalid request.");

    const today = new Date().toLocaleDateString();

    const prefix = `table/${screener}/${timeframe}`;

    const { blobs } = await list({ prefix });

    if (!blobs.length) {
      const rows = await getData(screener, timeframe, today, prefix);
      return NextResponse.json(rows);
    }

    const result = await get(blobs[0].pathname, { access: "private" });

    if (result?.statusCode !== 200) {
      throw new Error("Failed to read blob.");
    }

    const text = await new Response(result.stream).text();

    const rowsCached = JSON.parse(text) || [];

    if (rowsCached[0].updated !== today) {
      const rows = await getData(screener, timeframe, today, prefix);
      return NextResponse.json(rows);
    }

    return NextResponse.json(rowsCached);
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }
}

async function getData(screener, timeframe, today, prefix) {
  const LIMIT = 20 * 2; // Finviz screener page size * pages.
  const IGNORE = ["short", "bear"];
  const screenerUrl = {
    etfs: `https://finviz.com/screener.ashx?f=ipodate_more5,ind_exchangetradedfund,etf_tags_leverage&o=-averagevolume&v=411`,
    equities: `https://finviz.com/screener.ashx?f=ipodate_more5,ind_stocksonly&o=-averagevolume&v=411`,
  }[screener];
  const timeframePreset = {
    daily: "year",
    weekly: "year5",
    monthly: "year20",
  }[timeframe];
  const extract = "td.screener_tickers span";
  const response = await scrapefrom({ url: screenerUrl, extract });
  let rows = [];
  for (const symbol of response.result[extract].slice(0, LIMIT)) {
    try {
      const data = await wsj(symbol, timeframePreset, {
        price: false,
        trend: false,
        vwap: false,
        phase: true,
        normalize: [],
        anchor: [],
        sma: [],
        signal: [],
      });
      if (IGNORE.some((i) => data.name.toLowerCase().includes(i))) continue;
      const signalVol = data.series
        .filter((i) => i.volume > 0)
        .sort((a, b) => b.volume - a.volume)[0];
      const signalAcc = data.series
        .filter((i) => i.phaseAccumulation > 0)
        .sort((a, b) => b.phaseAccumulation - a.phaseAccumulation)[0];
      const rowVal = makeRow(
        symbol,
        data,
        signalVol,
        "volume",
        "VOLUME",
        timeframePreset,
        today,
      );
      const rowAcc = makeRow(
        symbol,
        data,
        signalAcc,
        "phaseAccumulation",
        "ACCUMULATION",
        timeframePreset,
        today,
      );
      rows.push(rowVal, rowAcc);
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
    }
  }
  rows = rows.filter(Boolean).sort((a, b) => b.date - a.date);
  await put(`${prefix}.json`, JSON.stringify(rows), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return rows;
}

function makeRow(symbol, data, signal, valueKey, type, timeframePreset, today) {
  if (!signal) return;
  return {
    symbol,
    name: data.name,
    date: signal.date.getTime(),
    value: simpul.isArray(signal[valueKey])
      ? signal[valueKey][4]
      : Math.round(signal[valueKey]),
    type: type,
    change: simpul.math.change.percent(signal.priceClose, data.last.priceClose),
    timeframe: timeframePreset,
    updated: today,
  };
}

// Signal Sma-Sma:
//
// const signalSmaSma = data.series
//   .filter((i) => i.sma10SignalSma20PriceMeanToPriceMean < 0)
//   .sort((a, b) => {
//     return (
//       a.sma10SignalSma20PriceMeanToPriceMean -
//       b.sma10SignalSma20PriceMeanToPriceMean
//     );
//   })[0];
// const rowSmaSma = makeRow(
//   symbol,
//   data,
//   signalSmaSma,
//   "sma10SignalSma20PriceMeanToPriceMean",
//   "SMA_SMA",
//   timeframeStep,
//   today,
// );
//
// Macd:
//
// const signalMacdTrendIndex = data.series.findLastIndex((i) => {
//   return i.macdTrend?.[0] !== data.last.macdTrend?.[0];
// });
// const signalMacdTrend =
//   signalMacdTrendIndex !== -1 && data.series[signalMacdTrendIndex + 1];
// const rowMacdTrend = makeRow(
//   symbol,
//   data,
//   signalMacdTrend,
//   "macdTrend",
//   "MACD_TREND",
//   timeframeStep,
//   today,
// );
