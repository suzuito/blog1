
export interface Article {
    id: string;
    title: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    versions: ArticleVersions;
    tags: Array<Tag>;
}

export interface ArticleVersions {
    current: number;
}

export interface Tag {
    name: string;
    createdAt: number;
}
