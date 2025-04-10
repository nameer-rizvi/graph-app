import { Paper } from "./Paper";
import SsidChartIcon from "@mui/icons-material/SsidChart";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { capitalize } from "simpul";
import OutlinedInput from "@mui/material/OutlinedInput";

export function FormCard(props) {
  if (!props.data.length || !props.axis.options.length) return;

  return (
    <Paper>
      <SsidChartIcon sx={{ marginTop: 0.5 }} />
      <Box ml={2} sx={{ overflow: "hidden", width: "100%" }}>
        <FormCardTitle {...props} />
        <FormCardXAxis {...props} />
        <FormCardYAxis {...props} />
      </Box>
    </Paper>
  );
}

function FormCardTitle({ axis }) {
  const title = axis.filename || "Chart Form";
  return (
    <Typography variant="h5" mb={2} title={title} noWrap>
      {title}
    </Typography>
  );
}

function FormCardXAxis({ setAxis, axis }) {
  function handleChange(event) {
    setAxis((curr) => ({
      ...curr,
      y: curr.y.filter((y) => y !== event.target.value),
      x: event.target.value,
    }));
  }
  return (
    <FormControl fullWidth sx={{ marginTop: 1, marginBottom: 1 }}>
      <InputLabel id="select-x-label">X-Axis</InputLabel>
      <Select
        labelId="select-x-label"
        id="select-x"
        value={axis.x}
        label="X-Axis"
        onChange={handleChange}
      >
        {axis.options.map((o) => (
          <MenuItem key={o} value={o}>
            {capitalize(o)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function FormCardYAxis({ setAxis, axis }) {
  function handleChange(event) {
    setAxis((curr) => ({
      ...curr,
      y: event.target.value,
      x: event.target.value.includes(curr.x) ? "" : curr.x,
    }));
  }
  return (
    <FormControl fullWidth sx={{ marginTop: 1, marginBottom: 1 }}>
      <InputLabel id="select-y-label">Y-Axis</InputLabel>
      <Select
        labelId="select-y-label"
        id="select-y"
        multiple
        value={axis.y}
        onChange={handleChange}
        input={<OutlinedInput label="Y" />}
      >
        {axis.options.map((o) => (
          <MenuItem
            key={o}
            value={o}
            style={{ fontWeight: axis.y.includes(o) ? 800 : undefined }}
          >
            {capitalize(o)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
