import transpiler from "next-transpile-modules";

/** @type {import('next').NextConfig} */
const nextConfig = transpiler(["@mui/x-charts"])({
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
});

export default nextConfig;
