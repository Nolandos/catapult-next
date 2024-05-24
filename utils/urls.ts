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
  getListed: 'https://docs.google.com/forms/d/e/1FAIpQLSdtP9dT8IHc0OGqmRvQGipvOBWqPzSK3wp689FDYjddvQ4PLg/viewform',
};
