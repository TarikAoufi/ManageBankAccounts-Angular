import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AccountOperationsValidatorService {

  constructor(private fb: FormBuilder) { }

  /**
   * Returns a form group for validating account search inputs.
   * @returns A form group with validators for the account ID field.
   */
  accountSearchValidator(): FormGroup {
    return new FormGroup({
      accountId: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-]+$/)])
    });
  }

  /**
   * Returns a form group for validating operation inputs when saving an operation.
   * @returns A form group with validators for operation type, target account ID, and amount fields.
   */
  saveOperationValidator(): FormGroup {
    return this.fb.group({
      operationType: ['', [Validators.required]],
      targetAccountId: ['', []], // No default validators
      amount: ['', [Validators.required, Validators.pattern(/^\d+([.,]\d{1,2})?$/)]],
    });
  }

  /**
   * Dynamically adjusts validators for the target account ID field based on the selected operation type.
   * @param formGroup The form group containing the target account ID field.
   * @param operationType The type of operation selected ('TRANSFER', 'DEPOSIT', etc.).
   */
  updateValidatorsForOperationType(formGroup: FormGroup, operationType: string): void {
    const targetAccountIdControl = formGroup.get('targetAccountId');
    const targetAccountIdValidators = operationType === 'TRANSFER' ? [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-]+$/)] : [];

    targetAccountIdControl?.setValidators(targetAccountIdValidators);
    targetAccountIdControl?.updateValueAndValidity();
  }

}
