import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { MedicineListComponent } from './components/medicines/medicine-list/medicine-list.component';
import { MedicineDetailComponent } from './components/medicines/medicine-detail/medicine-detail.component';
import { CartComponent } from './components/orders/cart/cart.component';
import { CheckoutComponent } from './components/orders/checkout/checkout.component';
import { OrderHistoryComponent } from './components/orders/order-history/order-history.component';
import { UploadPrescriptionComponent } from './components/prescriptions/upload-prescription/upload-prescription.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AdminMedicinesComponent } from './components/admin/admin-medicines/admin-medicines.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MedicineListComponent,
    MedicineDetailComponent,
    CartComponent,
    CheckoutComponent,
    OrderHistoryComponent,
    UploadPrescriptionComponent,
    AdminDashboardComponent,
    NavbarComponent,
    HomeComponent,
    ProfileComponent,
    PageNotFoundComponent,
    AdminMedicinesComponent,
    AdminOrdersComponent,
    AdminUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
