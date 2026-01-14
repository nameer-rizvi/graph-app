import simpul from "simpul";
import { useDataStore } from "./useDataStore";
import useAsyncFetch from "async-fetch";
import { useEffect } from "react";
import { changeFavicon } from "../utils";

export function useData() {
  const symbol = useDataStore("symbol", "", { isParam: true });

  const timeframe = useDataStore("timeframe", "day", { isParam: true });

  const data = useDataStore("data", {});

  const request = useAsyncFetch("/api/data", {
    query: { symbol: symbol.value, timeframe: timeframe.value },
    ignoreRequest: !simpul.isStringNonEmpty(symbol.value),
    onSuccess: data.update,
    ignoreCleanup: true,
  });

  useEffect(() => {
    request.sendRequest();
  }, [symbol.value, timeframe.value]);

  useEffect(() => {
    const symbolTitle = data.value?.symbol?.toUpperCase();
    const priceClose = simpul.numberString(data.value?.last?.priceClose, ["$"]);
    if (symbolTitle && priceClose) {
      document.title = [symbolTitle, priceClose].join(" - ");
    } else if (symbolTitle) {
      document.title = `Graph App - ${symbolTitle}`;
    } else document.title = "Graph App";
  }, [data.value?.symbol, data.value?.last?.priceClose]);

  useEffect(() => {
    console.log(data.value?.last);
    if (data.value?.last?.priceChangeCumulative > 0) {
      changeFavicon("favicon_blue_circle");
    } else if (data.value?.last?.priceChangeCumulative < 0) {
      changeFavicon("favicon_red_circle");
    } else if (data.value?.last?.priceChangeCumulative === 0) {
      changeFavicon("favicon_white_circle");
    } else changeFavicon("favicon");
  }, [data.value?.last?.priceChangeCumulative]);

  return {
    symbol,
    timeframe,
    ...request,
    data: request.data || data.value,
  };
}
