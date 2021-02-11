import { Injectable } from '@angular/core';
import { Cursor, CursorStoreInfo, DataProvider } from 'ngx-mugen-scroll';
import { ApiService } from './api.service';
import { cursorSorterDesc } from './entity/model/cursor';
import { Article, ArticleCursor, newArticleCursor } from './entity/model/diary';
import { OrderedDataStores } from './ordered-data-stores';

export enum ArticleGroup {
  List = 'list',
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService implements DataProvider<Article> {

  private articleGroupInternal: ArticleGroup;
  private stores: OrderedDataStores<Article>;

  constructor(
    private api: ApiService,
  ) {
    this.articleGroupInternal = ArticleGroup.List;
    this.stores = new OrderedDataStores<Article>(
      newArticleCursor,
      cursorSorterDesc,
      v => v.id,
    );
  }

  newCursor(v: Article): Cursor {
    return new ArticleCursor(v.publishedAt, v.title);
  }

  get scrollId(): string {
    return `articles-${this.articleGroupInternal}`;
  }

  set articleGroup(v: ArticleGroup) {
    this.articleGroupInternal = v;
    this.stores.setId(this.articleGroupInternal);
  }

  get articleGroup(): ArticleGroup {
    return this.articleGroupInternal;
  }

  async fetchArticle(articleId: string): Promise<Article> {
    let data = this.stores.getItem(articleId);
    if (!data) {
      data = await this.api.getArticle(articleId);
      this.stores.add(data);
    }
    return data;
  }

  async fetchBottom(cursor: ArticleCursor, n: number, includeEqual: boolean): Promise<Array<Article>> {
    const datas = this.stores.getSmallerN(cursor, n, includeEqual);
    if (datas.length > 0) {
      return datas;
    }
    const results = await this.api.getArticlesSmallerN(cursor, n);
    this.stores.add(...results.datas);
    return this.stores.getSmallerN(cursor, n, includeEqual);
  }

  async fetchTop(cursor: ArticleCursor, n: number, includeEqual: boolean): Promise<Array<Article>> {
    const datas = this.stores.getLargerN(cursor, n, includeEqual);
    if (datas.length > 0) {
      return datas;
    }
    const results = await this.api.getArticlesLargerN(cursor, n);
    this.stores.add(...results.datas);
    return this.stores.getLargerN(cursor, n, includeEqual);
  }

  async fetchOnInit(n: number): Promise<Array<Article>> {
    return this.fetchBottom(
      new ArticleCursor(Date.now() / 1000, ''),
      n,
      true,
    );
  }

  async fetchOnLoad(info: CursorStoreInfo): Promise<Array<Article>> {
    return await this.fetchBottom(
      info.topCursor as ArticleCursor,
      info.n,
      true,
    );
  }
}
