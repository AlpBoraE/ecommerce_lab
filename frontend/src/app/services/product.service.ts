import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Product, ProductRequest } from '../models';

interface ProductQuery {
  categoryId?: number | null;
  search?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api';

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getProducts(query: ProductQuery = {}): Observable<Product[]> {
    let params = new HttpParams();

    if (query.categoryId) {
      params = params.set('categoryId', query.categoryId);
    }
    if (query.search?.trim()) {
      params = params.set('search', query.search.trim());
    }

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  createProduct(request: ProductRequest): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/admin/products`, request);
  }

  updateProduct(id: number, request: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/admin/products/${id}`, request);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/products/${id}`);
  }
}
