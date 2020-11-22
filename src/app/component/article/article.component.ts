import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Article, Tag } from 'src/app/entity/model/diary';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  @Input()
  public article: Article | null;

  @Output()
  public clickTitle: EventEmitter<void>;

  @Output()
  public clickTag: EventEmitter<Tag>;

  constructor() {
    this.article = null;
    this.clickTitle = new EventEmitter<void>();
    this.clickTag = new EventEmitter<Tag>();
  }

  ngOnInit(): void {
  }

}
