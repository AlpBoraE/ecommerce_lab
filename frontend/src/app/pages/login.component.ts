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

    this.auth.login(username.trim(), password).subscribe({
      next: () => {
        this.pending = false;
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        if (this.auth.isAdmin()) {
          this.router.navigateByUrl('/admin/orders');
          return;
        }

        this.router.navigateByUrl(returnUrl?.startsWith('/admin') ? '/' : returnUrl || '/');
      },
      error: () => {
        this.pending = false;
        this.errorMessage = 'Login failed.';
      }
    });
  }
}
