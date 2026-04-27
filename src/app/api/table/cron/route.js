import { put } from "@vercel/blob";
import scrapefrom from "scrapefrom";
import { wsj } from "../../../../wsj";
import simpul from "simpul";

const LIMIT = 10;
const IGNORE = ["short", "bear"];
const SCREENERS = ["etfs", "equities"];
const TIMEFRAMES = ["weekly", "monthly"];

export const maxDuration = 60;

export async function GET(request) {
  const auth = request.headers.get("authorization");

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  for (const screener of SCREENERS) {
    for (const timeframe of TIMEFRAMES) {
      try {
        const rows = await fetchRows(screener, timeframe);
        await put(`table/${screener}/${timeframe}.json`, JSON.stringify(rows), {
          access: "public",
          contentType: "application/json",
          addRandomSuffix: false,
        });
      } catch {
        continue;
      }
    }
  }

  return new Response("ok");
}

async function fetchRows(screener, timeframe) {
  const screenerUrl = {
    etfs: `https://finviz.com/screener.ashx?f=ipodate_more15,ind_exchangetradedfund,etf_tags_leverage&o=-e.assetsundermanagement&v=411`,
    equities: `https://finviz.com/screener.ashx?f=ipodate_more15,ind_stocksonly&o=-marketcap&v=411`,
  }[screener];

  const timeframeStep = { weekly: "year5", monthly: "year20" }[timeframe];

  const timeframeRange = { weekly: "year20", monthly: "year20" }[timeframe];

  const extract = "td.screener_tickers span";

  const response = await scrapefrom({ url: screenerUrl, extract });

  let rows = [];

  for (const symbol of response.result[extract].slice(0, LIMIT)) {
    try {
      const data = await wsj(symbol, timeframeRange, timeframeStep);

      if (IGNORE.some((i) => data.name.toLowerCase().includes(i))) continue;

      const signalVol = data.series
        .filter((i) => i.volume > 0)
        .sort((a, b) => b.volume - a.volume)[0];

      const signalAcc = data.series
        .filter((i) => i.phaseAccumulation > 0)
        .sort((a, b) => b.phaseAccumulation - a.phaseAccumulation)[0];

      const signalSmaSma = data.series
        .filter((i) => i.sma10SignalSma20PriceMeanToPriceMean < 0)
        .sort((a, b) => {
          return (
            a.sma10SignalSma20PriceMeanToPriceMean -
            b.sma10SignalSma20PriceMeanToPriceMean
          );
        })[0];

      if (signalVol) {
        rows.push({
          symbol,
          name: data.name,
          date: signalVol.date.getTime(),
          value: Math.round(signalVol.volume),
          type: "VOLUME",
          change: simpul.math.change.percent(
            signalVol.priceClose,
            data.last.priceClose,
          ),
          timeframe: timeframeStep,
        });
      }

      if (signalAcc) {
        rows.push({
          symbol,
          name: data.name,
          date: signalAcc.date.getTime(),
          value: Math.round(signalAcc.phaseAccumulation),
          type: "ACCUMULATION",
          change: simpul.math.change.percent(
            signalAcc.priceClose,
            data.last.priceClose,
          ),
          timeframe: timeframeStep,
        });
      }

      if (signalSmaSma) {
        rows.push({
          symbol,
          name: data.name,
          date: signalSmaSma.date.getTime(),
          value: signalSmaSma.sma10SignalSma20PriceMeanToPriceMean,
          type: "SMA_SMA",
          change: simpul.math.change.percent(
            signalSmaSma.priceClose,
            data.last.priceClose,
          ),
          timeframe: timeframeStep,
        });
      }
    } catch {
      continue;
    }
  }

  return rows.filter(Boolean).sort((a, b) => b.date - a.date);
}
