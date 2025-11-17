import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  productionBrowserSourceMaps:true,
  // Allow external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },

  // Rewrites removed - using Next.js API routes for authentication
  // Other API calls (posts, taxonomies, terms) will use direct backend calls
  //
//   async rewrites() {
//     return [
//       {
//         source: "/api/auth/:path*",
//         destination: "/api/auth/:path*",
//       },
//       {
//         source: "/api/:path*",
//         destination: `${process.env.BACKEND_DOMAIN}/:path*`,
//       },
//     ];
//   },
};

export default nextConfig;
