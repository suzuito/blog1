import { Env } from './common';

export const environment: Env = {
    api: {
        baseUrl: 'https://api-blog.tach.dev',
    },
    storage: {
        article: {
            baseUrl: 'https://suzuito-godzilla-blog1-article.storage.googleapis.com',
        },
    },
    production: true
};
