import { useContext, useMemo } from "react";
import { DataContext } from "../providers";
import simpul from "simpul";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import CheckIcon from "@mui/icons-material/Check";
import Typography from "@mui/material/Typography";
import { LineChart } from "@mui/x-charts/LineChart";

export function Chart({ seriesConfigs, show, toggleShow, title, ...rest }) {
  const data = useContext(DataContext);

  const configs = seriesConfigs.filter((i) => {
    return data.data?.series?.some((j) => simpul.isNumber(j[i[0]]));
  });

  configs.reverse();

  const chart = useMemo(() => {
    const dataset = [];
    let min, max;
    let index = 0;
    for (const tick of data.data?.series || []) {
      const point = { index: index++ };
      for (const config of configs) {
        const v = tick[config[0]];
        if (simpul.isNumber(v)) {
          if (min === undefined || v < min) min = v;
          if (max === undefined || v > max) max = v;
          point[config[0]] = v;
        } else point[config[0]] = null;
      }
      point.datetime = new Date(tick.date).getTime();
      dataset.push(point);
    }
    if (simpul.isNumber(rest.min)) min = rest.min;
    if (simpul.isNumber(rest.max)) max = rest.max;
    return { dataset, min, max };
  }, [configs, data.data?.series, rest.min, rest.max]);

  if (!data.isReady || !chart.dataset.length) return;

  const xAxis = data.timeframe.value.startsWith("week")
    ? {
        dataKey: "index",
        scaleType: "linear",
        valueFormatter: (v) =>
          simpul.dateString(chart.dataset[v]?.datetime, "MM/DD, hh:mm A"),
      }
    : {
        dataKey: "datetime",
        scaleType: "time",
        valueFormatter: (v) =>
          data.timeframe.value === "day"
            ? simpul.dateString(v, "hh:mm A")
            : new Date(v).toLocaleDateString(),
      };

  return (
    <Box mt={7} mb={4} sx={{ height: show ? 180 : 0 }}>
      <ChartToggleButton toggleShow={toggleShow} show={show} title={title} />
      {show && <ChartLineChart xAxis={xAxis} {...chart} configs={configs} />}
    </Box>
  );
}

function ChartToggleButton({ toggleShow, show, title }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        cursor: "pointer",
        width: "fit-content",
      }}
      onClick={toggleShow}
    >
      <ToggleButton
        value="check"
        size="small"
        selected={show}
        sx={{ height: 10, width: 10 }}
      >
        <CheckIcon sx={{ height: 8, width: 8 }} />
      </ToggleButton>
      <Typography variant="overline" display="block">
        {title}
      </Typography>
    </Box>
  );
}

function ChartLineChart({ xAxis, min, max, configs, dataset }) {
  return (
    <LineChart
      skipAnimation
      hideLegend
      axisHighlight={{ x: "line", y: "line" }}
      xAxis={[{ tickNumber: 8, ...xAxis }]}
      yAxis={[{ tickNumber: 4, min, max }]}
      series={configs.map((config) => ({
        showMark: false,
        connectNulls: true,
        dataKey: config[0],
        label: config[1],
        color: config[2],
        valueFormatter: config[3]
          ? (v) =>
              v < 1 && config[3][0] === "$"
                ? `$${v || " -"}`
                : simpul.numberString(v, config[3])
          : undefined,
        highlightScope: {
          highlighted: "series",
          faded: "global",
        },
      }))}
      dataset={dataset}
      margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
      // grid={{ vertical: true, horizontal: true }}
    />
  );
}
