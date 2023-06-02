import NextHead from "next/head";
import {
  APP_NAME,
  APP_DESCRIPTION,
  APP_TYPE,
  APP_ORIGIN,
  APP_IMAGE,
  APP_TWITTER_CARD,
  APP_FAVICON,
  APP_VIEWPORT,
} from "../constant";

export const HTMLHead = () => (
  <NextHead>
    <title>{APP_NAME}</title>
    <meta name="title" content={APP_NAME} />
    <meta name="description" content={APP_DESCRIPTION} />
    <meta property="og:type" content={APP_TYPE} />
    <meta property="og:url" content={APP_ORIGIN} />
    <meta property="og:title" content={APP_NAME} />
    <meta property="og:description" content={APP_DESCRIPTION} />
    <meta property="og:image" content={APP_IMAGE} />
    <meta property="twitter:card" content={APP_TWITTER_CARD} />
    <meta property="twitter:url" content={APP_ORIGIN} />
    <meta property="twitter:title" content={APP_NAME} />
    <meta property="twitter:description" content={APP_DESCRIPTION} />
    <meta property="twitter:image" content={APP_IMAGE} />
    <link rel="icon" href={APP_FAVICON} />
    <meta name="viewport" content={APP_VIEWPORT} />
  </NextHead>
);
