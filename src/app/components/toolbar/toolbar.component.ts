import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditCustomerComponent } from '../add-edit-customer/add-edit-customer.component';
import { CustomerService } from '../../services/customer.service';
import { AlertService } from '../../services/utils/alert.service';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent implements OnInit {

  // Flag to determine if the "Add Customer" button should be visible
  isAddCustomerVisible: boolean = true;
  
  constructor(
    private dialog: MatDialog, 
    private customerService: CustomerService,
    private alertService: AlertService
    ) { }

  ngOnInit(): void {
    // Subscribe to changes in the visibility of the "Add Customer" button
    this.alertService.isAddCustomerVisible$.subscribe((isVisible: boolean) => {
      this.isAddCustomerVisible = isVisible;
    });

  }

  /**
   * Opens the add/edit customer form dialog.
   */
  openAddEditCustomerForm() {
    this.dialog.open(AddEditCustomerComponent);
  }

}
