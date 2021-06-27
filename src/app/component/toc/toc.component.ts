import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleIndex } from 'src/app/entity/model/diary';

@Component({
  selector: 'app-toc',
  templateUrl: './toc.component.html',
  styleUrls: ['./toc.component.scss']
})
export class TocComponent implements OnInit {

  @Input()
  public articleToc: Array<ArticleIndex>;

  constructor(
    private router: Router,
  ) {
    this.articleToc = [];
  }

  ngOnInit(): void {
  }

}
