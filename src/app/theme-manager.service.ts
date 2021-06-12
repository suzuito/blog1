import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeManagerService {

  private isLightModeString: string;

  constructor() {
    this.isLightModeString = localStorage.getItem('isLightMode') ?? '1'
  }

  isLightMode(): boolean {
    return this.isLightModeString === '1';
  }

  toggle(): void {
    if (this.isLightMode()) {
      this.toDarkMode();
      return;
    }
    this.toLightMode();
  }

  toLightMode(): void {
    this.isLightModeString = '1';
    this.save();
  }
  toDarkMode(): void {
    this.isLightModeString = '0';
    this.save();
  }

  private save(): void {
    localStorage.setItem('isLightMode', this.isLightModeString);
  }
}
