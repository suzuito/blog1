import { Cursor } from 'ngx-mugen-scroll';

export interface Article {
    id: string;
    title: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    publishedAt: number;
    tags: Array<Tag>;
    images: Array<ArticleImage>;
}

export interface ArticleImage {
    width: number;
    height: number;
    url: string;
    realWidth: number;
    realHeight: number;
}

export function newArticleCursor(a: Article): ArticleCursor {
    return new ArticleCursor(
        a.publishedAt,
        a.title,
    );
}

export class ArticleCursor extends Cursor {
    constructor(public publishedAt: number, public title: string) {
        super([publishedAt, title]);
    }
}

export interface Tag {
    name: string;
    createdAt: number;
}
