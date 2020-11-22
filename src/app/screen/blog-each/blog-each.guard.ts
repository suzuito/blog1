import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ArticleService } from 'src/app/article.service';

@Injectable({
  providedIn: 'root'
})
export class BlogEachGuard implements CanActivate {
  constructor(
    private articleService: ArticleService,
  ) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    const articleId = route.params.articleId;
    if (!articleId) {
      return false;
    }
    await this.articleService.fetchArticle(articleId);
    return true;
  }

}
