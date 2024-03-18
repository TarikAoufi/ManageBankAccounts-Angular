import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationRequestDto } from '../../models/OperationRequestDto.model';
import { AccountService } from '../../services/account.service';
import { OperationService } from '../../services/operation.service';
import { AccountDetails } from '../../models/accountDetails.model';
import { AlertService } from '../../services/utils/alert.service';
import { AccountOperationsValidatorService } from '../../services/validators/account-operations-validator.service';
import { MessageType } from '../../models/message-type.enum';
import { OperationType } from '../../models/operation-type.enum';
import { CommonService } from '../../services/utils/common.service';
import { CommonMixin } from '../../shared/common.mixin';

@Component({
  selector: 'app-account-operations',
  templateUrl: './account-operations.component.html',
  styleUrls: ['./account-operations.component.css']
})
export class AccountOperationsComponent extends CommonMixin implements OnInit {

  // Declaration of form groups, flags, and other properties
  accountFormGroup!: FormGroup;
  operationFormGroup!: FormGroup;

  isSubmitted = false;
  savedAccountId!: string;
  isChangeOperation = false;
  selectedOperation: OperationType | null = null;
  // currentOperationType!: OperationType;

  currentPage: number = 0;
  pageSize: number = 5;

  accountDetails: AccountDetails | null = null;
  accountObservable!: Observable<AccountDetails>;

  errorMessage!: string;
  warnMessage!: string;
  successMessage!: string;

  constructor(
    // Dependency injection of services and form builder
    private accountService: AccountService,
    private operationService: OperationService,
    private accountOperationsValidatorService: AccountOperationsValidatorService,
    private alertService: AlertService,
    public commonService: CommonService
  ) {
    super();
    // Initialize form groups with validators
    this.accountFormGroup = this.accountOperationsValidatorService.accountSearchValidator();
    this.operationFormGroup = this.accountOperationsValidatorService.saveOperationValidator();
  }


  ngOnInit(): void {
    // Initialization  
    this.errorMessage = '';
    this.alertService.setAddCustomerVisibility(false);

    // Subscribe to message observables for different message types
    this.alertService.getMessageObservable(MessageType.Success).subscribe(message =>
      this.successMessage = message);
    this.alertService.getMessageObservable(MessageType.Warn).subscribe(message =>
      this.warnMessage = message);
    this.alertService.getMessageObservable(MessageType.Error).subscribe(message => {
      this.errorMessage = message;
    })
  }

  /**
   * Function to search for account details
   */
  onSearchAccount(): void {
    this.accountDetails = null;
    const accountId: string = this.accountFormGroup.value.accountId;
    this.savedAccountId = accountId;

    // Fetch account details from the service
    this.accountService.getAccount(accountId, this.currentPage, this.pageSize).subscribe({
      next: (accountDetails: AccountDetails) => {
        this.accountDetails = accountDetails;
        if (accountDetails.operationDtos.length == 0) {
          // Display warning message
          this.alertService.showMessage('No operation found for this account.', MessageType.Warn);
        }
        if (this.accountFormGroup.valid) {
          // Reset form
          this.accountFormGroup.reset();
        }
      },
      error: (err) => {
        this.handleError(err)
      }
    });
  }

  /**
   * Function to handle pagination
   */
  viewPage(page: number) {
    this.currentPage = page;
    // Re-inject saved value
    this.accountFormGroup.patchValue({
      accountId: this.savedAccountId,
    });
    this.onSearchAccount();
  }

  /**
   * Function to perform account operation
   */
  accountOperation(): void {
    this.isSubmitted = true;

    if (this.operationFormGroup.invalid) {
      // Don't send request if form is invalid
      return;
    }

    const accountId: string = this.savedAccountId;
    const sourceAccountId: string = accountId;
    const targetAccountId: string = this.operationFormGroup.value.targetAccountId;

    const amountInput: string = this.operationFormGroup.value.amount;
    const amount: number = amountInput.includes(',') ?
      parseFloat(amountInput.replace(',', '.')) : parseFloat(amountInput);

    const operationType = this.operationFormGroup.value.operationType;
    this.selectedOperation = operationType; // Update selected operation

    const request: OperationRequestDto = { accountId, sourceAccountId, targetAccountId, amount, operationType };

    this.performOperation(operationType, request);

  }

