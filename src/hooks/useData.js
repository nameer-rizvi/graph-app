import { useCSR } from "./useCSR";
import { useLocalStore } from "./useLocalStore";
import useAsyncFetch from "async-fetch";
import { useEffect } from "react";
import simpul from "simpul";
import { APP_NAME } from "../constant";
import { changeFavicon } from "../utils";

export function useData() {
  const csr = useCSR();

  const symbol = useLocalStore("symbol", "");

  const timeframe = useLocalStore("timeframe", "day");

  const data = useLocalStore("data", {});

  const request = useAsyncFetch("/api/data", {
    params: { symbol: symbol.value, timeframe: timeframe.value },
    deps: [symbol.value, timeframe.value],
    ignoreRequest: !symbol.value,
    onSuccess: data.update,
    cachetime: getPoll() / 2,
    poll: getPoll(),
    ignoreCleanup: true,
  });

  useEffect(() => {
    const symbolTitle = data.value.symbol?.toUpperCase();
    const priceLast = simpul.numberstring(data?.value?.last?.priceLast, ["$"]);
    if (symbolTitle && priceLast) {
      document.title = [symbolTitle, priceLast].join(" - ");
    } else if (symbolTitle) {
      document.title = [APP_NAME, symbolTitle].join(" - ");
    } else document.title = APP_NAME;
  }, [data.value.symbol, data?.value?.last?.priceLast]);

  useEffect(() => {
    if (data?.value?.last?.priceChange > 0) {
      changeFavicon("favicon_blue_circle");
    } else if (data?.value?.last?.priceChange < 0) {
      changeFavicon("favicon_red_circle");
    } else if (data?.value?.last?.priceChange === 0) {
      changeFavicon("favicon_white_circle");
    } else changeFavicon("favicon");
  }, [data?.value?.last?.priceChange]);

  return {
    ...csr,
    symbol,
    timeframe,
    ...request,
    data: request.data || data.value,
  };
}

function getPoll() {
  const day = new Date().getDay();
  const hour = new Date().getHours();
  if (day === 0 || day === 6) {
    return 600000;
  } else if (hour > 4 && hour < 20) {
    return 300000;
  } else {
    return 450000;
  }
}
