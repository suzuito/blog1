import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export function getArticleRawURL(articleId: string): string {
  return `${environment.storage.article.baseUrl}/${articleId}.html`;
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


export class RemoteStorageService {

  constructor(
    private http: HttpClient,
  ) { }

  async getArticle(
    articleId: string,
  ): Promise<string> {
    return this.http.get(
      getArticleRawURL(articleId),
      new OptBuilder()
        .textResponseBody()
        .gen(),
    ).toPromise().then((v) => v as any);
  }

}

@Injectable({
  providedIn: 'root'
})
export class ArticleRawService {

  private articles: Map<string, string>;
  private remote: RemoteStorageService;

  constructor(
    private http: HttpClient,
  ) {
    this.remote = new RemoteStorageService(http);
    this.articles = new Map<string, string>();
  }

  async fetchArticle(articleId: string): Promise<string> {
    let article = this.articles.get(articleId);
    if (article) {
      return article;
    }
    article = await this.remote.getArticle(articleId);
    this.articles.set(articleId, article);
    return article;
  }
}
