/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["vlxtyiuqcwccecpqtkyk.supabase.co"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb",
    },
  },
};

module.exports = nextConfig;
