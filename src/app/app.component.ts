import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LdJsonService } from './ld-json.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private schema: object;

  constructor(
    private sanitizer: DomSanitizer,
    private ldJSONService: LdJsonService,
  ) {
    this.schema = {};
  }

  get ldJSON(): SafeHtml {
    return this.ldJSONService.ldJSON;
  }
}
