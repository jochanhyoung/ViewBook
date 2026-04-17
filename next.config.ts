import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Docker 멀티 스테이지 빌드용 — server.js + 최소 의존성만 .next/standalone에 출력
  productionBrowserSourceMaps: false,
  experimental: {},
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: blob:; connect-src 'self'; font-src 'self' https://cdn.jsdelivr.net;" },
        ],
      },
    ];
  },
};

export default nextConfig;
