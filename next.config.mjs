// next.config.mjs

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // আপনার অন্যান্য Next.js কনফিগারেশন এখানে থাকবে
};

export default withPWA(nextConfig);