import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="auth-layout">
      <form [formGroup]="form" (ngSubmit)="submit()" class="panel auth-panel">
        <p class="eyebrow">Admin Login</p>
        <h1>Login</h1>
        <label>
          Username
          <input type="text" formControlName="username" />
        </label>
        <label>
          Password
          <input type="password" formControlName="password" />
        </label>
        <p class="muted">admin / 123456</p>
        @if (errorMessage) {
          <p class="alert error">{{ errorMessage }}</p>
        }
        <button type="submit" [disabled]="form.invalid || pending">Login</button>
      </form>
    </section>
  `
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  pending = false;
  errorMessage = '';

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.getRawValue();
    this.pending = true;
    this.errorMessage = '';

    this.auth.login(username, password).subscribe({
      next: () => {
        this.pending = false;
        this.router.navigateByUrl('/admin');
      },
      error: () => {
        this.pending = false;
        this.errorMessage = 'Login failed.';
      }
    });
  }
}
