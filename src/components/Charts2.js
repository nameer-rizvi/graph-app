import { useState, useEffect } from "react";
import { isNumber, isDate, capitalize, numberString } from "simpul";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";

const DATA_LIMIT = 500;

export function Charts2({ data, axis }) {
  const dataset = useDataset(data, axis);

  if (!dataset.length || !axis.x || !axis.y.length) return;

  return (
    <Box mt={2} mb={4} sx={{ height: 500 }}>
      <LineChart
        axisHighlight={{ x: "line", y: "line" }}
        xAxis={[getXAxis(axis)]}
        series={getSeries(axis)}
        dataset={dataset}
        margin={{ bottom: 0, left: 0, right: 0 }}
      />
    </Box>
  );
}

function useDataset(data, axis) {
  const [dataset, setDataset] = useState([]);
  useEffect(() => {
    const startRange = Math.max(0, Math.min(100, axis.range?.[0] || 0));
    const endRange = Math.max(0, Math.min(100, axis.range?.[1] || 100));
    const startIndex = Math.floor((startRange / 100) * data.length);
    const endIndex = Math.ceil((endRange / 100) * data.length);
    const sliced = data.slice(startIndex, endIndex);
    if (sliced.length <= DATA_LIMIT) {
      setDataset(parsePoints(sliced, axis));
    } else if (sliced.length) {
      const step = Math.max(1, Math.floor(sliced.length / DATA_LIMIT));
      const arr = [];
      for (let i = 0; i < sliced.length; i += step) arr.push(sliced[i]);
      const lastA = JSON.stringify(sliced[sliced.length - 1]);
      const lastB = JSON.stringify(arr[arr.length - 1]);
      if (lastA !== lastB) arr.push(sliced[sliced.length - 1]);
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

function getXAxis(axis) {
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
    connectNulls: true,
    showMark: false,
    dataKey: y,
    label: capitalize(y),
    valueFormatter: (v) => numberString(v, []),
    highlightScope: {
      highlighted: "series",
      faded: "global",
    },
  }));
}
