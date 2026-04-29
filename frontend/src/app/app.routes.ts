import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';
import { adminGuard } from './services/admin.guard';
import { AdminOrdersComponent } from './pages/admin-orders.component';
import { AdminPanelComponent } from './pages/admin-panel.component';
import { CartComponent } from './pages/cart.component';
import { LoginComponent } from './pages/login.component';
import { OrderSummaryComponent } from './pages/order-summary.component';
import { ProductDetailComponent } from './pages/product-detail.component';
import { ProductFormComponent } from './pages/product-form.component';
import { ProductListComponent } from './pages/product-list.component';
import { UserOrdersComponent } from './pages/user-orders.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent, canActivate: [authGuard] },
  { path: 'products/:id', component: ProductDetailComponent, canActivate: [authGuard] },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'order-summary', component: OrderSummaryComponent, canActivate: [authGuard] },
  { path: 'orders', component: UserOrdersComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminPanelComponent, canActivate: [adminGuard] },
  { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [adminGuard] },
  { path: 'admin/products/new', component: ProductFormComponent, canActivate: [adminGuard] },
  { path: 'admin/products/:id/edit', component: ProductFormComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
