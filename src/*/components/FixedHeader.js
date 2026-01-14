import AppBar from "@mui/material/AppBar";

export function FixedHeader(props) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: "calc(100% - 350px)",
        ml: "350px",
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
