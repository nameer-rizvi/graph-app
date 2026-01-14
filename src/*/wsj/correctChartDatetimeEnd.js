export function correctChartDatetimeEnd(data) {
  const curr = EST(new Date());

  const last = EST(data.last.dateObject);

  const isDate = curr.getDate() === last.getDate();

  const isEarly = last.getHours() < (data.isCurrency ? 17 : 20);

  if (isDate && isEarly) {
    const time = data.isCurrency ? "17:00:00" : "20:00:00";

    const date = new Date(`${last.toDateString()} ${time} EST`);

    data.series.push({ dateObject: date });
  }
}

function EST(date) {
  const d = date.toLocaleString("en-US", { timeZone: "America/New_York" });
  return new Date(d);
}
