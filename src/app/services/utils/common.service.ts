import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  /**
   * Formats a date to a localized string.
   * @param date The date to be formatted.
   * @returns A string representing the formatted date, or an empty string if the input date is undefined.
   */
  formatDate(date: Date | undefined): string {
    return date ? new Date(date).toLocaleDateString() : '';
  }

  /**
   * Truncates a string if it exceeds a specified limit.
   * @param value The string to be transformed.
   * @param limit The character limit to truncate the string.
   * @returns The transformed string, truncated to the specified limit followed 
   *          by '..' if the string length exceeds the limit.
   */
  transform(value: string, limit: number): string {
    if (value.length > limit) {
      return value.substring(0, limit) + '..';
    }
    return value;
  }

}
