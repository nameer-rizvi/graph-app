import { useContext } from "react";
import { DataContext } from "../contexts";
import { Paper } from "./Paper";
import BusinessIcon from "@mui/icons-material/Business";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowDropUpSharpIcon from "@mui/icons-material/ArrowDropUpSharp";
import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";
import RemoveSharpIcon from "@mui/icons-material/RemoveSharp";
import simpul from "simpul";

export function DataCard() {
  const data = useContext(DataContext);
  if (data.render && data.data.symbol) {
    return (
      <Paper>
        <BusinessIcon sx={{ marginTop: 0.5 }} />
        <Box ml={2} sx={{ overflow: "hidden" }}>
          <DataCardTitle title={data.data.symbol} />
          <DataCardSubtitle subtitle={data.data.name} />
          <DataCardPrice data={data.data.last} />
          <DataCardVolume data={data.data.last} />
          <DataCardDate data={data.data.last} />
        </Box>
      </Paper>
    );
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
  if (data.priceClose) {
    const price = simpul.numberstring(data.priceClose, ["$"]);

    const priceChange = data.priceChange
      ? `(${simpul.numberstring(data.priceChange, ["+", "%"])})`
      : "";

    let color;

    let Icon;

    if (data.priceChange > 0) {
      color = "#00c805";
      Icon = <ArrowDropUpSharpIcon sx={{ color }} />;
    } else if (data.priceChange < 0) {
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
}

function DataCardVolume({ data = {} }) {
  if (data.volumeTotal) {
    const overflow = {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    };

    const volume = simpul.numberstring(data.volumeTotal);

    const volumeChange = data.volume
      ? `(${simpul.numberstring(data.volume, ["+"])})`
      : "";

    const volumeValue = data.vwapValue
      ? `Notional Value ${simpul.numberstring(data.vwapValue, ["$"])}`
      : data.volumeValue
      ? `Notional Value ${simpul.numberstring(data.volumeValue, ["$"])}`
      : "";

    let color;

    let Icon;

    if (data.volumeTrend === "up") {
      color = "#00c805";
      Icon = <ArrowDropUpSharpIcon sx={{ color }} />;
    } else if (data.volumeTrend === "down") {
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
}

function DataCardDate({ data = {} }) {
  if (data.dateString) {
    const label = `Last updated ${data.dateString}.`;
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
}
