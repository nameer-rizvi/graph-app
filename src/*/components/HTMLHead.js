import NextHead from "next/head";

export function HTMLHead() {
  return (
    <NextHead>
      <title>Graph App</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </NextHead>
  );
}
