import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unfvuapddztsxybitkkc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/owner/properties/:id/room/new',
        destination: '/owner/properties/:id/rooms/new',
        permanent: true,
      },
      {
        source: '/owner/properties/:id/room/:roomId',
        destination: '/owner/properties/:id/rooms/:roomId',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
