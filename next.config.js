/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['@/components', '@/lib', '@/hooks'],
  },
}

module.exports = nextConfig
