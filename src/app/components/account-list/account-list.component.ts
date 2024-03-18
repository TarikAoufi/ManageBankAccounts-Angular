import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountDto } from '../../models/accountDto.model';
import { AccountService } from '../../services/account.service';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '../../services/customer.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from '../../services/utils/alert.service';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { MessageType } from '../../models/message-type.enum';
import { CommonService } from '../../services/utils/common.service';
import { CommonMixin } from '../../shared/common.mixin';


@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css'],
})
export class AccountListComponent extends CommonMixin implements OnInit {

  // MatTableDataSource for holding the accounts data
  dataSource!: MatTableDataSource<any>;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  customerId!: number;
  selectedCustomerName!: any;

  // Messages for alerts
  errorMessage!: string;
  successMessage!: string;
  warnMessage!: string;

  // Displayed columns in the MatTable
  displayedColumns: string[] = ['id', 'balance', 'createdOn', 'status', 'modifiedOn', 'accountType', 'overdraftLimit', 'interestRate', 'action'];

  // ViewChild for accessing MatPaginator and MatSort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private alertService: AlertService,
    private customerService: CustomerService,
    private router: Router,
    public commonService: CommonService
  ) { 
    super();
  }

  ngOnInit(): void {
    // Hide the add customer button
    this.alertService.setAddCustomerVisibility(false);

    // Retrieve customer ID from route parameters
    this.route.params.subscribe(params => {
      this.customerId = +params['customerId'];
      if (this.customerId) {
        this.loadAccounts(this.customerId);
      }
    });

    // Retrieve customer information
    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (data) => {
        this.selectedCustomerName = data.name;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.alertService.showMessage(this.errorMessage, MessageType.Error);
      }
    });

    // Subscribe to success, warning, and error messages
    this.alertService.getMessageObservable(MessageType.Success).subscribe(message => {
      this.successMessage = message;
    });
    this.alertService.getMessageObservable(MessageType.Warn).subscribe(message => {
      this.warnMessage = message;
    });
    this.alertService.getMessageObservable(MessageType.Error).subscribe(message => {
      this.errorMessage = message;
    })
  }

  /**
   * Apply filter to the table
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    const filterFields = ['id', 'balance', 'createdOn', 'status', 'modifiedOn', 'accountType', 'overdraftLimit', 'interestRate'];

    // Create a filter object to hold the filter criteria for each field
    const filters: Record<string, string> = {};

    // Set the filter criteria for each field
    for (const field of filterFields) {
      filters[field] = filterValue;
    }

    // Apply the filters to each column in the dataSource
    this.dataSource.filter = JSON.stringify(filters);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Handle page change event
   */
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.loadAccounts(this.customerId);
  }

  /**
   * Load accounts for a customer
   */
  loadAccounts(customerId: number): void {
    this.customerService.getAccountsByCustomerId(customerId).subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.filterPredicate = this.filterPredicate;
        if (this.dataSource) {
          this.setupDataSource();
        } else {
          const message = 'No account found for this customer.';
          // Display warning message
          this.alertService.showMessage(message, MessageType.Warn);
        }
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.alertService.showMessage(this.errorMessage, MessageType.Error);
      }
    });
  }

  /**
   * Setup data source with sorting and pagination
   */
  setupDataSource(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.paginator.pageSize = this.pageSize;
    }
  }

  /**
   * Custom filter predicate function
   */
  filterPredicate = (data: any, filter: string): boolean => {
    const filters: Record<string, string> = JSON.parse(filter);

    // Check if any of the fields contain the filter value
    for (const field in filters) {
      if (field === 'createdOn' || field === 'modifiedOn') {
        const formattedDate = this.commonService.formatDate(data[field]);
        if (formattedDate.toLowerCase().includes(filters[field])) {
          return true;
        }
      } else if (field === 'accountType') {
        if (this.getAccountTypeValue(data).toLowerCase().includes(filters[field])) {
          return true;
        }
      } else {
        if (data[field] && data[field].toString().toLowerCase().includes(filters[field])) {
          return true;
        }
      }
    }
    return false;
  };

  /**
   * Get account type value for display
   */
  getAccountTypeValue(account: AccountDto): string {
    return this.isCurrentAccount(account) ? 'Current' : 'Savings';
  }

  /**
   * Navigate to account operations page for the selected account
   */
  viewAccountOperations(accountId: string): void {
    this.checkIfAccountHasOperations(accountId).subscribe({
      next: (accountHasOperations) => {
        if (accountHasOperations) {
          // Navigate to the OperationListComponent
          this.router.navigate(['/accounts', accountId, 'operations']);
        } else {
          const message = 'No operation found for this account with ID : ' + accountId;
          // Display a warning message
          this.alertService.showMessage(message, MessageType.Warn);
        }
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.alertService.showMessage(this.errorMessage, MessageType.Error);
      }
    });
  }

  /**
   * Check if account has operations before navigating to account operations page
   */
  private checkIfAccountHasOperations(accountId: string): Observable<boolean> {
    return this.accountService.getAccountOperations(accountId).pipe(
      map(accountOperations => !!accountOperations && accountOperations.length > 0),
      catchError(error => {
        console.error('An error occurred while retrieving the account operations.', error);
        // Handle the error, for example, return a false Observable or throw an exception.
        return of(false);
      })
    );

  }

  /**
   * Close all alert messages
   */
  closeAlert(): void {
    this.alertService.clearAllMessages();
  }

}