  /**
   * Getter for form controls
   */
  get f(): { [key: string]: AbstractControl } {
    return this.operationFormGroup.controls;
  }

  /**
   * Getter for operation type form control
   */
  get operationTypeForm() {
    return this.operationFormGroup.get('operationType');
  }

  /**
   * Updates validators for the given operation type, resets the operation form fields, 
   * and ensures a consistent form state.
   * 
   */
  updateValidatorsForOperationType(): void {

    const operationType = this.operationFormGroup.value.operationType;
    this.accountOperationsValidatorService.updateValidatorsForOperationType(this.operationFormGroup, operationType);

    this.resetFormOperation(operationType);

  }

  /**
   * Resets the operation form fields based on the selected operation type.
   * @param operationType - The operation type to check and reset fields for.
   */
  resetFormOperation(operationType: OperationType): void {
    // Operation type is different from the selected operation 
    if (this.selectedOperation !== operationType) {
      this.isSubmitted = false;
      this.operationFormGroup.patchValue({
        targetAccountId: null,
        amount: null
      });
    }
  }

  /**
   * Function to perform operation based on operation type
   */
  private performOperation(operationType: OperationType, request: OperationRequestDto): void {
    const operationServiceMethod = this.getOperationServiceMethod(operationType);

    // Subscribe to the operation service method
    operationServiceMethod(request).subscribe({
      next: () => this.handleOperationSuccess(operationType),
      error: (err) => this.handleError(err)
    });
  }

  /**
   * Method to determine the appropriate operation service method
   */
  private getOperationServiceMethod(operationType: OperationType): (request: OperationRequestDto) => Observable<any> {
    switch (operationType) {
      case OperationType.WITHDRAWAL:
        return this.operationService.withdraw.bind(this.operationService);
      case OperationType.DEPOSIT:
        return this.operationService.deposit.bind(this.operationService);
      case OperationType.TRANSFER:
        return this.operationService.transfer.bind(this.operationService);
      default:
        throw new Error('Unsupported operation type');
    }
  }

  /**
   * Method to handle successful operation
   */
  private handleOperationSuccess(operationType: OperationType): void {
    const successMessage = `${operationType} operation has been successfully saved!`;
    alert(successMessage);
    this.alertService.showMessage(successMessage, MessageType.Success);

    // Re-inject saved value into accountFormGroup
    this.accountFormGroup.patchValue({
      accountId: this.savedAccountId,
    });

    // Reset form and form errors
    this.operationFormGroup.reset();
    this.operationFormGroup.setErrors(null);
    this.isSubmitted = false;

    // Reload default validators
    this.updateValidatorsForOperationType();
    this.onSearchAccount();

  }

  /**
   * Function to handle operation error
   */
  private handleError(err: any): void {
    if (err.error && err.error.invalidParams) {
     
      const errorMessage = err.error.invalidParams.map((param: any) => param.cause).join('<br>');
      this.alertService.showMessage(errorMessage, MessageType.Error);
    
      // Handle multiple validation errors
      /*
      const errorMessages: string[] = err.error.invalidParams.map((param: any) => param.cause);
      this.alertService.showMessage(errorMessages.join('<br>'), MessageType.Error);
      */

    } else if (err.error && err.error.message) {
      this.errorMessage = err.error.message;
      this.alertService.showMessage(this.errorMessage, MessageType.Error);
    } else {
      this.alertService.showMessage('An unexpected error occurred.', MessageType.Error);
    }

  }

  /**
   * Method to reset the form
   */
  onReset(): void {
    this.isSubmitted = false;
    this.operationFormGroup.reset();
  }

  /**
   * Method to close alerts
   */
  closeAlert(): void {
    this.alertService.clearAllMessages();
  }

}
