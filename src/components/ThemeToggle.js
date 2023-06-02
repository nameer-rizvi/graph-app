import { useTheme } from "@mui/material/styles";
import { useContext } from "react";
import { ColorModeContext } from "../context";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { STYLE_THEMES } from "../constant";

export function ThemeToggle() {
  const theme = useTheme();

  const colorMode = useContext(ColorModeContext);

  const STYLE = { position: "fixed", bottom: 12, right: 12 };

  const COLOR = "inherit";

  return (
    <IconButton onClick={colorMode.toggleColorMode} sx={STYLE} color={COLOR}>
      {theme.palette.mode === STYLE_THEMES[1] ? (
        <Brightness7Icon />
      ) : (
        <Brightness4Icon />
      )}
    </IconButton>
  );
}
