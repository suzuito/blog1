import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ArticleRawService, getArticleRawURL } from 'src/app/article-raw.service';
import { ArticleService } from 'src/app/article.service';
import { Article, Tag } from 'src/app/entity/model/diary';

@Component({
  selector: 'app-blog-each',
  templateUrl: './blog-each.component.html',
  styleUrls: ['./blog-each.component.scss']
})
export class BlogEachComponent implements OnInit {

  public article: Article | null;
  public rawArticle: SafeHtml;

  constructor(
    private articleService: ArticleService,
    private articleRawService: ArticleRawService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {
    this.article = null;
    this.rawArticle = '<h1>hello</h1>';
  }

  ngOnInit(): void {
    this.route.params.subscribe(v => {
      const articleId = v.articleId;
      if (articleId) {
        this.articleService.fetchArticle(articleId).then(u => this.article = u);
        this.articleRawService.fetchArticle(articleId).then(u => this.rawArticle = this.sanitizer.bypassSecurityTrustHtml(u));
      }
    });
  }

  clickTag(tag: Tag): void { }

}
