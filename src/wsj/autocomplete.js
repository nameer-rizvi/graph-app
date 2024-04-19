export async function autocomplete(symbol) {
  const query = new URLSearchParams({
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

  const url = "https://services.dowjones.com/autocomplete/data?" + query;

  const response = await fetch(url);

  const json = await response.json();

  return json?.symbols?.[0]?.chartingSymbol;
}
