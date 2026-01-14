import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export function ThemeProvider(props) {
  return <MUIThemeProvider theme={darkTheme} {...props} />;
}
