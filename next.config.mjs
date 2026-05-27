/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: [
    "puppeteer",
    "puppeteer-extra",
    "puppeteer-extra-plugin",
    "puppeteer-extra-plugin-stealth",
    "merge-deep",
    "clone-deep",
    "is-plain-object",
    "scrapefrom",
    "simpul",
  ],
};

export default nextConfig;
