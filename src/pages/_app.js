import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "../styles/globals.css";
import { HTMLHead } from "../components";
import { ThemeProvider, DataProvider } from "../providers";
import CssBaseline from "@mui/material/CssBaseline";
import { Analytics } from "@vercel/analytics/react";

function App({ Component, pageProps }) {
  return (
    <>
      <HTMLHead />
      <ThemeProvider>
        <CssBaseline />
        <DataProvider>
          <Component {...pageProps} />
        </DataProvider>
      </ThemeProvider>
      <Analytics />
    </>
  );
}

export default App;
