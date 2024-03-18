import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddEditCustomerComponent } from './components/add-edit-customer/add-edit-customer.component';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table'; 
import { MatSortModule } from '@angular/material/sort'; 
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarComponent } from './components/toolbar/toolbar.component'; 
import { MatMenuModule } from '@angular/material/menu';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AccountListComponent } from './components/account-list/account-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OperationListComponent } from './components/operation-list/operation-list.component';
import { HomeComponent } from './components/home/home.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AccountOperationsComponent } from './components/account-operations/account-operations.component';
import { AlertMessageComponent } from './components/alert-message/alert-message.component';

@NgModule({
  declarations: [
    AppComponent,
    AddEditCustomerComponent,
    ToolbarComponent,
    CustomerListComponent,
    AccountOperationsComponent,
    AccountListComponent,
    OperationListComponent,
    HomeComponent,
    AlertMessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatCardModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideHttpClient(withFetch()),
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
