import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

/**
 * This service is responsible for displaying snack bar notifications 
 * with different styles (success, warning, error)
 */
@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) { }
  
  /**
   * Opens a snack bar with the specified message, action, timeout, and panel class.
   * @param message The message to display in the snack bar.
   * @param action The action text for the snack bar.
   * @param timeout The duration in milliseconds for the snack bar to be visible.
   * @param panelClass An optional array of CSS classes to apply to the snack bar panel.
   */
  openSnackbar(message: string, action: string, timeout: number, panelClass: string[] = []) {
    const snackBarConfig: MatSnackBarConfig = {
      duration: timeout,
      panelClass: ['custom-snackbar', 'line-break', ...panelClass]
    };

    this.snackBar.open(message, action, snackBarConfig);
  }

  /**
   * Opens a success snack bar with the specified message and timeout.
   * @param message The success message to display.
   * @param timeout The duration in milliseconds for the snack bar to be visible.
   */
  openSuccessSnackbar(message: string, timeout: number) {
    this.openSnackbar(message, 'Success', timeout, ['custom-snackbar-success']);
  }

  /**
   * Opens a warning snack bar with the specified message and timeout.
   * @param message The warning message to display.
   * @param timeout The duration in milliseconds for the snack bar to be visible.
   */
  openWarnSnackbar(message: string, timeout: number) {
    this.openSnackbar(message, 'Warning', timeout, ['custom-snackbar-warning']);
  }

  /**
   * Opens an error snack bar with the specified message and timeout.
   * @param message The error message to display.
   * @param timeout The duration in milliseconds for the snack bar to be visible.
   */
  openErrorSnackbar(message: string, timeout: number) {
    this.openSnackbar(message, 'Error', timeout, ['custom-snackbar-error']);
  }
  
}
