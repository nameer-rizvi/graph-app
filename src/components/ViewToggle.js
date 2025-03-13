import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import WaterfallChartIcon from "@mui/icons-material/WaterfallChart";

export function ViewToggle({ onClick }) {
  return (
    <Box sx={{ position: "fixed", right: 10, bottom: 10 }}>
      <Fab variant="extended" size="small" color="primary" onClick={onClick}>
        <WaterfallChartIcon />
      </Fab>
    </Box>
  );
}
