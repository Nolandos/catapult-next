import process from 'process';

export default {
  // Simple routes
  home: '/',

  // External links
  twitterCatamoto: 'https://twitter.com/4catamoto',
  telegramMatoto: 'https://t.me/Catamoto',
  accountSettingsUrl: `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/account`,
};
