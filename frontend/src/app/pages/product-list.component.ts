import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, combineLatest, debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs';
import { Product } from '../models';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="section-heading">
      <div>
        <p class="eyebrow">Online Store</p>
        <h1>Products</h1>
      </div>
      <div class="filters">
        <input type="search" placeholder="Search products" [formControl]="searchControl" />
        <select [formControl]="categoryControl">
          <option [ngValue]="null">All categories</option>
          @for (category of categories$ | async; track category.id) {
            <option [ngValue]="category.id">{{ category.name }}</option>
          }
        </select>
      </div>
    </section>

    <section class="product-grid">
      @if (products$ | async; as products) {
        @for (product of products; track product.id) {
          <article class="product-card">
            <img [src]="product.imageUrl || fallbackImage" [alt]="product.name" />
            <div class="product-card-body">
              <div>
                <span class="chip">{{ product.category.name }}</span>
                <h2>{{ product.name }}</h2>
                <p>{{ product.description }}</p>
              </div>
              <div class="product-card-footer">
                <strong>{{ product.price | currency: 'TRY' : 'symbol-narrow' }}</strong>
                <span>{{ product.stock }} in stock</span>
              </div>
              <div class="actions">
                <a class="button ghost" [routerLink]="['/products', product.id]">Details</a>
                <button type="button" (click)="addToCart(product)" [disabled]="product.stock === 0">
                  Add to cart
                </button>
              </div>
            </div>
          </article>
        } @empty {
          <p class="empty">No products found.</p>
        }
      }
    </section>
  `
})
export class ProductListComponent {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  readonly fallbackImage =
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly categoryControl = new FormControl<number | null>(null);
  readonly categories$ = this.productService.getCategories();
  readonly products$: Observable<Product[]> = combineLatest([
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300), distinctUntilChanged()),
    this.categoryControl.valueChanges.pipe(startWith(null))
  ]).pipe(
    switchMap(([search, categoryId]) => this.productService.getProducts({ search, categoryId }))
  );

  addToCart(product: Product): void {
    this.cartService.add(product);
  }
}
