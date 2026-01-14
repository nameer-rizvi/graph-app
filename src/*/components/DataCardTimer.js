import { useTimer } from "../hooks";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function DataCardTimer({ data = {} }) {
  const [timer, progress, isMarketOpen] = useTimer({
    isCurrency: data.data.isCurrency,
    callback: data.sendRequest,
    delay: 5000,
  });

  const label = isMarketOpen
    ? `Next update in ${formatTime(timer)} (${Math.ceil(progress)}%).`
    : "Market is closed.";

  return (
    <Box>
      <Typography
        display="block"
        variant="overline"
        mt={1}
        sx={{ lineHeight: 1.5, fontSize: "0.6rem" }}
        title={label}
      >
        {label}
      </Typography>
    </Box>
  );
}

function formatTime(seconds) {
  const secondsFloored = Math.floor(seconds);
  const mins = Math.floor((secondsFloored % 3600) / 60);
  const secs = secondsFloored % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}
