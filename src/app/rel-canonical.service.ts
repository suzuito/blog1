import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { SiteOrigin } from './meta.service';

@Injectable({
  providedIn: 'root'
})
export class RelCanonicalService {

  constructor(@Inject(DOCUMENT) private doc: Document) {
  }

  update(url: string): void {
    const elements: HTMLCollectionOf<HTMLLinkElement> = this.doc.head.getElementsByTagName('link');
    let link: HTMLLinkElement | undefined;
    let ok = false;
    for (let i = 0; i < elements.length; i++) {
      const element = elements.item(i);
      if (element === null) {
        continue;
      }
      const attr = element.getAttribute('rel');
      if (attr !== null && attr === 'canonical') {
        link = element;
        ok = true;
        break;
      }
    }
    if (!ok) {
      const newed = this.doc.createElement('link');
      newed.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(newed);
      link = newed;
    }
    if (link === undefined) {
      throw new Error('link is undefined');
    }
    link.setAttribute('href', url);
  }
}
