import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-admin-panel',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="section-heading">
      <div>
        <p class="eyebrow">Admin Panel</p>
        <h1>Products</h1>
      </div>
      <a class="button" routerLink="/admin/products/new">Add product</a>
    </section>

    <div class="admin-table">
      <div class="admin-header">
        <span>Name</span>
        <span>Category</span>
        <span>Price</span>
        <span>Stock</span>
        <span></span>
      </div>
      @if (products$ | async; as products) {
        @for (product of products; track product.id) {
          <article class="admin-row">
            <strong>{{ product.name }}</strong>
            <span>{{ product.category.name }}</span>
            <span>{{ product.price | currency: 'TRY' : 'symbol-narrow' }}</span>
            <span>{{ product.stock }}</span>
            <div class="row-actions">
              <a class="button ghost" [routerLink]="['/admin/products', product.id, 'edit']">Edit</a>
              <button type="button" class="danger ghost" (click)="delete(product.id)">Delete</button>
            </div>
          </article>
        }
      }
    </div>
  `
})
export class AdminPanelComponent {
  private readonly productService = inject(ProductService);
  private readonly refreshSubject = new BehaviorSubject<void>(undefined);

  readonly products$ = this.refreshSubject.pipe(switchMap(() => this.productService.getProducts()));

  delete(productId: number): void {
    if (!confirm('Delete this product?')) {
      return;
    }

    this.productService.deleteProduct(productId).subscribe(() => this.refreshSubject.next());
  }
}
