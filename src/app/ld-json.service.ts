import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class LdJsonService {

  private data: object;

  constructor(
    private sanitizer: DomSanitizer,
  ) {
    this.data = {};
  }

  private toDateString(at: number): string {
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

  setWebPage(
    url: string,
    name: string,
    headline: string,
    description: string,
  ): void {
    this.data = {
      url,
      name,
      headline,
      description,
      '@type': 'WebSite',
      '@context': 'https://schema.org',
    };
  }

  setBlogPost(
    url: string,
    headline: string,
    description: string,
    articleBody: string,
    datePublished: number,
    image: string | undefined,
    keywords: Array<string>,
  ): void {
    articleBody = articleBody.substring(0, 100);
    const data: any = {
      url,
      headline,
      description,
      articleBody,
      datePublished: this.toDateString(datePublished),
      '@type': 'BlogPosting',
      '@context': 'https://schema.org',
      author: {
        '@type': 'Person',
        name: 'Suzuito',
      },
    };
    if (image !== undefined) {
      data.image = image;
    }
    if (keywords.length > 0) {
      data.keywords = keywords.join(' ');
    }
    this.data = data;
  }

  get ldJSON(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`<script type="application/ld+json">${JSON.stringify(this.data)}</script>`);
  }
}
