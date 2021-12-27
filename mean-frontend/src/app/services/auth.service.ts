import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { AuthData } from '../models/auth-data.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;
  authStatusListener = new Subject<boolean>();

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  signup(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    }

    this.httpClient.post(environment.apiURL + "/user/signup", authData)
      .subscribe(response => {
        // Redirect to the login page
        this.router.navigate(["/login"]);
      },
        error => {
          // Redirect to the signup page
          this.authStatusListener.next(false);
          this.router.navigate(["/signup"]);
        });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    }

    this.httpClient.post<{ message: string, token: string, expiresIn: number, userId: string }>
      (environment.apiURL + "/user/login", authData)
      .subscribe(response => {
        this.token = response.token;
        if (this.token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.userId = response.userId;

          // Logout after token expire
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);

          // Save authData
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(this.token, expirationDate, this.userId);

          // Redirect to the main page
          this.router.navigate(["/"]);
        }
      },
        error => {
          // Redirect to the login page
          this.authStatusListener.next(false);
          this.router.navigate(["/login"]);
        });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;

    clearTimeout(this.tokenTimer);
    this.clearAuthData();

    // Redirect to the main page
    this.router.navigate(["/"]);
  }

  getUserId() {
    return this.userId;
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  // Reauthenticate user if token not expired
  autoAuthUser() {
    const authData = this.getAuthData();
    if (!authData) {
      return;
    }

    const now = new Date();
    const expiresIn = authData.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authData.token;
      this.isAuthenticated = true;
      this.userId = authData.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expirationDate", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expirationDate");
    const userId = localStorage.getItem("userId");

    if (!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
