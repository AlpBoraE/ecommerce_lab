import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, AuthRole } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'aad-shop-token';
  private readonly roleKey = 'aad-shop-role';
  private readonly apiUrl = 'http://localhost:8080/api';
  private readonly loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  private readonly roleSubject = new BehaviorSubject<AuthRole | null>(this.getRole());

  readonly loggedIn$ = this.loggedInSubject.asObservable();
  readonly role$ = this.roleSubject.asObservable();

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(tap((response) => this.storeAuth(response)));
  }

  register(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/register`, { username, password })
      .pipe(tap((response) => this.storeAuth(response)));
  }

  private storeAuth(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.roleKey, response.role);
    this.loggedInSubject.next(true);
    this.roleSubject.next(response.role);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.loggedInSubject.next(false);
    this.roleSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.getRole();
  }

  getRole(): AuthRole | null {
    const role = localStorage.getItem(this.roleKey);
    return role === 'ADMIN' || role === 'USER' ? role : null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isUser(): boolean {
    return this.getRole() === 'USER';
  }
}
