"use client";
import dynamic from "next/dynamic";
import { useContext, useMemo } from "react";
import { DataContext } from "../providers";
import simpul from "simpul";
import Box from "@mui/material/Box";
import CheckIcon from "@mui/icons-material/Check";
import ToggleButton from "@mui/material/ToggleButton";
import Typography from "@mui/material/Typography";

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
    let index = 0;
    for (let tick of data.data?.series || []) {
      let point = { index };
      for (let seriesConfig of seriesConfigs) {
        let v = tick[seriesConfig[0]];
        if (typeof v === "number") {
          if (min === undefined || v < min) min = v;
          if (max === undefined || v > max) max = v;
          point[seriesConfig[0]] = v;
        } else point[seriesConfig[0]] = null;
      }
      point.datetime = new Date(tick.dateObject).getTime();
      dataset.push(point);
      index++;
    }
    return { dataset, min, max };
  }, [seriesConfigs, data.data?.series]);

  const xAxis =
    data.timeframe.value === "week" || data.timeframe.value === "week2"
      ? {
          dataKey: "index",
          scaleType: "linear",
          valueFormatter: (v) => {
            let d = new Date(chart.dataset[v]?.datetime);
            return simpul.datestring(d, "M/D, h:m p");
          },
        }
      : {
          dataKey: "datetime",
          scaleType: "time",
          valueFormatter: (v) =>
            data.timeframe.value === "day"
              ? new Date(v).toLocaleTimeString()
              : new Date(v).toLocaleDateString(),
        };

  if (!data.isMounted || !chart.dataset.length) return;

  return (
    <Box mt={6} mb={4} sx={{ height: props.show ? 200 : 0 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          width: "fit-content",
        }}
        onClick={props.toggleShow}
        gutterBottom
      >
        <ToggleButton
          value="check"
          size="small"
          selected={props.show}
          sx={{ height: 10, width: 10 }}
        >
          <CheckIcon sx={{ height: 8, width: 8 }} />
        </ToggleButton>
        <Typography variant="overline" display="block">
          {props.title}
        </Typography>
      </Box>
      {props.show ? (
        <LineChart
          skipAnimation
          axisHighlight={{ x: "line", y: "line" }}
          xAxis={[xAxis]}
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
          // grid={{ vertical: true, horizontal: true }}
        />
      ) : null}
    </Box>
  );
}
