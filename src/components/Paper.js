import MUIPaper from "@mui/material/Paper";

export function Paper(props) {
  return (
    <MUIPaper
      elevation={2}
      sx={{
        width: "100%",
        paddingY: 2,
        paddingX: 3,
        display: "flex",
        flexDirection: "row",
      }}
      {...props}
    />
  );
}
