import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { ManageProductsComponent } from './components/manage-products/manage-products';
import { UserHome } from './components/user-home/user-home';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import { guestGuard } from './guards/guest-guard';
export const routes: Routes = [
    { 
      path: 'login',
       component: LoginComponent,
       canActivate: [guestGuard]
    },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard, roleGuard], 
    data: { expectedRole: 'ADMIN' } 
  },
  { 
    path: 'manage-products', 
    component: ManageProductsComponent, 
    canActivate: [authGuard, roleGuard], 
    data: { expectedRole: 'ADMIN' } 
  },

  { 
    path: 'user-home', 
    component: UserHome, 
    canActivate: [authGuard, roleGuard], 
    data: { expectedRole: 'USER' } 
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '', redirectTo: 'login', pathMatch: 'full' }// يفتح لوجن تلقائي
];
