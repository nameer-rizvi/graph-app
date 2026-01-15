"use client";
import { useContext } from "react";
import { DataContext } from "../providers";
import { Paper } from "./Paper";
import LinkIcon from "@mui/icons-material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Link from "@mui/material/Link";

export function LinksCard() {
  const data = useContext(DataContext);

  const symbol = data.data?.symbol;

  const t = getFinvizT(data);

  const p = getFinvizP(data);

  const c = getCryptoSymbol(data);

  const n = getCryptoName(data);

  if (data.render && symbol) {
    return (
      <Paper>
        <LinkIcon sx={{ marginTop: 0.5 }} />
        <Box ml={2}>
          <LinksCardTitle title="Quick Links" />
          <LinksCardLinks
            links={
              data.data.isCrypto
                ? [
                    {
                      label: "Finviz",
                      href: `https://finviz.com/crypto_charts.ashx?t=${t}&p=${p}`,
                    },
                    {
                      label: "Robinhood",
                      href: `https://robinhood.com/crypto/${c}`,
                    },
                    {
                      label: "Coinbase",
                      href: `https://www.coinbase.com/price/${n}`,
                    },
                    {
                      label: "Stocktwits",
                      href: `https://stocktwits.com/symbol/${c}.X`,
                    },
                    {
                      label: "Reddit",
                      href: `https://www.reddit.com/r/${n}`,
                    },
                  ]
                : data.data.isCurrency
                ? [
                    {
                      label: "Finviz",
                      href: `https://finviz.com/forex_charts.ashx?t=${t}&p=${p}`,
                    },
                    {
                      label: "Stocktwits",
                      href: `https://stocktwits.com/symbol/${data.data.symbol}`,
                    },
                  ]
                : data.data.isFutures
                ? [
                    {
                      label: "Finviz",
                      href: `https://finviz.com/futures_charts.ashx?t=${t}&p=${p}`,
                    },
                  ]
                : [
                    {
                      label: "Finviz",
                      href: `https://finviz.com/quote.ashx?t=${t}&p=${p}`,
                    },
                    {
                      label: "IBorrowDesk",
                      href: `https://iborrowdesk.com/report/${symbol}`,
                    },
                    {
                      label: "Robinhood",
                      href: `https://robinhood.com/stocks/${symbol}`,
                    },
                    {
                      label: "Stocktwits",
                      href: `https://stocktwits.com/symbol/${symbol}`,
                    },
                  ]
            }
          />
        </Box>
      </Paper>
    );
  }
}

function LinksCardTitle({ title }) {
  return (
    <Typography variant="h6" mb={0.4}>
      {title}
    </Typography>
  );
}

function LinksCardLinks({ links = [] }) {
  return links.map((link) => (
    <Box key={link.label} mt={2} sx={{ display: "flex", flexDirection: "row" }}>
      <ChevronRightIcon />
      <Link ml={0.5} href={link.href} target="_blank">
        {link.label}
      </Link>
    </Box>
  ));
}

function getFinvizT(data = {}) {
  if (data.data.future) {
    return data.data.future.finviz;
  } else {
    return data.data.symbol?.replace(".", "-");
  }
}

function getFinvizP(data = {}) {
  const isShortTimeframe = data.data.isCurrency || data.data.isFutures;
  if (data.data.step === "PT5M" && isShortTimeframe) {
    return "i5";
  } else if (data.data.step === "PT15M" && isShortTimeframe) {
    return "i15";
  } else if (data.data.step === "PT30M" && isShortTimeframe) {
    return "i30";
  } else if (data.data.step === "P1D") {
    return "d";
  } else if (data.data.step === "P7D") {
    return "w";
  } else if (data.data.step === "P14D") {
    return "w";
  } else if (data.data.step === "P1M") {
    return "m";
  } else if (data.data.step === "P2M") {
    return "m";
  } else {
    return "d";
  }
}

function getCryptoSymbol(data = {}) {
  return data.data.symbol?.replace("USD", "");
}

function getCryptoName(data = {}) {
  return data.data.name
    ?.toLowerCase()
    .replace(/CoinDesk/gi, "")
    .trim()
    .split(" ")[0];
}
