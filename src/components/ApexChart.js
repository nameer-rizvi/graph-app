"use client";
import { useContext } from "react";
import { DataContext } from "../contexts";
import simpul from "simpul";
import Box from "@mui/material/Box";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function ApexChart() {
  const data = useContext(DataContext);

  if (!data.render) return;

  const filename = `${data.data.timeframe.toUpperCase()}-${data.data.symbol}`;

  const option = {
    chart: {
      id: "apexchart-1",
      fontFamily: "inherit",
      animations: { enabled: false },
      toolbar: {
        export: { csv: { filename }, svg: { filename }, png: { filename } },
      },
    },
    grid: {
      show: true,
      borderColor: "#1b2429",
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    tooltip: { theme: "dark" },
    xaxis: {
      tickAmount: 10,
      type: "category",
      labels: {
        style: { colors: "rgb(255, 255, 255)" },
        formatter: xFormatter(data),
      },
    },
    yaxis: {
      max: (m) => m,
      min: (m) => m,
      tickAmount: 5,
      tooltip: { enabled: true },
      axisBorder: {
        show: true,
        color: "rgb(255, 255, 255)",
      },
      axisTicks: {
        show: true,
        color: "rgb(255, 255, 255)",
      },
      labels: {
        style: { colors: "rgb(255, 255, 255)" },
        formatter: yFormatter(),
      },
    },
  };

  const series = [
    {
      name: "candle",
      type: "candlestick",
      data: data.data.series
        .map((candle) => ({
          x: new Date(candle.dateString),
          y: [
            candle.priceOpen,
            candle.priceHigh,
            candle.priceLow,
            candle.priceClose,
          ],
        }))
        .filter((candle) => candle.y.every(simpul.isNumber)),
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

function xFormatter(data) {
  return (date) =>
    data.timeframe?.value?.includes("year")
      ? simpul.datestring(date, "M/D/Y")
      : data.timeframe?.value?.includes("week")
      ? simpul.datestring(date, "M/D h:m p")
      : simpul.datestring(date, "h:m p");
}

function yFormatter() {
  return (v) =>
    v >= 100
      ? simpul.numberstring(v, ["$"]).split(".")[0]
      : simpul.numberstring(v, ["$"]);
}
