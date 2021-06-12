import { Component, Input, OnInit } from '@angular/core';
import { ThemeManagerService } from 'src/app/theme-manager.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  public current: string;

  constructor(
    private themeManager: ThemeManagerService,
  ) {
    this.current = '';
  }

  ngOnInit(): void {
  }

  isLightMode(): boolean {
    return this.themeManager.isLightMode();
  }

  clickSwitchTheme(): void {
    this.themeManager.toggle();
  }

}
