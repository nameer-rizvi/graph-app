import dynamic from "next/dynamic";
import { useContext, useMemo } from "react";
import { DataContext } from "../context";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const LineChart = dynamic(
  () => import("@mui/x-charts/LineChart").then((mod) => mod.LineChart),
  { ssr: false },
);

export function Chart(props) {
  const data = useContext(DataContext);

  const seriesConfigs = props.seriesConfigs.filter((i) => {
    const v = data.data?.series?.some((j) => typeof j[i[0]] === "number");
    const c = i[3] ? i[3](data) : true;
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
    // if (min !== 0 && min !== 100) min = min - min * 0.1;
    // if (max !== 0 && max !== 100) max = max + max * 0.1;
    return { dataset, min, max };
  }, [seriesConfigs, data.data?.series]);

  console.log(chart);

  if (data.render && chart.dataset.length) {
    return (
      <Box mt={6} mb={4} sx={{ height: 220 }}>
        <Typography variant="overline" display="block" gutterBottom>
          {props.title}
        </Typography>
        <LineChart
          axisHighlight={{ x: "line", y: "line" }}
          yAxis={[{ min: chart.min, max: chart.max }]}
          xAxis={[
            {
              dataKey: "datetime",
              scaleType: "time",
              valueFormatter: (v) => new Date(v).toLocaleString(),
            },
          ]}
          series={seriesConfigs.map((config) => ({
            dataKey: config[0],
            label: config[1],
            color: config[2],
            showMark: false,
          }))}
          dataset={chart.dataset}
          legend={{ hidden: true }}
        />
      </Box>
    );
  }
}
