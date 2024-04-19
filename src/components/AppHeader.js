import Toolbar from "@mui/material/Toolbar";
import Image from "next/image";
import Typography from "@mui/material/Typography";

export function AppHeader() {
  return (
    <Toolbar>
      <Image src="/apple-touch-icon.png" height={20} width={20} alt="logo" />
      <Typography
        variant="h6"
        component="h1"
        ml={1.5}
        sx={{ fontWeight: "light" }}
      >
        Graph App
      </Typography>
    </Toolbar>
  );
}
