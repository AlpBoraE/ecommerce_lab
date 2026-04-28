import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { Product } from '../models';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink],
  template: `
    @if (product$ | async; as product) {
      <section class="detail-layout">
        <img class="detail-image" [src]="product.imageUrl || fallbackImage" [alt]="product.name" />
        <div class="detail-content">
          <a class="back-link" routerLink="/">Back to products</a>
          <span class="chip">{{ product.category.name }}</span>
          <h1>{{ product.name }}</h1>
          <p>{{ product.description }}</p>
          <div class="detail-price">{{ product.price | currency: 'TRY' : 'symbol-narrow' }}</div>
          <div class="stock-line">{{ product.stock }} items available</div>
          <button type="button" (click)="addToCart(product)" [disabled]="product.stock === 0">
            Add to cart
          </button>
        </div>
      </section>
    }
  `
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  readonly fallbackImage =
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
  readonly product$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((id) => this.productService.getProduct(id))
  );

  addToCart(product: Product): void {
    this.cartService.add(product);
  }
}
