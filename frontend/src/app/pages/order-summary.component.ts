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
  templateUrl: './order-summary.component.html'
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
