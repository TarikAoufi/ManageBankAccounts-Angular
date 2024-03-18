import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AddEditCustomerValidatorService {

  constructor(private fb: FormBuilder) { }

  /**
   * Returns a form group for validating inputs when adding or editing customer details.
   * @returns A form group with validators for the name and email fields.
   */
  addEditCustomerValidator(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]]
    });
  }
}
