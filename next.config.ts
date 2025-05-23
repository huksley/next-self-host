import type { NextConfig } from 'next';
// import path from 'path';

import { nodeFileTrace } from "@vercel/nft";

/** Force include Drizzle Kit so we can apply migrations quickly */
const drizzle = nodeFileTrace([require.resolve("drizzle-kit")]).then((drizzle) => [
  ...drizzle.fileList,
  "./node_modules/.bin/drizzle-kit",
  "./node_modules/drizzle-kit/bin.cjs",
]);

const nextConfig: Promise<NextConfig> = drizzle.then((drizzle) => ({
  // Recommended: this will reduce output
  // Docker image size by 80%+
  output: 'standalone',
  // Optional: bring your own cache handler
  // cacheHandler: path.resolve('./cache-handler.mjs'),
  // cacheMaxMemorySize: 0, // Disable default in-memory caching
  images: {
    // Optional: use a different optimization service
    // loader: 'custom',
    // loaderFile: './image-loader.ts',
    //
    // We're defaulting to optimizing images with
    // Sharp, which is built-into `next start`
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
  // Nginx will do gzip compression. We disable
  // compression here so we can prevent buffering
  // streaming responses
  compress: false,
  // Optional: override the default (1 year) `stale-while-revalidate`
  // header time for static pages
  // swrDelta: 3600 // seconds

  outputFileTracingIncludes: {
    "**": [...drizzle],
  },
}));

export default nextConfig;
