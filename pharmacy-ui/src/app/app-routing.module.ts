import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicineListComponent } from './components/medicines/medicine-list/medicine-list.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { MedicineDetailComponent } from './components/medicines/medicine-detail/medicine-detail.component';
import { CartComponent } from './components/orders/cart/cart.component';
import { CheckoutComponent } from './components/orders/checkout/checkout.component';
import { OrderHistoryComponent } from './components/orders/order-history/order-history.component';
import { AuthGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { AdminMedicinesComponent } from './components/admin/admin-medicines/admin-medicines.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UploadPrescriptionComponent } from './components/prescriptions/upload-prescription/upload-prescription.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  // ==================== PUBLIC ROUTES ====================
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: MedicineListComponent },
  { path: 'product/:id', component: MedicineDetailComponent },
  
  // ==================== AUTH ROUTES ====================
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // ==================== CUSTOMER ROUTES (Protected) ====================
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'my-orders', component: OrderHistoryComponent, canActivate: [AuthGuard] },
  { path: 'my-prescriptions', component: UploadPrescriptionComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  
  // ==================== ADMIN ROUTES (Protected + Admin Role) ====================
  { path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/medicines', component: AdminMedicinesComponent, canActivate: [adminGuard] },
  { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [adminGuard] },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [adminGuard] },
  
  // ==================== ERROR ROUTES ====================
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
