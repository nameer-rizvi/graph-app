import AppBar from "@mui/material/AppBar";
import { SIDEBAR_WIDTH } from "../constant";

export function FixedHeader(props) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        ml: `${SIDEBAR_WIDTH}px`,
        paddingY: 1.5, // Calc to match height of <AppHeader />
        paddingX: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      {...props}
    />
  );
}
