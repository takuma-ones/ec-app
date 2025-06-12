import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['example.com'], // ← ここを画像のホスト名に置き換え
  },
}

export default nextConfig
