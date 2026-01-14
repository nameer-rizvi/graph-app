export async function autocomplete(symbol) {
  const url = new URL("https://services.dowjones.com/autocomplete/data");

  url.search = new URLSearchParams({
    count: 1,
    q: symbol,
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

export function replaceSeriesKey(url, oldSeriesKey, newSeriesKey) {
  const jsonStr = url.searchParams.get("json");

  const jsonObj = JSON.parse(jsonStr);

  if (jsonObj.Series && Array.isArray(jsonObj.Series)) {
    jsonObj.Series = jsonObj.Series.map((series) => {
      if (series.Key === oldSeriesKey) return { ...series, Key: newSeriesKey };
      return series;
    });
  }

  url.searchParams.set("json", JSON.stringify(jsonObj));
}
