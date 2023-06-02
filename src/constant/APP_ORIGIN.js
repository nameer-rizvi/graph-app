export const APP_ORIGIN =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.ORIGIN;
