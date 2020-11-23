import { TestBed } from '@angular/core/testing';

import { BlogEachService } from './blog-each.service';

describe('BlogEachService', () => {
  let service: BlogEachService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogEachService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
