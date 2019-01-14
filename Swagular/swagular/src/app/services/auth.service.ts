
import { environment } from './../../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { Subject } from 'rxjs';
// import { UserRoles } from '../models/UserRoles';

@Injectable()
export class AuthService {

  constructor(public navigationService: Router) { }

  private renewalInterval = 300; // Number of seconds betweem renewals
  private loggedInSource = new Subject<any>();
  public loggedIn$ = this.loggedInSource.asObservable();

  auth0: any = new auth0.WebAuth({
    clientID: environment.clientID,
    domain: environment.domain,
    responseType: 'token id_token',
    // audience: environment.audience,
    redirectUri: environment.redirectUri,
    scope: 'openid',
  });

  private tokenRenewalTimeout: any;

  public login(): void {
    this.auth0.authorize();
  }

  public renewToken() {
    this.auth0.renewAuth({
      // audience: environment.audience,
      redirectUri: environment.redirectUri,
    }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        this.setSession(result);
      }
    });
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, result) => {
      if (result && result.accessToken && result.idToken) {
        this.setSession(result);
        this.navigationService.navigate(['/']);
      } else if (err) {
        this.navigationService.navigate(['/']);
        console.log(err);
        console.log(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  private setSession(result): void {
    const expiresAt = JSON.stringify((result.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', result.accessToken);
    localStorage.setItem('id_token', result.idToken);
    localStorage.setItem('expires_at', expiresAt);

    this.loggedInSource.next();

    this.scheduleRenewal();
  }

  // public isAdmin() {
  //   const token = localStorage.getItem('access_token');
  //   if (!token) {
  //     return false;
  //   }

  //   const jwt = this.parseJwt(token);
  //   const roles = jwt["http://xys.swag.eu.lol"];

  //   if (roles.indexOf(UserRoles.ADMIN) >= 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // private parseJwt(token) {
  //   const base64Url = token.split('.')[1];
  //   const base64 = base64Url.replace('-', '+').replace('_', '/');
  //   const parsed = JSON.parse(window.atob(base64));

  //   return parsed;
  // }

  public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    clearTimeout(this.tokenRenewalTimeout);

    this.navigationService.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  public waitForAuth() {
    return new Promise((resolve, reject) => {
      if (this.isAuthenticated()) {
        return resolve();
      }

      this.loggedIn$.subscribe(() => {
        return resolve();
      });
    });
  }

  public scheduleRenewal() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const timeDiff = expiresAt - Date.now();

    if (this.isAuthenticated() && timeDiff > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewToken();
      }, timeDiff - this.renewalInterval);
    }
  }
}
