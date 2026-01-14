import { useCSR } from "./useCSR";
import { useLocalStorage } from "./useLocalStorage";
import useAsyncFetch from "async-fetch";
import { useEffect } from "react";
import simpul from "simpul";
import { changeFavicon } from "../utils";

export function useData() {
  const csr = useCSR();

  const symbol = useLocalStorage("symbol", "", { isParam: true });

  const timeframe = useLocalStorage("timeframe", "day", { isParam: true });

  const data = useLocalStorage("data", {});

  const request = useAsyncFetch("/api/data", {
    params: { symbol: symbol.value, timeframe: timeframe.value },
    deps: [symbol.value, timeframe.value],
    ignoreRequest: !symbol.value?.length,
    onSuccess: data.update,
    ignoreCleanup: true,
  });

  useEffect(() => {
    const symbolTitle = data.value?.symbol?.toUpperCase();
    const priceClose = simpul.numberstring(data.value?.last?.priceClose, ["$"]);
    if (symbolTitle && priceClose) {
      document.title = [symbolTitle, priceClose].join(" - ");
    } else if (symbolTitle) {
      document.title = `Graph App - ${symbolTitle}`;
    } else document.title = "Graph App";
  }, [data.value?.symbol, data.value?.last?.priceClose]);

  useEffect(() => {
    if (data.value?.last?.priceChangeCumulative > 0) {
      changeFavicon("favicon_blue_circle");
    } else if (data.value?.last?.priceChangeCumulative < 0) {
      changeFavicon("favicon_red_circle");
    } else if (data.value?.last?.priceChangeCumulative === 0) {
      changeFavicon("favicon_white_circle");
    } else changeFavicon("favicon");
  }, [data.value?.last?.priceChangeCumulative]);

  return {
    ...csr,
    symbol,
    timeframe,
    ...request,
    data: request.data || data.value,
  };
}
