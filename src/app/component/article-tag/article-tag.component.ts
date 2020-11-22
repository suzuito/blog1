import { Component, Input, OnInit } from '@angular/core';
import { Tag } from 'src/app/entity/model/diary';

@Component({
  selector: 'app-article-tag',
  templateUrl: './article-tag.component.html',
  styleUrls: ['./article-tag.component.scss']
})
export class ArticleTagComponent implements OnInit {

  @Input()
  public tag: Tag | null;

  constructor() {
    this.tag = null;
  }

  ngOnInit(): void {
  }

}
