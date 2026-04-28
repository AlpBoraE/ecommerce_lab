import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'aad-shop-token';
  private readonly apiUrl = 'http://localhost:8080/api';
  private readonly loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  readonly loggedIn$ = this.loggedInSubject.asObservable();

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.token);
          this.loggedInSubject.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedInSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
