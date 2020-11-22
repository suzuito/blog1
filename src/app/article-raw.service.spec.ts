import { TestBed } from '@angular/core/testing';

import { ArticleRawService } from './article-raw.service';

describe('ArticleRawService', () => {
  let service: ArticleRawService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleRawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
