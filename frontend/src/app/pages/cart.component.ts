import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem } from '../models';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="section-heading">
      <div>
        <p class="eyebrow">Shopping Cart</p>
        <h1>Cart</h1>
      </div>
      <a class="button ghost" routerLink="/">Continue shopping</a>
    </section>

    @if (items$ | async; as items) {
      @if (items.length > 0) {
        <div class="cart-list">
          @for (item of items; track item.product.id) {
            <article class="cart-row">
              <img [src]="item.product.imageUrl || fallbackImage" [alt]="item.product.name" />
              <div>
                <h2>{{ item.product.name }}</h2>
                <p>{{ item.product.price | currency: 'TRY' : 'symbol-narrow' }}</p>
              </div>
              <input
                #quantityInput
                type="number"
                min="1"
                [value]="item.quantity"
                (change)="updateQuantity(item, quantityInput.value)"
              />
              <strong>{{ item.product.price * item.quantity | currency: 'TRY' : 'symbol-narrow' }}</strong>
              <button type="button" class="danger ghost" (click)="remove(item.product.id)">Remove</button>
            </article>
          }
        </div>

        <aside class="summary-bar">
          <span>Total</span>
          <strong>{{ total$ | async | currency: 'TRY' : 'symbol-narrow' }}</strong>
          <a class="button" routerLink="/order-summary">Place order</a>
        </aside>
      } @else {
        <p class="empty">Your cart is empty.</p>
      }
    }
  `
})
export class CartComponent {
  private readonly cartService = inject(CartService);

  readonly fallbackImage =
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
  readonly items$ = this.cartService.items$;
  readonly total$ = this.cartService.total$;

  updateQuantity(item: CartItem, value: string): void {
    this.cartService.update(item.product.id, Number(value));
  }

  remove(productId: number): void {
    this.cartService.remove(productId);
  }
}
