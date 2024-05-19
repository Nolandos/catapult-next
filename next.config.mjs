import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['thumbs2.imgbox.com', process.env.CMS_DOMAIN],
  },
};

export default withNextIntl(nextConfig);
