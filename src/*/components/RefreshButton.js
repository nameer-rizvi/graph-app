import { useContext } from "react";
import { DataContext } from "../contexts";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";

export function RefreshButton() {
  const data = useContext(DataContext);

  if (data.render && data.data.last)
    return (
      <Button
        variant="outlined"
        startIcon={<RefreshIcon />}
        sx={{ width: "100%", marginBottom: 1.5 }}
        onClick={data.sendRequest}
      >
        Refresh Data
      </Button>
    );
}
