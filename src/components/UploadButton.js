import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export function UploadButton({ axis, setData, setAxis }) {
  function onChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = onLoad;
      reader.readAsText(file);
    }
  }

  function onLoad(event) {
    const json = JSON.parse(event.target.result);
    const options = [...new Set(json.map((o) => Object.keys(o)).flat())];
    options.push("index");
    const x = options.includes(axis.x) ? axis.x : "";
    const y = axis.y.filter((y) => options.includes(y));
    setData(json);
    setAxis({ x, y, options });
  }

  return (
    <Button
      component="label"
      role={undefined}
      variant="outlined"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      sx={{ width: "100%", marginBottom: 1.5 }}
    >
      Upload Data
      <VisuallyHiddenInput type="file" onChange={onChange} multiple />
    </Button>
  );
}
