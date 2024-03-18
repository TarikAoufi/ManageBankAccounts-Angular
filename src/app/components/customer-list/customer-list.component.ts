import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '../../services/customer.service';
import { AlertService } from '../../services/utils/alert.service';
import { Router } from '@angular/router';
import { AddEditCustomerComponent } from '../add-edit-customer/add-edit-customer.component';
import { Observable, catchError, map, of } from 'rxjs';
import { MessageType } from '../../models/message-type.enum';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {
  // MatTable properties
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'email', 'action'];

  // MatPaginator properties
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  accounts: any[] = [];
  customers: any[] = [];

  errorMessage!: string;
  successMessage!: string;
  warnMessage!: string;

  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService,
    private alertService: AlertService,
    private router: Router) { }

  ngOnInit(): void {
    // Enable adding customers
    this.alertService.setAddCustomerVisibility(true);

    // Subscribe to customer refresh event
    this.alertService.customerRefresh$.subscribe(() => {
      this.getCustomers(); // Refresh customer list
    });

    // Subscribe to success, warn, and error messages
    this.alertService.getMessageObservable(MessageType.Success).subscribe(message => {
      this.successMessage = message;
    });
    this.alertService.getMessageObservable(MessageType.Warn).subscribe(message => {
      this.warnMessage = message;
    });
    this.alertService.getMessageObservable(MessageType.Error).subscribe(message => {
      this.errorMessage = message;
    });
  }

  /**
   * Retrieve all customers
   */
  getCustomers(): void {
    this.customerService.getAllCustomer().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.setupDataSource();
      },
      error: (error) => this.handleErrorMessage(error)
    });
  }

  /**
   *  Apply filter to the MatTable
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Handle page change event
   */
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.getCustomers();
  }

  /**
   * Open Add/Edit Customer dialog
   */
  updateCustomer(data: any): void {
    const dialogRef = this.dialog.open(AddEditCustomerComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCustomers();
        }
      }
    });
  }

  /**
   * Delete a customer
   */
  deleteCustomer(id: number): void {
    let conf = confirm("Do you want to delete this customer ?");
    if (!conf) return;
    this.customerService.deleteCustomer(id).subscribe({
      next: () => {
        this.getCustomers();
        // Display success message
        this.alertService.showMessage('Customer with ID ' + id + ' deleted successfully.', MessageType.Success);
      },
      error: (error) => this.handleErrorMessage(error)
    });
  }

  /**
   * View customer accounts
   */
  viewCustomerAccounts(customerId: number): void {
    this.checkIfCustomerHasAccounts(customerId).subscribe({
      next: (customerHasOperations) => this.navigateOrShowMessage(customerHasOperations, customerId, 'accounts'),
      error: (error) => this.handleErrorMessage(error)
    });
  }

  /**
   * View customer operations
   */
  viewCustomerOperations(customerId: number): void {
    this.checkIfCustomerHasOperations(customerId).subscribe({
      next: (customerHasOperations) => this.navigateOrShowMessage(customerHasOperations, customerId, 'operations'),
      error: (error) => this.handleErrorMessage(error)
    });
  }

  /**
   * Method to check if a customer has accounts
   */
  private checkIfCustomerHasAccounts(customerId: number): Observable<boolean> {
    return this.customerService.getAccountsByCustomerId(customerId).pipe(
      map(customerAccounts => !!customerAccounts && customerAccounts.length > 0),
      catchError(error => {
        console.error('An error occurred while retrieving the customer\'s accounts.', error);
        return of(false);
      })
    );
  }

  /**
   * Method to check if a customer has operations
   */
  private checkIfCustomerHasOperations(customerId: number): Observable<boolean> {
    return this.customerService.getCustomerOperations(customerId).pipe(
      map(customerOperations => !!customerOperations && customerOperations.length > 0),
      catchError(error => {
        console.error('An error occurred while retrieving the customer\'s operations.', error);
        return of(false);
      })
    )
  }

  /**
   * Handle error messages
   */
  private handleErrorMessage(error: any): void {
    this.errorMessage = error.message;
    this.alertService.showMessage(this.errorMessage, MessageType.Error);
  }

  /**
   * Method to navigate or show a warning message
   */
  private navigateOrShowMessage(hasData: boolean, customerId: number, route: string): void {
    if (hasData) {
      this.router.navigate(['/customers', customerId, route]);
    } else {
      this.alertService.showMessage(`No ${route} found for this customer.`, MessageType.Warn);
    }
  }

  private setupDataSource(): void {
    if (this.dataSource) {
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        this.paginator.pageSize = this.pageSize;
      }
    }
  }

  /**
   * Clear all alert messages
   */
  closeAlert() {
    this.alertService.clearAllMessages();
  }

}
