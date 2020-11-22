import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './component/header/header.component';
import { TopComponent } from './screen/top/top.component';
import { BlogComponent } from './screen/blog/blog.component';
import { Spinner1Component } from './component/spinner1/spinner1.component';
import { ConsoleLogger, Logger } from './entity/service/logger';
import { HttpClientModule } from '@angular/common/http';
import { ArticleComponent } from './component/article/article.component';
import { ArticleTagComponent } from './component/article-tag/article-tag.component';
import { BlogEachComponent } from './screen/blog-each/blog-each.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TopComponent,
    BlogComponent,
    Spinner1Component,
    ArticleComponent,
    ArticleTagComponent,
    BlogEachComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
  ],
  providers: [
    { provide: Logger, useValue: new ConsoleLogger(), },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
