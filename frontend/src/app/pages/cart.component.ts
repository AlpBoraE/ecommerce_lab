import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem } from '../models';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html'
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
