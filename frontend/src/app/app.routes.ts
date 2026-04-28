import { Routes } from '@angular/router';
import { adminGuard } from './services/admin.guard';
import { AdminPanelComponent } from './pages/admin-panel.component';
import { CartComponent } from './pages/cart.component';
import { LoginComponent } from './pages/login.component';
import { OrderSummaryComponent } from './pages/order-summary.component';
import { ProductDetailComponent } from './pages/product-detail.component';
import { ProductFormComponent } from './pages/product-form.component';
import { ProductListComponent } from './pages/product-list.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order-summary', component: OrderSummaryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminPanelComponent, canActivate: [adminGuard] },
  { path: 'admin/products/new', component: ProductFormComponent, canActivate: [adminGuard] },
  { path: 'admin/products/:id/edit', component: ProductFormComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
