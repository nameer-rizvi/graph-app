import dynamic from "next/dynamic";
import { useContext, useMemo } from "react";
import { DataContext } from "../context";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import simpul from "simpul";

const LineChart = dynamic(
  () => import("@mui/x-charts/LineChart").then((mod) => mod.LineChart),
  { ssr: false },
);

export function Chart(props) {
  const data = useContext(DataContext);

  const seriesConfigs = props.seriesConfigs.filter((i) => {
    const v = data.data?.series?.some((j) => typeof j[i[0]] === "number");
    const c = i[4] ? i[4](data) : true;
    return v && c;
  });

  seriesConfigs.reverse();

  const chart = useMemo(() => {
    let dataset = [];
    let min, max;
    for (let tick of data.data?.series || []) {
      let point = {};
      for (let seriesConfig of seriesConfigs) {
        let v = tick[seriesConfig[0]];
        if (typeof v === "number") {
          if (min === undefined || v < min) min = v;
          if (max === undefined || v > max) max = v;
          point[seriesConfig[0]] = v;
        }
      }
      point.datetime = new Date(tick.dateObject).getTime();
      dataset.push(point);
    }
    return { dataset, min, max };
  }, [seriesConfigs, data.data?.series]);

  const datetimeparse =
    data.timeframe.value === "day"
      ? "toLocaleTimeString"
      : data.timeframe.value === "week" || data.timeframe.value === "week2"
      ? "toLocaleString"
      : "toLocaleDateString";

  if (data.render && chart.dataset.length) {
    return (
      <Box mt={6} mb={4} sx={{ height: 200 }}>
        <Typography variant="overline" display="block" gutterBottom>
          {props.title}
        </Typography>
        <LineChart
          axisHighlight={{ x: "line", y: "line" }}
          xAxis={[
            {
              dataKey: "datetime",
              scaleType: "time",
              valueFormatter: (v) => new Date(v)[datetimeparse](),
            },
          ]}
          yAxis={[
            {
              tickNumber: 5,
              min: typeof props.min === "number" ? props.min : chart.min,
              max: typeof props.max === "number" ? props.max : chart.max,
            },
          ]}
          series={seriesConfigs.map((config) => ({
            showMark: false,
            dataKey: config[0],
            label: config[1],
            color: config[2],
            valueFormatter: config[3]
              ? (v) => simpul.numberstring(v, config[3])
              : undefined,
            highlightScope: {
              highlighted: "series",
              faded: "global",
            },
          }))}
          dataset={chart.dataset}
          legend={{ hidden: true }}
          margin={{ top: 10, bottom: 50 }}
        />
      </Box>
    );
  }
}
