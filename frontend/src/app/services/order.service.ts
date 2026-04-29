import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminOrder, OrderRequest, OrderResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api';

  createOrder(request: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}/orders`, request);
  }

  getMyOrders(): Observable<AdminOrder[]> {
    return this.http.get<AdminOrder[]>(`${this.apiUrl}/orders`);
  }

  cancelMyOrder(orderId: number): Observable<AdminOrder> {
    return this.http.patch<AdminOrder>(`${this.apiUrl}/orders/${orderId}/cancel`, {});
  }

  getAdminOrders(): Observable<AdminOrder[]> {
    return this.http.get<AdminOrder[]>(`${this.apiUrl}/admin/orders`);
  }

  cancelAdminOrder(orderId: number): Observable<AdminOrder> {
    return this.http.patch<AdminOrder>(`${this.apiUrl}/admin/orders/${orderId}/cancel`, {});
  }
}
