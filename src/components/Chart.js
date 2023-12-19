import { useContext, useMemo } from "react";
import { DataContext } from "../context";
import dynamic from "next/dynamic";
import { useTheme } from "@mui/material/styles";
import { STYLE_THEMES } from "../constant";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const ReactChart = dynamic(
  () => import("react-charts").then((mod) => mod.Chart),
  { ssr: false },
);

export function Chart({ seriesConfigs: _seriesConfigs, title, ...options }) {
  const data = useContext(DataContext);

  const seriesConfigs = _seriesConfigs.filter((i) => {
    if (data.data?.series?.some((j) => j.sma5ColorVolumeGreen)) {
      return i[0] !== "sma10ColorsGreen";
    } else {
      return i[0] !== "sma5ColorVolumeGreen";
    }
  });

  const series = useMemo(() => {
    const seriesConfig = seriesConfigs.reduce((r, i) => {
      return { ...r, [i[0]]: { label: i[1], data: [] } };
    }, {});
    for (let tick of data.data?.series || []) {
      for (let [key, value] of Object.entries(tick)) {
        if (seriesConfig[key]) {
          seriesConfig[key].data.push({ date: tick.dateObject, value });
        }
      }
    }
    return Object.values(seriesConfig);
  }, [seriesConfigs, data.data?.series]);

  const primaryAxis = useMemo(() => {
    return { getValue: (datum) => fixedDate(datum.date) };
  }, []);

  const secondaryAxes = useMemo(() => {
    return [{ getValue: (datum) => datum.value }];
  }, []);

  const defaultColors = seriesConfigs.map((i) => i[2]);

  const theme = useTheme();

  const dark = theme.palette.mode === STYLE_THEMES[1];

  const render =
    data.render &&
    series.some((i) =>
      i.data.some((i) => typeof i.value === "number" && i.value !== 0),
    );

  if (render) {
    return (
      <Box mt={6} mb={6} sx={{ height: 150 }}>
        <Typography variant="overline" display="block" gutterBottom>
          {title}
        </Typography>
        <ReactChart
          options={{
            ...options,
            data: series,
            primaryAxis,
            secondaryAxes,
            defaultColors,
            dark,
          }}
        />
      </Box>
    );
  }
}

function fixedDate(d) {
  const date = new Date(d);
  date.setHours(date.getHours() - 4);
  return date;
}
