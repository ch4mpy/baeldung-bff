import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { baseUri, reverseProxyUri } from './app.config';
import { UserService } from './user.service';

enum LoginExperience {
  IFRAME,
  DEFAULT,
}

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: ` <span>
      <select [formControl]="selectedLoginExperience">
        <option *ngFor="let le of loginExperiences">
          {{ loginExperienceLabel(le) }}
        </option>
      </select>
      <button *ngIf="isLoginEnabled" (click)="login()">Login</button>
      <button *ngIf="isAuthenticated" (click)="logout()">Logout</button>
    </span>
    <div
      class="modal-overlay"
      *ngIf="isLoginModalDisplayed && !isAuthenticated"
      (click)="isLoginModalDisplayed = false"
    >
      <div class="modal">
        <iframe
          [src]="iframeSrc"
          frameborder="0"
          (load)="iframeLoad($event)"
        ></iframe>
        <button class="close-button" (click)="isLoginModalDisplayed = false">
          Discard
        </button>
      </div>
    </div>`,
  styles: `.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .modal {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    position: relative;
    width: 100%;
    max-width: 800px;
  }

  .modal iframe {
    width: 100%;
    height: 600px;
    border: none;
  }`,
})
export class AuthenticationComponent {
  isLoginModalDisplayed = false;
  iframeSrc?: SafeUrl;
  loginExperiences: LoginExperience[] = [];
  selectedLoginExperience = new FormControl<LoginExperience | null>(null, [
    Validators.required,
  ]);

  private loginUri?: string;

  constructor(
    private user: UserService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    user.loginOptions.subscribe((opts) => {
      if (opts.length) {
        this.loginUri = opts[0].loginUri;
        if (opts[0].isSameAuthority) {
          this.loginExperiences.push(LoginExperience.IFRAME);
        }
        this.loginExperiences.push(LoginExperience.DEFAULT);
        this.selectedLoginExperience.patchValue(this.loginExperiences[0]);
      }
    });
  }

  get isLoginEnabled(): boolean {
    return (
      this.selectedLoginExperience.valid && !this.user.current.isAuthenticated
    );
  }

  get isAuthenticated(): boolean {
    return this.user.current.isAuthenticated;
  }

  loginExperienceLabel(le: LoginExperience): string {
    return LoginExperience[le].replace('_', ' ').toLowerCase();
  }

  login() {
    if (!this.loginUri) {
      return;
    }

    const url = new URL(this.loginUri);
    url.searchParams.append(
      'post_login_success_uri',
      `${baseUri}${this.router.url}`
    );
    const loginUrl = url.toString();

    if (this.selectedLoginExperience.value === LoginExperience.IFRAME) {
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(loginUrl);
      this.isLoginModalDisplayed = true;
    } else {
      window.location.href = loginUrl;
    }
  }

  iframeLoad(event: any) {
    if (!!event.currentTarget.src) {
      this.user.refresh();
      this.isLoginModalDisplayed = !this.user.current.isAuthenticated;
    }
  }

  logout() {
    this.user.logout();
  }
}
