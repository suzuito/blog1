import { TestBed } from '@angular/core/testing';

import { BlogEachGuard } from './blog-each.guard';

describe('BlogEachGuard', () => {
  let guard: BlogEachGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BlogEachGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
