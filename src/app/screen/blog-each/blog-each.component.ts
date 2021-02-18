import { Component, OnInit } from '@angular/core';
import { SafeHtml, Title } from '@angular/platform-browser';
import { Article, Tag } from 'src/app/entity/model/diary';
import { LdJSONGenerator, LdJsonService } from 'src/app/ld-json.service';
import { MetaService, newArticleMetas, SiteName, SiteOrigin } from 'src/app/meta.service';
import { RelCanonicalService } from 'src/app/rel-canonical.service';
import { BlogEachService } from './blog-each.service';

@Component({
  selector: 'app-blog-each',
  templateUrl: './blog-each.component.html',
  styleUrls: ['./blog-each.component.scss']
})
export class BlogEachComponent implements OnInit {

  public ldJSONGenerator: LdJSONGenerator;

  constructor(
    private blogEachService: BlogEachService,
    private ldJSONService: LdJsonService,
    private metaService: MetaService,
    private titleService: Title,
    private rcService: RelCanonicalService,
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
      undefined,
      this.article.tags.map(v => v.name),
    );
  }

  get ldJSON(): SafeHtml {
    return this.ldJSONGenerator.generate();
  }

  get article(): Article | null {
    return this.blogEachService.article;
  }

  get articleRaw(): SafeHtml | null {
    return this.blogEachService.rawArticle;
  }

  clickTag(tag: Tag): void { }

}
