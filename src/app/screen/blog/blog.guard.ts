import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ArticleGroup, ArticleService } from 'src/app/article.service';

@Injectable({
  providedIn: 'root'
})
export class BlogGuard implements CanActivate {
  constructor(
    private articleService: ArticleService,
  ) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    this.articleService.articleGroup = ArticleGroup.List;
    return true;
  }

}
