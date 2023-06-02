import Toolbar from "@mui/material/Toolbar";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import { APP_FAVICON, APP_NAME } from "../constant";

export function AppHeader() {
  return (
    <Toolbar>
      <Image src={APP_FAVICON} height={20} width={20} alt="logo" />
      <Typography
        variant="h6"
        component="h1"
        ml={1.5}
        sx={{ fontWeight: "light" }}
      >
        {APP_NAME}
      </Typography>
    </Toolbar>
  );
}
