import { Component } from '@angular/core';
import { ThemeManagerService } from './theme-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private themeManager: ThemeManagerService,
  ) {
  }

  isLightMode(): boolean {
    return this.themeManager.isLightMode();
  }

  class(): string {
    if (this.themeManager.isLightMode()) {
      return 'light-theme';
    }
    return 'dark-theme';
  }
}
