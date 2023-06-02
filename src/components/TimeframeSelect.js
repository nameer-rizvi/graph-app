import { useContext } from "react";
import { DataContext } from "../context";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export function TimeframeSelect() {
  const data = useContext(DataContext);

  function updateTimeframe(e) {
    data.timeframe.update(e.target.value);
  }

  const timeframes = [
    { label: "Day", value: "day" },
    { label: "Week [1]", value: "week" },
    { label: "Week [2]", value: "week2" },
    { label: "Month", value: "month" },
    { label: "Quarter", value: "quarter" },
    { label: "Year [1]", value: "year" },
    { label: "Year [5]", value: "year5" },
  ];

  if (data.render && data.data?.symbol)
    return (
      <FormControl sx={{ flexDirection: "row", alignItems: "center" }}>
        <FormLabel id="radio-buttons-group-label" sx={{ marginRight: 3 }}>
          Timeframe
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="radio-buttons-group-label"
          name="row-radio-buttons-group"
          onChange={updateTimeframe}
          value={data.timeframe.value || data.timeframe.defaultValue}
        >
          {timeframes.map((t) => (
            <FormControlLabel
              key={t.value}
              value={t.value}
              label={t.label}
              control={<Radio />}
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
}
