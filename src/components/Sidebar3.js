import { SidebarContainer } from "./SidebarContainer";
import { AppHeader } from "./AppHeader";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import { Paper } from "./Paper";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { capitalize } from "simpul";

export function Sidebar3(props) {
  return (
    <SidebarContainer>
      <AppHeader />
      <Divider />
      <Toolbar sx={{ mt: 2 }}>
        <FormCard {...props} />
      </Toolbar>
    </SidebarContainer>
  );
}

function FormCard({ screener, setScreener, timeframe, setTimeframe, options }) {
  return (
    <Paper>
      <LeaderboardIcon sx={{ marginTop: 0.5 }} />
      <Box ml={2} sx={{ overflow: "hidden", width: "100%" }}>
        <FormCardTitle />
        <FormCardSelect
          label="Screener"
          value={screener}
          setter={setScreener}
          options={options.SCREENER}
        />
        <FormCardSelect
          label="Timeframe"
          value={timeframe}
          setter={setTimeframe}
          options={options.TIMEFRAME}
        />
      </Box>
    </Paper>
  );
}

function FormCardTitle() {
  const title = "Signal Table";
  return (
    <Typography variant="h5" mb={2} title={title} noWrap>
      {title}
    </Typography>
  );
}

function FormCardSelect({ label, value, setter, options }) {
  const id = label.toLowerCase().replace(" ", "-");
  return (
    <FormControl fullWidth sx={{ marginTop: 1, marginBottom: 1 }}>
      <InputLabel id={`label-${id}`}>{label}</InputLabel>
      <Select
        labelId={`label-${id}`}
        id={id}
        value={value}
        label={label}
        onChange={(event) => setter(event.target.value)}
      >
        {options.map((o) => (
          <MenuItem key={o} value={o}>
            {capitalize(o)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
