import { Injectable, HostListener } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private tokenKey = 'userToken';

  constructor() { }

  @HostListener('window:beforeunload', ['$event'])
  clearUserDataBeforeUnload(event: Event) {
    this.clearUserData();
  }

  setUserData(userData: any): void {
    localStorage.setItem(this.tokenKey, JSON.stringify(userData));
  }

  getUserData(): any {
    const userDataString = localStorage.getItem(this.tokenKey);
    return userDataString ? JSON.parse(userDataString) : null;
  }

  clearUserData(): void {
    localStorage.removeItem(this.tokenKey);
  }
}