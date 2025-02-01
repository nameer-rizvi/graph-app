"use client";
import { useContext } from "react";
import { DataContext } from "../contexts";
import Box from "@mui/material/Box";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function ApexChart() {
  const data = useContext(DataContext);

  if (!data.render) return;

  const option = {
    chart: {
      id: "apexchart-1",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
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
      data: data.data.series.map((candle) => ({
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
    <Box mt={6} mb={4} sx={{ height: 200 }}>
      <Chart type="candlestick" options={option} series={series} height="200" />
    </Box>
  );

  // return (
  //   <Chart
  //     options={apex.options}
  //     series={apex.series}
  //     type="candlestick"
  //     height="350"
  //   />
  // );
}
