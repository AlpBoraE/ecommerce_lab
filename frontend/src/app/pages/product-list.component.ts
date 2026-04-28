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
  templateUrl: './product-list.component.html'
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
