import { Env } from './common';

export const environment: Env = {
  api: {
    baseUrl: 'http://0.0.0.0:8085',
  },
  storage: {
    article: {
      baseUrl: 'https://storage.googleapis.com/blog-static-minilla/articles',
    },
  },
  production: false
};
