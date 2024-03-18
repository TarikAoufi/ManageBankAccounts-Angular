import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { AccountOperationsComponent } from './components/account-operations/account-operations.component';
import { AccountListComponent } from './components/account-list/account-list.component';
import { OperationListComponent } from './components/operation-list/operation-list.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path : "customers", component : CustomerListComponent},
  { path : "accounts", component : AccountOperationsComponent},
  { path : "customers/:customerId/accounts", component : AccountListComponent},
  { path : "accounts/:accountId/operations", component : OperationListComponent},
  { path : "customers/:customerId/operations", component : OperationListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
