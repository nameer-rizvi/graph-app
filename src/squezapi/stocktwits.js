export async function stocktwits(SYMBOL, series) {
  if (!SYMBOL?.trim()) throw new Error("Symbol is required");

  SYMBOL = SYMBOL.toUpperCase().trim();

  let cursorNext;

  const API = `https://api.stocktwits.com/api/2/streams/symbol/${SYMBOL}.json?filter=top&limit=30`;

  const AUTH_TOKEN = "f58b811b58ad9703b0699b249393ddd65cbcb0af";

  let page = 1;

  let pageMax = 10;

  const cutoff = new Date(series[0].date);

  const messages = [];

  while (cursorNext !== null && page <= pageMax) {
    try {
      const response = await fetch(cursorNext || API, {
        headers: { authorization: `OAuth ${AUTH_TOKEN}` },
      });

      const json = await response.json();

      if (!json.messages) throw new Error("No messages.");

      const jsonMessages = json.messages.filter((m) => {
        return new Date(m.created_at) >= cutoff;
      });

      messages.push(...jsonMessages);

      if (jsonMessages.length === json.messages.length && json.cursor.max) {
        cursorNext = `${API}&max=${json.cursor.max}`;
      } else {
        cursorNext = null;
      }

      // page++;
    } catch {
      cursorNext = null;
    }

    for (let i = 0; i < series.length; i++) {
      let curr = series[i];

      let next = series[i + 1];

      let ms = messages.filter((m) => {
        let mDate = new Date(m.created_at);
        let cDate = new Date(curr.date);
        let nDate = next?.date ? new Date(next.date) : new Date();
        return mDate >= cDate && mDate < nDate;
      });

      curr.messageCount = ms.length;

      curr.messageSentiment = ms.reduce((r, m) => {
        return m.entities?.sentiment?.basic ? r + 1 : r;
      }, 0);

      curr.messageSentimentBullish = ms.reduce((r, m) => {
        return m.entities?.sentiment?.basic === "Bullish" ? r + 1 : r;
      }, 0);

      curr.messageSentimentBearish = ms.reduce((r, m) => {
        return m.entities?.sentiment?.basic === "Bearish" ? r + 1 : r;
      }, 0);

      curr.messageSentimentNeutral = ms.reduce((r, m) => {
        return !m.entities?.sentiment?.basic ? r + 1 : r;
      }, 0);

      curr.messageLikes = ms.reduce((r, m) => {
        if (m.entities?.sentiment?.basic) {
          return r + (m.likes?.total || 0);
        } else return r;
      }, 0);

      curr.messageLikesBullish = ms.reduce((r, m) => {
        if (m.entities?.sentiment?.basic === "Bullish") {
          return r + (m.likes?.total || 0);
        } else return r;
      }, 0);

      curr.messageLikesBearish = ms.reduce((r, m) => {
        if (m.entities?.sentiment?.basic === "Bearish") {
          return r + (m.likes?.total || 0);
        } else return r;
      }, 0);

      curr.messageLikesNeutral = ms.reduce((r, m) => {
        if (!m.entities?.sentiment?.basic) {
          return r + (m.likes?.total || 0);
        } else return r;
      }, 0);
    }
  }
}
