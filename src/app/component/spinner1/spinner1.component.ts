import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-spinner1',
  templateUrl: './spinner1.component.html',
  styleUrls: ['./spinner1.component.scss']
})
export class Spinner1Component implements OnInit {

  @Input()
  public diameter: number;

  @Output()
  public clickRefresh: EventEmitter<void>;

  @Input()
  public isLoading: boolean;

  constructor() {
    this.diameter = 10;
    this.clickRefresh = new EventEmitter<void>();
    this.isLoading = false;
  }

  ngOnInit(): void {
  }

}
