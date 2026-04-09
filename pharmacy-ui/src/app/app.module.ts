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
    AdminDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
