const utils = require("../utils");

export async function tickeron(SYMBOL) {
  SYMBOL = utils.cleanSymbol(SYMBOL);

  const response = await fetch(`https://tickeron.com/ticker/${SYMBOL}`);

  const html = await response.text();

  const find = `"@id":"/ticker/${SYMBOL}/","image":{"@type":"ImageObject",`;

  const string = html.substr(html.indexOf(find), 100).toLowerCase();

  const isBuy = string.includes("/buy");

  const isSell = string.includes("/sell");

  return { isBuy, isSell };
}
