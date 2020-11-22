import { Cursor } from './cursor';

export interface Article {
    id: string;
    title: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    publishedAt: number;
    tags: Array<Tag>;
}

export function newArticleCursor(a: Article): ArticleCursor {
    return new ArticleCursor(
        a.publishedAt,
        a.title,
    );
}

export class ArticleCursor implements Cursor {
    constructor(public publishedAt: number, public title: string) { }
    get length(): number {
        return 2;
    }
    toString(): string {
        return `${this.publishedAt}-${this.title}`;
    }
    getItem(i: number): number | string {
        if (i === 0) {
            return this.publishedAt;
        }
        return this.title;
    }
}

export interface Tag {
    name: string;
    createdAt: number;
}
