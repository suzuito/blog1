import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { SafeHtml, Title } from '@angular/platform-browser';
import { Article, ArticleIndex, Tag } from 'src/app/entity/model/diary';
import { LdJSONGenerator, LdJsonService } from 'src/app/ld-json.service';
import { MetaService, newArticleMetas, SiteName, SiteOrigin } from 'src/app/meta.service';
import { RelCanonicalService } from 'src/app/rel-canonical.service';
import { BlogEachService } from './blog-each.service';

declare const hljs: any;

@Component({
  selector: 'app-blog-each',
  templateUrl: './blog-each.component.html',
  styleUrls: ['./blog-each.component.scss']
})
export class BlogEachComponent implements OnInit, AfterViewInit {

  public ldJSONGenerator: LdJSONGenerator;

  constructor(
    private blogEachService: BlogEachService,
    private ldJSONService: LdJsonService,
    private metaService: MetaService,
    private titleService: Title,
    private rcService: RelCanonicalService,
    private elParent: ElementRef,
  ) {
    this.ldJSONGenerator = this.ldJSONService.generator();
  }

  ngOnInit(): void {
    if (this.article === null) {
      return;
    }
    this.titleService.setTitle(`${this.article.title} | ${SiteName}`);
    this.metaService.setMetas(newArticleMetas(
      this.article,
      `${SiteOrigin}${location.pathname}`,
    ));
    this.rcService.update(`${SiteOrigin}${location.pathname}`);
    this.ldJSONGenerator.addBlogPost(
      location.href,
      this.article.title,
      this.article.description,
      this.article.description,
      this.article.publishedAt,
      this.article.images.length <= 0 ? undefined : {
        url: this.article.images[0].url,
        width: this.article.images[0].realWidth,
        height: this.article.images[0].realHeight,
        '@type': 'ImageObject',
      },
      this.article.tags.map(v => v.name),
    );
  }

  ngAfterViewInit(): void {
    hljs.highlightAll();
  }

  get ldJSON(): SafeHtml {
    return this.ldJSONGenerator.generate();
  }

  get article(): Article | null {
    return this.blogEachService.article;
  }

  get articleToc(): Array<ArticleIndex> {
    if (this.blogEachService.article === null) {
      return [];
    }
    return this.blogEachService.article.toc;
  }

  get articleRaw(): SafeHtml | null {
    return this.blogEachService.rawArticle;
  }

  clickTag(tag: Tag): void { }

  clickToTop(): void {
    window.scrollTo({ top: 0 });
  }
}
