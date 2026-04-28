import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CartItem, Product } from '../models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'aad-shop-cart';
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.load());

  readonly items$ = this.itemsSubject.asObservable();
  readonly total$: Observable<number> = this.items$.pipe(
    map((items) => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0))
  );

  getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  add(product: Product): void {
    const items = [...this.itemsSubject.value];
    const existing = items.find((item) => item.product.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ product, quantity: 1 });
    }

    this.save(items);
  }

  update(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }

    const items = this.itemsSubject.value.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    this.save(items);
  }

  remove(productId: number): void {
    this.save(this.itemsSubject.value.filter((item) => item.product.id !== productId));
  }

  clear(): void {
    this.save([]);
  }

  private load(): CartItem[] {
    const rawValue = localStorage.getItem(this.storageKey);
    if (!rawValue) {
      return [];
    }

    try {
      return JSON.parse(rawValue) as CartItem[];
    } catch {
      return [];
    }
  }

  private save(items: CartItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.itemsSubject.next(items);
  }
}
