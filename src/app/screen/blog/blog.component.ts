import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SafeHtml, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxMugenScrollComponent } from 'ngx-mugen-scroll';
import { ArticleService } from 'src/app/article.service';
import { Article } from 'src/app/entity/model/diary';
import { LdJsonService } from 'src/app/ld-json.service';
import { FixedMetasDefault, MetaService, SiteDescription, SiteName } from 'src/app/meta.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, AfterViewInit {

  public isLoading: boolean;

  @ViewChild('stream')
  public stream: NgxMugenScrollComponent | undefined;

  constructor(
    private router: Router,
    private metaService: MetaService,
    private titleService: Title,
    private ldJSONService: LdJsonService,
    public provider: ArticleService,
  ) {
    this.titleService.setTitle(SiteName);
    this.metaService.setMetas(FixedMetasDefault);
    this.ldJSONService.setWebPage(
      location.href,
      SiteName,
      SiteName,
      SiteDescription,
    );
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
    return this.ldJSONService.ldJSON;
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
