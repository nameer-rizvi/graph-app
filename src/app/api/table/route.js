import scrapefrom from "scrapefrom";
import { wsj } from "../../../wsj";
import simpul from "simpul";
import { NextResponse } from "next/server";

const LIMIT = 25;

const IGNORE = ["short", "bear"];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const screener = searchParams.get("screener")?.toLowerCase() ?? "";

    const timeframe = searchParams.get("timeframe")?.toLowerCase() ?? "";

    const screenerUrl = {
      etfs: `https://finviz.com/screener.ashx?f=ipodate_more15,ind_exchangetradedfund,etf_tags_leverage&o=-e.assetsundermanagement&v=411`,
      equities: `https://finviz.com/screener.ashx?f=ipodate_more15,ind_stocksonly&o=-marketcap&v=411`,
    }[screener];

    const timeframeStep = {
      weekly: "year5",
      monthly: "year20",
    }[timeframe];

    const timeframeRange = {
      weekly: "year20",
      monthly: "year20",
    }[timeframe];

    if (!screenerUrl || !timeframeStep || !timeframeRange) {
      throw new Error("Invalid request.");
    }

    const extract = "td.screener_tickers span";

    const response = await scrapefrom({
      url: screenerUrl,
      fetch: { next: { revalidate: 86400 / 2 } }, // cache for 12 hours
      extract,
    });

    let rows = [];

    for (const symbol of response.result[extract].slice(0, LIMIT)) {
      try {
        const data = await wsj(symbol, timeframeRange, timeframeStep, {
          next: { revalidate: 86400 / 2 }, // cache for 12 hours
        });

        if (IGNORE.some((i) => data.name.toLowerCase().includes(i))) {
          continue;
        }

        const seriesVol = data.series
          .filter((i) => i.volume > 0)
          .sort((a, b) => b.volume - a.volume);

        const seriesAcc = data.series
          .filter((i) => i.phaseAccumulation > 0)
          .sort((a, b) => b.phaseAccumulation - a.phaseAccumulation);

        const seriesSmaSma = data.series
          .filter((i) => i.sma10SignalSma20PriceMeanToPriceMean < 0)
          .sort((a, b) => {
            return (
              a.sma10SignalSma20PriceMeanToPriceMean -
              b.sma10SignalSma20PriceMeanToPriceMean
            );
          });

        if (seriesVol[0]) {
          rows.push({
            symbol,
            name: data.name,
            date: seriesVol[0].date.getTime(),
            value: Math.round(seriesVol[0].volume),
            type: "VOLUME",
            change: simpul.math.change.percent(
              seriesVol[0].priceClose,
              data.last.priceClose,
            ),
            timeframe: timeframeStep,
          });
        }

        if (seriesAcc[0]) {
          rows.push({
            symbol,
            name: data.name,
            date: seriesAcc[0].date.getTime(),
            value: Math.round(seriesAcc[0].volume),
            type: "ACCUMULATION",
            change: simpul.math.change.percent(
              seriesAcc[0].priceClose,
              data.last.priceClose,
            ),
            timeframe: timeframeStep,
          });
        }

        if (seriesSmaSma[0]) {
          rows.push({
            symbol,
            name: data.name,
            date: seriesSmaSma[0].date.getTime(),
            value: seriesSmaSma[0].sma10SignalSma20PriceMeanToPriceMean,
            type: "SMA_SMA",
            change: simpul.math.change.percent(
              seriesSmaSma[0].priceClose,
              data.last.priceClose,
            ),
            timeframe: timeframeStep,
          });
        }
      } catch {
        continue;
      }
    }

    rows = rows.filter(Boolean).sort((a, b) => b.date - a.date);

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }
}
