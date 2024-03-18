import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, take, takeUntil, timer } from 'rxjs';
import { SnackBarService } from '../snack-bar.service';
import { MessageType } from '../../models/message-type.enum';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // BehaviorSubjects for different types of messages
  private successMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');  
  private warnMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private errorMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
 
  // BehaviorSubject for customer refresh
  private customerRefreshSource = new BehaviorSubject<boolean>(true);
  customerRefresh$ = this.customerRefreshSource.asObservable();

  // BehaviorSubject for operation form
  private operationForm: BehaviorSubject<FormGroup | null> = new BehaviorSubject<FormGroup | null>(null);

  // Set the duration in milliseconds as a constant
  readonly messageDisplayDuration  = 5 * 1 * 1000;
  
  // BehaviorSubject for add customer button visibility
  private isAddCustomerVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public isAddCustomerVisible$: Observable<boolean> = this.isAddCustomerVisibleSubject.asObservable();

  constructor(private snackBarService: SnackBarService) {   }

  /**
   * Sets the visibility of the add customer button.
   * @param isVisible Boolean value indicating whether the add customer button should be visible.
   */
  setAddCustomerVisibility(isVisible: boolean): void {
    this.isAddCustomerVisibleSubject.next(isVisible);
  }

  // Getters for observables of different message types
  get successMessage$() {
    return this.successMessageSubject.asObservable();
  }
  get warnMessage$() {
    return this.warnMessageSubject.asObservable();
  }
  get errorMessage$() {
    return this.errorMessageSubject.asObservable();
  }

  /**
   * Emits a refresh signal for customers.
   */
  emitRefresh(): void {
    this.customerRefreshSource.next(true);
  }

  /**
   * Returns the observable for a specific message type.
   * @param messageType The type of the message (success, warn, or error).
   * @returns An observable emitting messages of the specified type.
   */
  getMessageObservable(messageType: MessageType): Observable<string> {
    switch (messageType) {
      case MessageType.Success:
        return this.successMessage$;
      case MessageType.Warn:
        return this.warnMessage$;
      case MessageType.Error:
        return this.errorMessage$;
      default:
        throw new Error('Invalid message type');
    }
  }

  /**
   * Displays a message of a specific type.
   * @param message The message to display.
   * @param type The type of the message (success, warn, or error).
   * @param timeout Optional: The duration in milliseconds after which the message should disappear.
   */
  showMessage(message: string, type: MessageType, timeout: number = this.messageDisplayDuration) {
    switch (type) {
      case MessageType.Success:
        this.successMessageSubject.next(message);
        this.snackBarService.openSuccessSnackbar(message, timeout);
        break;
      case MessageType.Warn:
        this.warnMessageSubject.next(message);
        this.snackBarService.openWarnSnackbar(message, timeout);
        break;
      case MessageType.Error:
        this.errorMessageSubject.next(message);
        this.snackBarService.openErrorSnackbar(message, timeout);
        break;
    }
    this.scheduleClearMessage(type, timeout);
  }

  /**
   * Schedules clearing of a message after a specified timeout.
   * @param type The type of the message (success, warn, or error).
   * @param timeout The duration in milliseconds after which the message should be cleared.
   */
  private scheduleClearMessage(type: MessageType, timeout: number) {
    timer(timeout).subscribe(() => {
      switch (type) {
        case MessageType.Success:
          this.clearSuccessMessage();
          break;
        case MessageType.Warn:
          this.clearWarnMessage();
          break;
        case MessageType.Error:
          this.clearErrorMessage();
          break;
      }
    });
  }

  /**
   * Returns the observable for the operation form.
   * @returns An observable emitting the operation form.
   */
  getOperationFormObservable() {
    return this.operationForm.asObservable();
  }

  /**
   * Sets the operation form.
   * @param form The operation form to set.
   */
  setOperationForm(form: FormGroup | null) {
    this.operationForm.next(form);
  }

  // Clears messages (success, warn, and error).
  clearSuccessMessage() {
    this.successMessageSubject.next('');
  }
  clearWarnMessage() {
    this.warnMessageSubject.next('');
  }
  clearErrorMessage() {
    this.errorMessageSubject.next('');
  }
  clearAllMessages() {
    this.clearSuccessMessage();
    this.clearWarnMessage();
    this.clearErrorMessage();
  }

}
