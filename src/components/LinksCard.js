import { useContext } from "react";
import { DataContext } from "../contexts";
import { Paper } from "./Paper";
import LinkIcon from "@mui/icons-material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Link from "@mui/material/Link";

export function LinksCard() {
  const data = useContext(DataContext);

  const symbol = data.data?.symbol;

  const p = getFinvizTimeframe(data);

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
                      href: `https://finviz.com/crypto_charts.ashx?t=${data.data.symbol}&p=${p}`,
                    },
                    {
                      label: "Robinhood",
                      href: `https://robinhood.com/crypto/${data.data.symbol2}`,
                    },
                    {
                      label: "Coinbase",
                      href: `https://www.coinbase.com/price/${data.data.name2}`,
                    },
                    {
                      label: "Stocktwits",
                      href: `https://stocktwits.com/symbol/${data.data.symbol2}.X`,
                    },
                    {
                      label: "Reddit",
                      href: `https://www.reddit.com/r/${data.data.name2}`,
                    },
                  ]
                : data.data.isCurrency
                ? [
                    {
                      label: "Finviz",
                      href: `https://finviz.com/forex_charts.ashx?t=${data.data.symbol}&p=${p}`,
                    },
                    {
                      label: "Stocktwits",
                      href: `https://stocktwits.com/symbol/${data.data.symbol}`,
                    },
                  ]
                : [
                    {
                      label: "Finviz",
                      href: `https://finviz.com/quote.ashx?t=${symbol}&p=${p}`,
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

function getFinvizTimeframe(data = {}) {
  if (["year50", "year20"].includes(data.timeframe?.value)) {
    return "m";
  } else if (["year10", "year5"].includes(data.timeframe?.value)) {
    return "w";
  } else if (
    data.data.isCurrency &&
    ["week2", "week"].includes(data.timeframe?.value)
  ) {
    return "h";
  } else if (data.data.isCurrency && data.timeframe?.value === "day") {
    return "i5";
  } else {
    return "d";
  }
}
