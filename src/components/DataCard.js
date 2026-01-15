"use client";
import { useContext } from "react";
import { DataContext } from "../providers";
import simpul from "simpul";
import { Paper } from "./Paper";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FactoryIcon from "@mui/icons-material/Factory";
import BusinessIcon from "@mui/icons-material/Business";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowDropUpSharpIcon from "@mui/icons-material/ArrowDropUpSharp";
import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";
import RemoveSharpIcon from "@mui/icons-material/RemoveSharp";

export function DataCard() {
  const data = useContext(DataContext);

  if (!data.isReady) return;

  return (
    <Paper>
      <DataCardIcon {...data.data} />
      <Box ml={2} sx={{ overflow: "hidden" }}>
        <DataCardTitle title={data.data.symbol} />
        <DataCardSubtitle subtitle={data.data.name} />
        <DataCardPrice data={data.data.last} />
        <DataCardVolume data={data.data} />
        <DataCardDate data={data.data.last} />
      </Box>
    </Paper>
  );
}

function DataCardIcon({ isCrypto, isCurrency, isFutures }) {
  if (isCrypto) {
    return <CurrencyBitcoinIcon sx={{ marginTop: 0.5 }} />;
  } else if (isCurrency) {
    return <AttachMoneyIcon sx={{ marginTop: 0.5 }} />;
  } else if (isFutures) {
    return <FactoryIcon sx={{ marginTop: 0.5 }} />;
  } else {
    return <BusinessIcon sx={{ marginTop: 0.5 }} />;
  }
}

function DataCardTitle({ title }) {
  return (
    <Typography variant="h5" mb={0.4} title={title}>
      {title}
    </Typography>
  );
}

function DataCardSubtitle({ subtitle }) {
  return (
    <Typography
      gutterBottom
      title={subtitle}
      variant="subtitle2"
      style={{
        lineHeight: 1.3,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "220px",
      }}
    >
      {subtitle}
    </Typography>
  );
}

function DataCardPrice({ data = {} }) {
  if (!simpul.isNumber(data.priceClose)) return;
  const price =
    data.priceClose >= 1
      ? simpul.numberString(data.priceClose, ["$"])
      : "$" + data.priceClose;
  const priceChange = data.priceChangeCumulative
    ? `(${simpul.numberString(data.priceChangeCumulative, ["+", "%"])})`
    : "";
  let color;
  let Icon;
  if (data.priceChangeCumulative > 0) {
    color = "#00c805";
    Icon = <ArrowDropUpSharpIcon sx={{ color }} />;
  } else if (data.priceChangeCumulative < 0) {
    color = "#ff5000";
    Icon = <ArrowDropDownSharpIcon sx={{ color }} />;
  } else {
    Icon = <RemoveSharpIcon sx={{ color }} />;
  }
  return (
    <Box mt={2} sx={{ display: "flex", flexDirection: "row" }}>
      {Icon}
      <Box ml={0.5}>
        <Typography variant="body" mr={1} title={price}>
          {price}
        </Typography>
        <span style={{ color }} title={priceChange}>
          {priceChange}
        </span>
      </Box>
    </Box>
  );
}

const overflow = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

function DataCardVolume({ data = {} }) {
  if (!simpul.isNumber(data.volume) || data.volume === 0) return;
  const volume = simpul.numberString(data.volume);
  const volumeChange = data.last.volume
    ? `(${simpul.numberString(data.last.volume, ["+"])})`
    : "";
  const volumeValue = data.volumeValue
    ? `Notional Value ${
        simpul.numberString(data.volumeValue, ["$"]).split(".00")[0]
      }`
    : "";
  let color;
  let Icon;
  if (data.last.sma10VolumeTrend?.[0] === 1) {
    color = "#00c805";
    Icon = <ArrowDropUpSharpIcon sx={{ color }} />;
  } else if (data.last.sma10VolumeTrend?.[0] === -1) {
    color = "#ff5000";
    Icon = <ArrowDropDownSharpIcon sx={{ color }} />;
  } else {
    Icon = <RemoveSharpIcon sx={{ color }} />;
  }
  return (
    <Box mt={2} sx={{ display: "flex", flexDirection: "row" }}>
      {Icon}
      <Box ml={0.5} style={overflow}>
        <Typography variant="body" mr={1} title={volume}>
          {volume}
        </Typography>
        <span style={{ color }} title={volumeChange}>
          {volumeChange}
        </span>
        <Typography
          display="block"
          variant="caption"
          title={volumeValue}
          sx={overflow}
        >
          {volumeValue}
        </Typography>
      </Box>
    </Box>
  );
}

function DataCardDate({ data = {} }) {
  if (!data.dateString) return;
  const updatedAt = new Date(data.dateString)
    .toLocaleString()
    .replace(":00 ", " ");
  const label = `Last updated ${updatedAt}.`;
  return (
    <Typography
      display="block"
      variant="overline"
      mt={2}
      sx={{ lineHeight: 1.5, fontSize: "0.6rem" }}
      title={label}
    >
      {label}
    </Typography>
  );
}
