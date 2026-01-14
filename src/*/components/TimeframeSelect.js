import { useContext } from "react";
import { DataContext } from "../providers";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

export function TimeframeSelect() {
  const data = useContext(DataContext);

  function updateTimeframe(e) {
    data.timeframe.update(e.target.value);
  }

  const timeframes = [
    { label: "Day", value: "day" },
    { label: "Week [1]", value: "week" },
    { label: "Week [2]", value: "week2" },
    { label: "Year [1]", value: "year" },
    { label: "Year [5]", value: "year5" },
    { label: "Year [10]", value: "year10" },
    { label: "Year [20]", value: "year20" },
    { label: "Year [50]", value: "year50" },
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
          sx={{ flexWrap: "unset", overflowX: "scroll" }}
        >
          {timeframes.map((t) => (
            <FormControlLabel
              key={t.value}
              value={t.value}
              label={t.label}
              control={<Radio />}
              sx={{ minWidth: "max-content" }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
}
