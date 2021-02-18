import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SafeHtml, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxMugenScrollComponent } from 'ngx-mugen-scroll';
import { ArticleService } from 'src/app/article.service';
import { Article } from 'src/app/entity/model/diary';
import { LdJSONGenerator, LdJsonService } from 'src/app/ld-json.service';
import { FixedMetasDefault, MetaService, SiteDescription, SiteName, SiteOrigin } from 'src/app/meta.service';
import { RelCanonicalService } from 'src/app/rel-canonical.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, AfterViewInit {

  public isLoading: boolean;

  private ldJSONGenerator: LdJSONGenerator;

  @ViewChild('stream')
  public stream: NgxMugenScrollComponent | undefined;

  constructor(
    private router: Router,
    private metaService: MetaService,
    private titleService: Title,
    private ldJSONService: LdJsonService,
    public provider: ArticleService,
    private rcService: RelCanonicalService,
  ) {
    this.titleService.setTitle(SiteName);
    this.metaService.setMetas(FixedMetasDefault);
    this.ldJSONGenerator = this.ldJSONService.generator();
    this.ldJSONGenerator.addWebPage(
      location.href,
      SiteName,
      SiteName,
      SiteDescription,
    );
    this.rcService.update(`${SiteOrigin}${location.pathname}`);
    this.isLoading = false;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.stream === undefined) {
      throw new Error('stream is undefined');
    }
  }

  get ldJSON(): SafeHtml {
    return this.ldJSONGenerator.generate();
  }

  async clickTop(): Promise<void> {
    if (this.isLoading) {
      return;
    }
    if (this.stream === undefined) {
      throw new Error('stream is undefined');
    }
    this.isLoading = true;
    try {
      await this.stream.fetchTop();
    } finally {
      this.isLoading = false;
    }
  }

  async clickBottom(): Promise<void> {
    if (this.isLoading) {
      return;
    }
    if (this.stream === undefined) {
      throw new Error('stream is undefined');
    }
    this.isLoading = true;
    try {
      await this.stream.fetchBottom();
    } finally {
      this.isLoading = false;
    }
  }

  clickArticle(article: Article): void {
    if (this.stream === undefined) {
      throw new Error('stream is undefined');
    }
    this.stream.saveScrollPosition();
    this.router.navigate(['blog', article.id]);
  }
}
