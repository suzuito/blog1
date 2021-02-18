import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

function toDateString(at: number): string {
  const a = new Date(at * 1000);
  let r = '';
  r += `${a.getFullYear()}`;
  r += '-';
  if (a.getMonth() < 10) {
    r += `0${a.getMonth()}`;
  } else {
    r += `${a.getMonth()}`;
  }
  r += '-';
  if (a.getDate() < 10) {
    r += `0${a.getDate()}`;
  } else {
    r += `${a.getDate()}`;
  }
  return r;
}

export class LdJSONGenerator {
  private data: Array<object>;
  constructor(
    private sanitizer: DomSanitizer,
  ) {
    this.data = [];
  }

  addWebPage(
    url: string,
    name: string,
    headline: string,
    description: string,
  ): LdJSONGenerator {
    this.data.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      mainEntityOfPage: url,
      headline,
      description,
    });
    return this;
  }

  addBlogPost(
    url: string,
    headline: string,
    description: string,
    articleBody: string,
    datePublished: number,
    image: string | undefined,
    keywords: Array<string>,
  ): LdJSONGenerator {
    articleBody = articleBody.substring(0, 100);
    const a: any = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      mainEntityOfPage: url,
      headline,
      keywords,
      datePublished: toDateString(datePublished),
      author: {
        '@type': 'Person',
        name: 'Suzuito',
      },
      description,
    };
    if (image !== undefined) {
      a.image = image;
    }
    if (keywords.length > 0) {
      a.keywords = keywords.join(' ');
    }
    this.data.push(a);
    return this;
  }

  /*
  addBreadcrumbs(route: ActivatedRoute): LdJSONGenerator {
    let current = route;
    const breadcrumbs: any = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [],
    };
    while (true) {
      if (current.parent === null) {
        break;
      }
      if (current.routeConfig === null) {
        continue;
      }
      current.
      breadcrumbs.itemListElement.unshift({
        '@type': 'ListItem',
        position: -1,
        item: {
          '@id': `${location.origin}/${current.routeConfig.path}`,
        },
      });
      console.log(current.routeConfig);
      current = current.parent;
    }
    this.data.push(breadcrumbs);
    return this;
  }
  */

  generate(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`<script type="application/ld+json">${JSON.stringify(this.data)}</script>`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class LdJsonService {

  constructor(
    private sanitizer: DomSanitizer,
  ) {
  }

  generator(): LdJSONGenerator {
    return new LdJSONGenerator(this.sanitizer);
  }
}
