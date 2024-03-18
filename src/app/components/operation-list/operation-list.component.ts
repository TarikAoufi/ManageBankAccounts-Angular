import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AccountService } from '../../services/account.service';
import { AlertService } from '../../services/utils/alert.service';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerService } from '../../services/customer.service';
import { OperationService } from '../../services/operation.service';
import { MessageType } from '../../models/message-type.enum';
import { CommonService } from '../../services/utils/common.service';
import { CommonMixin } from '../../shared/common.mixin';

@Component({
  selector: 'app-operation-list',
  templateUrl: './operation-list.component.html',
  styleUrl: './operation-list.component.css'
})
export class OperationListComponent extends CommonMixin implements OnInit {
  // Table data source
  dataSource!: MatTableDataSource<any>;

  // Pagination settings
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // Customer and account details
  accountId!: string;
  customerId!: number;
  savedCustomerId!: number;

  // Previous route for navigation
  previousRoute: string | null = null;

  // Alert messages
  errorMessage!: string;
  successMessage!: string;
  warnMessage!: string;

  // Columns to be displayed in the table
  displayedColumns: string[] = ['id', 'amount', 'operationType', 'operationDate', 'description', 'action'];

  // ViewChild decorators to access paginator and sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private accountService: AccountService,
    private operationService: OperationService,
    private alertService: AlertService, 
    public commonService: CommonService) { 
      super();
    }

  ngOnInit(): void {
    this.alertService.setAddCustomerVisibility(false);

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

    // Retrieve customerId and accountId from route
    this.route.params.subscribe(params => {
      this.customerId = +params['customerId'];
      this.savedCustomerId = this.customerId;
      this.accountId = params['accountId'];

      // Load operations based on customerId or accountId
      if (this.customerId) {
        this.loadCustomerOperations(this.customerId);
      }
      if (this.accountId) {
        this.loadAccountOperations(this.accountId);
      }
    });

  }

  // Apply filter to the table data
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    const filterFields = ['id', 'amount', 'operationType', 'operationDate', 'description'];

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
    if (this.customerId) {
      this.loadCustomerOperations(this.customerId);
    }
    if (this.accountId) {
      this.loadAccountOperations(this.accountId);
    }
  }

  /**
   * Load operations for a specific account
   */
  loadAccountOperations(accountId: string): void {
    this.accountService.getAccountOperations(accountId).subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.filterPredicate = this.filterPredicate;
        if (this.dataSource) {
          this.setupDataSource();
        } else {
          const message = 'No operation found for this account.';
          // Display warning message
          this.alertService.showMessage(message, MessageType.Warn);
        }
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.alertService.showMessage(this.errorMessage, MessageType.Error);
      }
    });
  }

  /**
   * Load operations for a specific customer
   */
  loadCustomerOperations(customerId: number): void {
    this.customerService.getCustomerOperations(customerId).subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.filterPredicate = this.filterPredicate;
        if (this.dataSource) {
          this.setupDataSource();
        } else {
          const message = 'No operation found for this customer with ID : ' + customerId;
          // Display warning message
          this.alertService.showMessage(message, MessageType.Success);
        }
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.alertService.showMessage(this.errorMessage, MessageType.Error);
      }
    })
  }

  /**
   * Delete operation by ID
   */
  deleteOperation(id: number): void {
    let conf = confirm("Do you want to delete this operation ?");
    if (!conf) return;

    this.operationService.deleteOperation(id).subscribe({
      next: () => {
        // Reload operations after deletion
        if (this.customerId) {
          this.loadCustomerOperations(this.customerId);
        }
        if (this.accountId) {
          this.loadAccountOperations(this.accountId);
        }
        const message = 'Operation with ID ' + id + ' deleted successfully.';
        // Display success message
        this.alertService.showMessage(message, MessageType.Success);
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.alertService.showMessage(this.errorMessage, MessageType.Error);
      }
    });

  }

  /**
   * Setup the data source with sorting and pagination
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
      if (field === 'operationDate') {
        const formattedDate = this.commonService.formatDate(data[field]);
        if (formattedDate.toLowerCase().includes(filters[field])) {
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
   * Clear all alert messages
   */
  closeAlert() {
    this.alertService.clearAllMessages();
  }

}
