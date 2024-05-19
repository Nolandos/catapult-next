import process from 'process';
import {include} from 'named-urls';

export default {
  // Simple routes
  home: '/',

  // nested routes
  projects: include('/projects', {
    base: '/projects',
    details: include(':slug/', {
      show: '',
    }),
  }),

  // External links
  twitterCatamoto: 'https://twitter.com/4catamoto',
  telegramMatoto: 'https://t.me/Catamoto',
  accountSettingsUrl: `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/account`,
};
