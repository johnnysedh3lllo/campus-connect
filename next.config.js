/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["vlxtyiuqcwccecpqtkyk.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vlxtyiuqcwccecpqtkyk.supabase.co",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

module.exports = nextConfig;
