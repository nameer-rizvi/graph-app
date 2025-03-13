"use client";
import { useContext } from "react";
import { DataContext } from "../contexts";
import simpul from "simpul";
import Box from "@mui/material/Box";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// TODO: style: x-axis labels, y-axis labels, y-axis cross-lines, tooltip, crosshair tooltip.

export function ApexChart() {
  const data = useContext(DataContext);

  if (!data.render) return;

  const option = {
    chart: {
      id: "apexchart-1",
    },
    xaxis: {
      type: "category",
      labels: {
        formatter: (date) =>
          data.timeframe.value?.includes("year")
            ? simpul.datestring(date, "M/D/Y")
            : data.timeframe.value?.includes("week")
            ? simpul.datestring(date, "D/M h:m p")
            : simpul.datestring(date, "h:m p"),
      },
    },
    yaxis: {
      logarithmic: false,
      forceNiceScale: false,
      decimalsInFloat: false,
      tooltip: {
        enabled: true,
      },
    },
    candlestick: {
      colors: {
        upward: "#3C90EB",
        downward: "#DF7D46",
      },
      wick: {
        useFillColor: true,
      },
    },
  };

  const series = [
    {
      name: "candle",
      type: "candlestick",
      data: data.data.series.slice(-75).map((candle) => ({
        x: new Date(candle.dateString),
        y: [
          candle.priceOpen,
          candle.priceHigh,
          candle.priceLow,
          candle.priceClose,
        ],
      })),
    },
  ];

  return (
    <Box mt={6} mb={4} sx={{ height: 500 }}>
      <Chart
        type="candlestick"
        options={option}
        series={series}
        height="100%"
      />
    </Box>
  );
}
