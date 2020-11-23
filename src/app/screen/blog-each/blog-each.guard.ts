import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ArticleRawService } from 'src/app/article-raw.service';
import { ArticleService } from 'src/app/article.service';
import { BlogEachService } from './blog-each.service';

@Injectable({
  providedIn: 'root'
})
export class BlogEachGuard implements CanActivate {
  constructor(
    private articleService: ArticleService,
    private articleRawService: ArticleRawService,
    private blogEachService: BlogEachService,
    private sanitizer: DomSanitizer,
  ) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    const articleId = route.params.articleId;
    if (!articleId) {
      return false;
    }
    const article = await this.articleService.fetchArticle(articleId);
    const articleRaw = await this.articleRawService.fetchArticle(articleId);
    this.blogEachService.article = article;
    this.blogEachService.rawArticle = this.sanitizer.bypassSecurityTrustHtml(articleRaw);
    return true;
  }

}
