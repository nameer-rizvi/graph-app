export async function wsj_autocomplete(SYMBOL) {
  const params = new URLSearchParams({
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

  const url = "https://services.dowjones.com/autocomplete/data?" + params;

  const response = await fetch(url);

  const json = await response.json();

  return json?.symbols?.[0]?.chartingSymbol;
}
