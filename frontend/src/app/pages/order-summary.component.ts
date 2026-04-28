import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrderRequest } from '../models';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-summary',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="section-heading">
      <div>
        <p class="eyebrow">Order Summary</p>
        <h1>Checkout</h1>
      </div>
      <a class="button ghost" routerLink="/cart">Back to cart</a>
    </section>

    <div class="checkout-layout">
      <form [formGroup]="form" (ngSubmit)="submit()" class="panel">
        <label>
          Full name
          <input type="text" formControlName="customerName" />
        </label>
        <label>
          Email
          <input type="email" formControlName="customerEmail" />
        </label>
        <label>
          Address
          <textarea rows="4" formControlName="address"></textarea>
        </label>

        @if (errorMessage) {
          <p class="alert error">{{ errorMessage }}</p>
        }
        @if (successMessage) {
          <p class="alert success">{{ successMessage }}</p>
        }

        <button type="submit" [disabled]="form.invalid || pending">Submit order</button>
      </form>

      <aside class="panel">
        <h2>Items</h2>
        @if (items$ | async; as items) {
          @for (item of items; track item.product.id) {
            <div class="mini-row">
              <span>{{ item.product.name }} x {{ item.quantity }}</span>
              <strong>{{ item.product.price * item.quantity | currency: 'TRY' : 'symbol-narrow' }}</strong>
            </div>
          } @empty {
            <p class="empty small">Cart is empty.</p>
          }
        }
        <div class="mini-total">
          <span>Total</span>
          <strong>{{ total$ | async | currency: 'TRY' : 'symbol-narrow' }}</strong>
        </div>
      </aside>
    </div>
  `
})
export class OrderSummaryComponent {
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);

  readonly items$ = this.cartService.items$;
  readonly total$ = this.cartService.total$;
  readonly form = new FormGroup({
    customerName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    customerEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    address: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  pending = false;
  errorMessage = '';
  successMessage = '';

  submit(): void {
    const items = this.cartService.getItems();
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (items.length === 0) {
      this.errorMessage = 'Cart is empty.';
      return;
    }

    const value = this.form.getRawValue();
    const request: OrderRequest = {
      ...value,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    this.pending = true;
    this.orderService.createOrder(request).subscribe({
      next: (response) => {
        this.pending = false;
        this.successMessage = `Order #${response.orderId} created.`;
        this.cartService.clear();
        this.form.reset();
      },
      error: () => {
        this.pending = false;
        this.errorMessage = 'Order could not be created.';
      }
    });
  }
}
