import { Env } from './common';

export const environment: Env = {
  api: {
    baseUrl: 'https://api-blog.minilla.tach.dev',
    // baseUrl: 'http://localhost:8080',
  },
  storage: {
    article: {
      baseUrl: 'https://suzuito-minilla-blog1-article.storage.googleapis.com',
    },
  },
  production: false
};
