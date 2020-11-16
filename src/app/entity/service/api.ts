import { Results } from '../model/cursor';
import { Article } from '../model/diary';

export abstract class API {
    abstract async getArticles(): Promise<Results<Article>>;
    abstract async getArticle(id: string): Promise<Article>;
}
