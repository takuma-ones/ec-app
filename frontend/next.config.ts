import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['example.com', 'upset-embossing.name', 'private-embossing.com'], // ★ 追加
  },
}

export default nextConfig
