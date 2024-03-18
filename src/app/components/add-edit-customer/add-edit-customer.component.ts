import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '../../services/utils/alert.service';
import { AddEditCustomerValidatorService } from '../../services/validators/add-edit-customer-validator.service';
import { MessageType } from '../../models/message-type.enum';

@Component({
  selector: 'app-add-edit-customer',
  templateUrl: './add-edit-customer.component.html',
  styleUrl: './add-edit-customer.component.css'
})
export class AddEditCustomerComponent implements OnInit {
  // Properties for error messages and response
  errorMessage!: string;
  errorResponseJson!: string;

  // Form group for customer data
  customerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private dialogref: MatDialogRef<AddEditCustomerComponent>,
    private addEditCustomerValidatorService: AddEditCustomerValidatorService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      // Initialize the customer form with validation
      this.customerForm = this.addEditCustomerValidatorService.addEditCustomerValidator();
  }

  // Utility function to check form control validity
  public f = (controlName: string, errorName: string) => {
    return this.customerForm.controls[controlName].hasError(errorName);
  }

  ngOnInit(): void {
    // Populate the form with data if editing an existing customer
    this.customerForm.patchValue(this.data)
  }

  /**
   * Handles the form submission for customer data.
   * If the form is valid, it processes the form data, either updating an existing customer
   * or creating a new one, and handles success or error responses accordingly.
   */
  onFormSubmit() {
    // Check if the form is valid
    if (!this.customerForm.valid) {
      return;
    }
    
    // Extract the form data
    const customerFormValue = this.customerForm.value;
    
    // Handle success responses
    const handleSuccess = (action: string, name: string) => {
      // Construct and display success message
      const message = `Customer ${name} ${action} successfully.`;
      alert(message);

      this.alertService.showMessage(message, MessageType.Success);
      this.alertService.emitRefresh();
      this.dialogref.close(true);
    };
    
    // Format error messages from the server response
    const formatErrorMessages = (error: any): string => {
      if (error && error.invalidParams) {
        // Format validation error messages
        return error.invalidParams.map((param: any) => param.cause).join('\n');
      } else if (error && error.message) {
        // Use the provided error message
        return error.message;
      } else {
         // Default error message for unexpected errors
        return 'An unexpected error occurred.';
      }
    };
    
    // Handle error responses
    const handleErrorResponse = (err: any) => {
      const errorMessage = formatErrorMessages(err.error);
      // Store the raw error response for debugging purposes
      this.errorResponseJson = JSON.stringify(err.error);
      // Display error message
      this.alertService.showMessage(errorMessage, MessageType.Error);
    };
    
    // Response object with next and error callbacks
    const handleResponse = {
      next: () => {
        const action = this.data ? 'updated' : 'created';
        // Handle success based on the action
        handleSuccess(action, customerFormValue.name);
      },
      error: handleErrorResponse
    };
    
    // Perform either update or create operation 
    if (this.data) {
      this.customerService.updateCustomer(this.data.id, customerFormValue).subscribe(handleResponse);
    } else {
      this.customerService.createCustomer(customerFormValue).subscribe(handleResponse);
    }
  }
  
}
