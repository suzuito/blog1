import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgxMugenScrollModule } from 'ngx-mugen-scroll';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './component/header/header.component';
import { BlogComponent } from './screen/blog/blog.component';
import { Spinner1Component } from './component/spinner1/spinner1.component';
import { ConsoleLogger, Logger } from './entity/service/logger';
import { HttpClientModule } from '@angular/common/http';
import { ArticleComponent } from './component/article/article.component';
import { ArticleTagComponent } from './component/article-tag/article-tag.component';
import { BlogEachComponent } from './screen/blog-each/blog-each.component';
import { AboutComponent } from './screen/about/about.component';
import { NotFoundComponent } from './screen/not-found/not-found.component';
import { TocComponent } from './component/toc/toc.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BlogComponent,
    Spinner1Component,
    ArticleComponent,
    ArticleTagComponent,
    BlogEachComponent,
    AboutComponent,
    NotFoundComponent,
    TocComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxMugenScrollModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatMenuModule,
  ],
  providers: [
    { provide: Logger, useValue: new ConsoleLogger(), },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
