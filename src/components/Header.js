"use client";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import { usePathname } from "next/navigation";

export function Header({ APP_NAME }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Breadcrumbs aria-label="breadcrumb">
            <HeaderAppLink APP_NAME={APP_NAME} />
            <HeaderPageTitle />
          </Breadcrumbs>
          {/*Search Bar with timeframe dropdown for main routes*/}
          {/* interacts with QueryContext (which saves symbol/timeframe in localstorage, url and state)*/}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function HeaderAppLink({ APP_NAME }) {
  const sx = { display: "flex", alignItems: "center", gap: 1 };
  return (
    <Link href="/" sx={sx} underline="hover">
      <Image src="/apple-touch-icon.png" height={20} width={20} alt="logo" />
      <Typography>{APP_NAME}</Typography>
    </Link>
  );
}

function HeaderPageTitle() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  if (!title) return;
  return <Typography sx={{ color: "text.primary" }}>{title}</Typography>;
}

function getPageTitle(pathname, symbol) {
  // TODO
  if (pathname === "/json") {
    return "JSON Visualizer";
  } else if (pathname === "/") {
    return symbol;
  } else if (pathname === "/charts") {
    return symbol ? `${symbol} - Charts` : "Charts";
  } else if (pathname === "/indicators") {
    return symbol ? `${symbol} - Indicators` : "Indicators";
  }
}
