import Box from "@mui/material/Box";

export function Main(props) {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, bgcolor: "background.default", p: 3, mt: 2 }}
      {...props}
    />
  );
}
