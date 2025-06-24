import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'example.com', 'upset-embossing.name', 'private-embossing.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/images/products/**',
      },
    ],
  },
}

export default nextConfig
