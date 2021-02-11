import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleGroup, ArticleService } from 'src/app/article.service';
import { StreamComponent, StreamCursorStoreService } from 'src/app/component/stream/stream.component';
import { Article, ArticleCursor, newArticleCursor } from 'src/app/entity/model/diary';
import { Logger } from 'src/app/entity/service/logger';
import { LdJsonService } from 'src/app/ld-json.service';
import { FixedMetasDefault, MetaService, SiteDescription, SiteName } from 'src/app/meta.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent extends StreamComponent<Article> implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('top')
  public elTop: ElementRef | null;

  @ViewChild('bottom')
  public elBottom: ElementRef | null;

  @ViewChild('parent')
  public elParent: ElementRef | null;

  constructor(
    private router: Router,
    private metaService: MetaService,
    private titleService: Title,
    private ldJSONService: LdJsonService,
    logger: Logger,
    provider: ArticleService,
    cursorStore: StreamCursorStoreService,
  ) {
    super(
      logger,
      newArticleCursor,
      v => v.id,
      provider,
      cursorStore,
      {
        waitTimeMilliSeconds: 1000,
        fetchLength: 10,
        maxLength: 100,
        threshold: 0.1,
      },
    );
    this.elParent = null;
    this.elBottom = null;
    this.elTop = null;
    this.titleService.setTitle(SiteName);
    this.metaService.setMetas(FixedMetasDefault);
    this.ldJSONService.setWebPage(
      location.href,
      SiteName,
      SiteName,
      SiteDescription,
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.save(ArticleGroup.List);
    this.onDestroy();
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.elBottom === null) {
      console.error(`elBottom is null`);
      return;
    }
    if (this.elTop === null) {
      console.error(`elBottom is null`);
      return;
    }
    if (this.elParent === null) {
      console.error(`elParent is null`);
      return;
    }
    this.initElements({
      elParent: this.elParent.nativeElement,
      elBottom: this.elBottom.nativeElement,
      elTop: this.elTop.nativeElement,
    });
    await this.load(
      ArticleGroup.List,
      {
        initCursor: new ArticleCursor(Date.now() / 1000, ''),
        initMethod: 'fetchBottom',
        initScrollBottom: false,
      },
    );
    this.initEdgeDetector();
  }

  async onTop(): Promise<void> {
    await this.fetchTop();
  }

  async onBottom(): Promise<void> {
    await this.fetchBottom();
  }

  async clickTop(): Promise<void> {
    await this.fetchTop();
  }

  async clickBottom(): Promise<void> {
    await this.fetchBottom();
  }

  clickArticle(article: Article): void {
    this.router.navigate(['blog', article.id]);
  }
}
