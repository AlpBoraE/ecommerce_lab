import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-admin-panel',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-panel.component.html'
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
