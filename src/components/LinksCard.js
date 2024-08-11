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

  if (data.render && symbol) {
    return (
      <Paper>
        <LinkIcon sx={{ marginTop: 0.5 }} />
        <Box ml={2}>
          <LinksCardTitle title="Quick Links" />
          <LinksCardLinks
            links={
              data.data.isBitcoin
                ? [
                    {
                      label: "Finviz",
                      href: "https://finviz.com/crypto_charts.ashx?t=BTCUSD",
                    },
                    {
                      label: "Robinhood",
                      href: "https://robinhood.com/crypto/BTC",
                    },
                    {
                      label: "Stocktwits",
                      href: "https://stocktwits.com/symbol/BTC.X",
                    },
                    {
                      label: "Reddit",
                      href: "https://www.reddit.com/r/Bitcoin/",
                    },
                  ]
                : [
                    {
                      label: "Finviz",
                      href: `https://finviz.com/quote.ashx?t=${symbol}`,
                    },
                    {
                      label: "IBorrowDesk",
                      href: `https://iborrowdesk.com/report/${symbol}`,
                    },
                    {
                      label: "Naked Short Report",
                      href: `https://www.nakedshortreport.com/company/${symbol}`,
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
