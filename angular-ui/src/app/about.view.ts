import { Component } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  template: `
    <div>
      <button [disabled]="isLoginDisabled" (click)="login()">Login</button>
      <button [disabled]="!isLoginDisabled" (click)="logout()">Logout</button>
      <button (click)="goTo(['home'])">Home</button>
    </div>
    <p>
      This application is a show-case for an Angular app consuming a REST API
      through an OAuth2 BFF.
    </p>
  `,
  styles: ``,
})
export class AboutView {
  private loginUri?: string;

  constructor(private user: UserService, private router: Router) {
    user.loginOptions.subscribe((opts) => {
      if (opts.length) {
        this.loginUri = opts[0].loginUri;
      }
    });
  }

  get isLoginDisabled(): boolean {
    return !this.loginUri || this.user.current.isAuthenticated;
  }

  login() {
    if (this.loginUri) {
      this.user.login(this.loginUri, ['home']);
    }
  }

  logout() {
    this.user.logout();
  }

  goTo(where: string[]) {
    this.router.navigate(where);
  }
}
