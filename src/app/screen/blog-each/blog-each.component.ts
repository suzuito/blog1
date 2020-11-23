import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ArticleRawService, getArticleRawURL } from 'src/app/article-raw.service';
import { ArticleService } from 'src/app/article.service';
import { Article, Tag } from 'src/app/entity/model/diary';
import { FixedMetasDefault, MetaService, newArticleMetas } from 'src/app/meta.service';
import { BlogEachService } from './blog-each.service';

@Component({
  selector: 'app-blog-each',
  templateUrl: './blog-each.component.html',
  styleUrls: ['./blog-each.component.scss']
})
export class BlogEachComponent implements OnInit {

  constructor(
    private blogEachService: BlogEachService,
    private metaService: MetaService,
    private titleService: Title,
  ) {
  }

  ngOnInit(): void {
    if (this.article === null) {
      return;
    }
    this.titleService.setTitle(this.article.title);
    this.metaService.setMetas(newArticleMetas(
      this.article,
      `${location.origin}${location.pathname}`,
    ));
  }

  get article(): Article | null {
    return this.blogEachService.article;
  }

  get articleRaw(): SafeHtml | null {
    return this.blogEachService.rawArticle;
  }

  clickTag(tag: Tag): void { }

}
