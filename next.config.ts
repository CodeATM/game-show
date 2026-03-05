import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: false,
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Tailwind CSS v4 is configured via PostCSS
}

export default nextConfig
