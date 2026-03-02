import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: false,
  // Tailwind CSS v4 is configured via PostCSS
  // Next.js uses PostCSS by default with Tailwind CSS v4
}

export default nextConfig
