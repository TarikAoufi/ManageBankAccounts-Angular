import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrl: './alert-message.component.css'
})
export class AlertMessageComponent {

  // Input properties for receiving messages and error responses
  @Input() errorMessage!: string;
  @Input() successMessage!: string;
  @Input() warnMessage!: string;
  @Input() errorResponseJson!: string;
  @Input() errorResponse!: any;

  // Event emitter for closing the alert
  @Output() closeAlert = new EventEmitter<void>();

  /**
   * Emits an event to close the alert.
   */
  onClose(): void {
    this.closeAlert.emit();  
  }

  /**
   * Retrieves the appropriate message based on the provided inputs.
   * @returns The message to display.
   */
  getMessage(): string {
    if (this.errorResponseJson) {
      const errorResponse = JSON.parse(this.errorResponseJson);
      if (errorResponse && errorResponse.invalidParams) {
        return errorResponse.invalidParams.map((param: { cause: string }) => param.cause).join('\n');
      } else if (errorResponse && errorResponse.message) {
        return errorResponse.message; 
      }
    }
  
    if (this.errorMessage) {
      return this.errorMessage;
    } else if (this.warnMessage) {
      return this.warnMessage;
    } else if (this.successMessage) {
      return this.successMessage;
    }
  
    return ''; // Returns an empty string if no message is found
  }
  
  /**
   * Retrieves the CSS class for styling the alert based on the provided inputs.
   * @returns The CSS class.
   */
  getCssClass(): string {
    if (this.errorMessage || this.errorResponseJson) {
      return 'alert-danger';
    } else if (this.warnMessage) {
      return 'alert-warning';
    } else if (this.successMessage) {
      return 'alert-success';
    } else {
      return '';
    }
  }
  
  /**
   * Retrieves the icon class based on the type of message.
   * @returns The icon class.
   */
  getIconClass(): string {
    if (this.errorResponseJson) {
      return 'bi-exclamation-octagon-fill';
    } else if (this.warnMessage) {
      return 'bi-exclamation-triangle-fill';
    } else {
      return 'bi-check-circle-fill';
    }
  }

}
