import { useTheme } from "../hooks";
import { ColorModeContext } from "../context";
import { ThemeProvider as MUThemeProvider } from "@mui/material/styles";

export function ThemeProvider(props) {
  const [colorMode, theme] = useTheme();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <MUThemeProvider theme={theme} {...props} />
    </ColorModeContext.Provider>
  );
}
