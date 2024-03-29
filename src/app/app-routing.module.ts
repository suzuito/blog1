import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AboutComponent } from './screen/about/about.component';
import { BlogEachComponent } from './screen/blog-each/blog-each.component';
import { BlogEachGuard } from './screen/blog-each/blog-each.guard';
import { BlogComponent } from './screen/blog/blog.component';
import { BlogGuard } from './screen/blog/blog.guard';
import { NotFoundComponent } from './screen/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        component: BlogComponent,
        canActivate: [
          BlogGuard,
        ],
      },
      {
        path: 'blog',
        component: BlogComponent,
        canActivate: [
          BlogGuard,
        ],
      },
      {
        path: 'blog/:articleId',
        component: BlogEachComponent,
        canActivate: [
          BlogEachGuard,
        ],
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      { path: '404', component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
