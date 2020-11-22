import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogEachComponent } from './blog-each.component';

describe('BlogEachComponent', () => {
  let component: BlogEachComponent;
  let fixture: ComponentFixture<BlogEachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogEachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogEachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
