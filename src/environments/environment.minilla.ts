import { Env } from './common';

export const environment: Env = {
    api: {
        baseUrl: 'https://api-blog.minilla.tach.dev',
    },
    storage: {
        article: {
            baseUrl: 'https://suzuito-minilla-blog1-article.storage.googleapis.com',
        },
    },
    production: true
};
