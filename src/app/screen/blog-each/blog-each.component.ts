import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ArticleRawService, getArticleRawURL } from 'src/app/article-raw.service';
import { ArticleService } from 'src/app/article.service';
import { Article, Tag } from 'src/app/entity/model/diary';
import { LdJsonService } from 'src/app/ld-json.service';
import { FixedMetasDefault, MetaService, newArticleMetas, SiteName } from 'src/app/meta.service';
import { BlogEachService } from './blog-each.service';

@Component({
  selector: 'app-blog-each',
  templateUrl: './blog-each.component.html',
  styleUrls: ['./blog-each.component.scss']
})
export class BlogEachComponent implements OnInit {

  constructor(
    private blogEachService: BlogEachService,
    private ldJSONService: LdJsonService,
    private metaService: MetaService,
    private titleService: Title,
  ) {
  }

  ngOnInit(): void {
    if (this.article === null) {
      return;
    }
    this.titleService.setTitle(`${this.article.title} | ${SiteName}`);
    this.metaService.setMetas(newArticleMetas(
      this.article,
      `${location.origin}${location.pathname}`,
    ));
    this.ldJSONService.setBlogPost(
      location.href,
      this.article.title,
      this.article.description,
      this.article.description,
      this.article.publishedAt,
      undefined,
      this.article.tags.map(v => v.name),
    );
  }

  get article(): Article | null {
    return this.blogEachService.article;
  }

  get articleRaw(): SafeHtml | null {
    return this.blogEachService.rawArticle;
  }

  clickTag(tag: Tag): void { }

}
