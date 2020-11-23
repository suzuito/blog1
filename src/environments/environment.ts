import { Env } from './common';

export const environment: Env = {
  api: {
    baseUrl: 'https://api-blog.tach.dev',
  },
  storage: {
    article: {
      baseUrl: 'https://storage.googleapis.com/blog-static-minilla/articles',
    },
  },
  production: false
};
