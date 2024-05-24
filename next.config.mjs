import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.CMS_DOMAIN,
      },
      {
        protocol: 'https',
        hostname: process.env.CMS_DOMAIN,
      },
    ],
  },
};

export default withNextIntl(nextConfig);
