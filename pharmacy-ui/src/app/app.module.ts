import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MedicineListComponent } from './components/medicines/medicine-list/medicine-list.component';
import { MedicineDetailComponent } from './components/medicines/medicine-detail/medicine-detail.component';
import { CartComponent } from './components/orders/cart/cart.component';
import { CheckoutComponent } from './components/orders/checkout/checkout.component';
import { OrderHistoryComponent } from './components/orders/order-history/order-history.component';
import { UploadPrescriptionComponent } from './components/prescriptions/upload-prescription/upload-prescription.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminMedicinesComponent } from './components/admin/admin-medicines/admin-medicines.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

// Guards & Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    MedicineListComponent,
    MedicineDetailComponent,
    CartComponent,
    CheckoutComponent,
    OrderHistoryComponent,
    UploadPrescriptionComponent,
    ProfileComponent,
    UserDashboardComponent,
    AdminDashboardComponent,
    AdminMedicinesComponent,
    AdminOrdersComponent,
    AdminUsersComponent,
    PageNotFoundComponent
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