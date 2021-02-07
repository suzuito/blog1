import { Injectable } from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { Article } from './entity/model/diary';

export const SiteName = 'fulcrum';
export const SiteDescription = 'とあるプログラマのブログです。本サイトは、皆さんに「読ませる」ためのサイトではなく、僕が「書く」ためのもの。';
export const SiteLocale = 'ja_JP';

function newMetas(
  a: {
    ogTitle: string,
    ogLocale: string,
    ogDescription: string,
    ogUrl: string,
    ogSiteName: string,
    ogType: string,
    description: string,
  },
): Array<MetaDefinition> {
  const r: Array<MetaDefinition> = [];
  if (a.ogTitle) { r.push({ property: 'og:title', content: a.ogTitle }); }
  if (a.ogType) { r.push({ property: 'og:type', content: a.ogType }); }
  if (a.ogLocale) { r.push({ property: 'og:locale', content: a.ogLocale }); }
  if (a.ogDescription) { r.push({ property: 'og:description', content: a.ogDescription }); }
  if (a.ogUrl) { r.push({ property: 'og:url', content: a.ogUrl }); }
  if (a.ogSiteName) { r.push({ property: 'og:site_name', content: a.ogSiteName }); }
  if (a.description) { r.push({ name: 'description', content: a.description }); }
  return r;
}

export function newArticleMetas(article: Article, url: string): Array<MetaDefinition> {
  return newMetas({
    ogTitle: article.title,
    ogDescription: article.description,
    ogLocale: SiteLocale,
    ogSiteName: SiteName,
    ogType: 'article',
    ogUrl: url,
    description: article.description,
  });
}

export const FixedMetasDefault: Array<MetaDefinition> = newMetas({
  ogDescription: SiteDescription,
  ogTitle: SiteName,
  ogLocale: SiteLocale,
  ogUrl: location.origin,
  ogSiteName: SiteName,
  ogType: 'website',
  description: SiteDescription,
});

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(
    private meta: Meta,
  ) { }

  setMetas(a: Array<MetaDefinition>): void {
    a.forEach(v => {
      this.meta.updateTag(v);
    });
  }
}
