/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.APP_BUILD === "true" ? "export" : undefined,
};

export default nextConfig;
