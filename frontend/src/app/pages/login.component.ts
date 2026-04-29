import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)]
    })
  });

  mode: 'login' | 'register' = 'login';
  pending = false;
  errorMessage = '';

  setMode(mode: 'login' | 'register'): void {
    if (this.pending) {
      return;
    }

    this.mode = mode;
    this.errorMessage = '';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.getRawValue();
    this.pending = true;
    this.errorMessage = '';

    const request$ =
      this.mode === 'login'
        ? this.auth.login(username.trim(), password)
        : this.auth.register(username.trim(), password);

    request$.subscribe({
      next: () => {
        this.pending = false;
        this.navigateAfterAuth();
      },
      error: () => {
        this.pending = false;
        this.errorMessage =
          this.mode === 'login' ? 'Login failed.' : 'Register failed. Username may already be taken.';
      }
    });
  }

  private navigateAfterAuth(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (this.auth.isAdmin()) {
      this.router.navigateByUrl('/admin/orders');
      return;
    }

    this.router.navigateByUrl(returnUrl?.startsWith('/admin') ? '/' : returnUrl || '/');
  }
}
