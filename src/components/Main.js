import Box from "@mui/material/Box";

export const Main = (props) => (
  <Box
    component="main"
    sx={{ flexGrow: 1, bgcolor: "background.default", p: 3, mt: 2 }}
    {...props}
  />
);
