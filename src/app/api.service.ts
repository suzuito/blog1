import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';
import { Article, ArticleCursor } from './entity/model/diary';
import { Results } from './entity/model/cursor';

function u(path: string): string {
  return `${environment.api.baseUrl}${path}`;
}

class OptBuilder {
  private o: any;
  constructor() {
    this.o = {
      headers: new HttpHeaders(),
      params: new HttpParams(),
      withCredentials: false, // Must be false for Google Cloud Storage
    };
  }
  public header(k: string, v: string): OptBuilder {
    this.o.headers = this.o.headers.set(k, v);
    return this;
  }
  public param(k: string, v: string): OptBuilder {
    this.o.params = this.o.params.set(k, v);
    return this;
  }
  public jsonResponseBody(): OptBuilder {
    this.o.responseType = 'json';
    return this;
  }
  public textResponseBody(): OptBuilder {
    this.o.responseType = 'text';
    return this;
  }
  public fullResponse(): OptBuilder {
    this.o.observe = 'response';
    return this;
  }
  public gen(): any {
    return this.o;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  async getArticlesLargerN(
    cursor: ArticleCursor,
    n: number,
  ): Promise<Results<Article>> {
    return this.http.get(
      u(`/articles?cursor_published_at=${cursor.publishedAt}&cursor_title=${cursor.title}&n=${n}&order=asc`),
      new OptBuilder()
        .jsonResponseBody()
        .gen(),
    ).toPromise().then((v) => new Results(v as any));
  }

  async getArticlesSmallerN(
    cursor: ArticleCursor,
    n: number,
  ): Promise<Results<Article>> {
    return this.http.get(
      u(`/articles?cursor_published_at=${cursor.publishedAt}&cursor_title=${cursor.title}&n=${n}&order=desc`),
      new OptBuilder()
        .jsonResponseBody()
        .gen(),
    ).toPromise().then((v) => new Results(v as any));
  }

  async getArticle(
    articleId: string,
  ): Promise<Article> {
    return this.http.get(
      u(`/articles/${articleId}`),
      new OptBuilder()
        .jsonResponseBody()
        .gen(),
    ).toPromise().then((v) => v as any);
  }
}
