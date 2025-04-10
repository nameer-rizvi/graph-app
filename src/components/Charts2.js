import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { isNumber, isDate, capitalize } from "simpul";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import simpul from "simpul";

const LineChart = dynamic(
  () => import("@mui/x-charts/LineChart").then((mod) => mod.LineChart),
  { ssr: false },
);

const DATA_LIMIT = 500;

export function Charts2({ data, axis }) {
  const dataset = useDataset(data, axis);

  if (!dataset.length || !axis.x || !axis.y.length) return;

  return (
    <Box mt={2} mb={4} sx={{ height: 500 }}>
      <ChartTitle axis={axis} />
      <LineChart
        axisHighlight={{ x: "line", y: "line" }}
        xAxis={[getXAxis(axis, dataset)]}
        series={getSeries(axis)}
        margin={{ top: 10, bottom: 50, left: 75 }}
        legend={{ hidden: true }}
        dataset={dataset}
      />
    </Box>
  );
}

function useDataset(data, axis) {
  const [dataset, setDataset] = useState([]);
  useEffect(() => {
    if (data.length <= DATA_LIMIT) {
      setDataset(parsePoints(data, axis));
    } else {
      const step = Math.max(1, Math.floor(data.length / DATA_LIMIT));
      const arr = [];
      for (let i = 0; i < data.length; i += step) arr.push(data[i]);
      const lastA = JSON.stringify(data[data.length - 1]);
      const lastB = JSON.stringify(arr[arr.length - 1]);
      if (lastA !== lastB) arr.push(data[data.length - 1]);
      setDataset(parsePoints(arr, axis));
    }
  }, [data, axis]);
  return dataset;
}

function parsePoints(data = [], axis) {
  const arr = [];
  const keys = [...axis.y, axis.x].filter(Boolean);
  if (!keys.length) return arr;
  for (let i = 0; i < data.length; i++) {
    const point = {};
    for (const k of keys) {
      if (k === "index") {
        point[k] = i;
      } else if (isNumber(data[i][k])) {
        point[k] = data[i][k];
      } else if (isDate(data[i][k])) {
        point[k] = new Date(data[i][k]).getTime();
      }
    }
    arr.push(point);
  }
  return arr;
}

function ChartTitle({ axis }) {
  const strings = [];
  if (axis.x) strings.push(`X: ${axis.x}`);
  if (axis.y.length) strings.push(`Y: ${axis.y.join(", ")}`);
  return (
    <Typography variant="overline" display="block" gutterBottom>
      {strings.join(", ")}
    </Typography>
  );
}

function getXAxis(axis, dataset) {
  const point = dataset.find((i) => i[axis.x]);
  const isDatetime = axis.x.includes("date") || axis.x.includes("time");
  return {
    dataKey: axis.x,
    scaleType: isDatetime ? "time" : "linear",
    valueFormatter: (v) =>
      isDatetime ? new Date(v).toLocaleDateString() : v.toLocaleString(),
  };
}

function getSeries(axis) {
  return axis.y.map((y) => ({
    showMark: false,
    dataKey: y,
    label: capitalize(y),
    valueFormatter: (v) => simpul.numberstring(v),
    highlightScope: {
      highlighted: "series",
      faded: "global",
    },
  }));
}
