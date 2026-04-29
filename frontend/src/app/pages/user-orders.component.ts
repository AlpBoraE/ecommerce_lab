import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs';
import { AdminOrder } from '../models';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-user-orders',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-orders.component.html'
})
export class UserOrdersComponent {
  private readonly orderService = inject(OrderService);
  private readonly refreshSubject = new BehaviorSubject<void>(undefined);

  errorMessage = '';
  successMessage = '';
  cancelingOrderId: number | null = null;

  readonly orders$ = this.refreshSubject.pipe(
    switchMap(() => {
      this.errorMessage = '';
      return this.orderService.getMyOrders().pipe(
        catchError(() => {
          this.errorMessage = 'Orders could not be loaded.';
          return of([] as AdminOrder[]);
        })
      );
    })
  );

  refresh(): void {
    this.refreshSubject.next();
  }

  cancel(order: AdminOrder): void {
    if (order.status === 'CANCELED' || !confirm(`Cancel order #${order.id}?`)) {
      return;
    }

    this.cancelingOrderId = order.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.orderService.cancelMyOrder(order.id).subscribe({
      next: () => {
        this.cancelingOrderId = null;
        this.successMessage = `Order #${order.id} marked as Cancelled.`;
        this.refreshSubject.next();
      },
      error: () => {
        this.cancelingOrderId = null;
        this.errorMessage = 'Order could not be canceled.';
      }
    });
  }
}
