import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Article } from 'src/app/entity/model/diary';

@Injectable({
  providedIn: 'root'
})
export class BlogEachService {

  public article: Article | null;
  public rawArticle: SafeHtml | null;

  constructor() {
    this.article = null;
    this.rawArticle = null;
  }
}
