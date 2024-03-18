import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AlertService } from './utils/alert.service';
import { AccountDto } from '../models/accountDto.model';
import { OperationDto } from '../models/operationDto.model';
import { CustomerDto } from '../models/customerDto.model';

/**
 * This service is responsible for managing customer-related data and interactions with the server.
 */
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient, private alertService:AlertService) { }

  /**
   * Retrieves all customers from the server.
   * @returns An observable of type `CustomerDto[]` representing the array of customer DTOs.
   */
  public getAllCustomer(): Observable<Array<CustomerDto>> {
    return this.http.get<Array<CustomerDto>>(environment.host + "/customers");
  }

  /**
   * Retrieves a customer by ID from the server.
   * @param id The ID of the customer to retrieve.
   * @returns An observable of type `CustomerDto` representing the customer DTO.
   */
  getCustomerById(id: number): Observable<CustomerDto> {
    return this.http.get<CustomerDto>(environment.host + "/customers/" + id);
  }

  /**
   * Retrieves accounts associated with a customer from the server.
   * @param customerId The ID of the customer to retrieve accounts for.
   * @returns An observable of type `AccountDto[]` representing the array of account DTOs.
   */
  getAccountsByCustomerId(customerId: number): Observable<Array<AccountDto>> {
    return this.http.get<AccountDto[]>(environment.host + "/customers/" + customerId + "/accounts");
  }

  /**
   * Creates a new customer on the server.
   * @param customer The customer DTO representing the customer to create.
   * @returns An observable of type `CustomerDto` representing the created customer DTO.
   */
  public createCustomer(customer: CustomerDto): Observable<CustomerDto> {
    return this.http.post<CustomerDto>(environment.host + "/customers", customer);
  }

  /**
   * Updates an existing customer on the server.
   * @param id The ID of the customer to update.
   * @param customer The updated customer DTO.
   * @returns An observable representing the result of the update operation.
   */
  public updateCustomer(id: number, customer: CustomerDto): Observable<any> {
    return this.http.put(environment.host + "/customers/" + id, customer);
  }

  /**
   * Deletes a customer from the server.
   * @param id The ID of the customer to delete.
   * @returns An observable representing the result of the delete operation.
   */
  public deleteCustomer(id: any): Observable<any> {
    return this.http.delete(environment.host + "/customers/" + id, { observe: 'response', responseType: 'text' });
  }
  
  /**
   * Searches for customers based on a keyword.
   * @param keyword The keyword to search for.
   * @returns An observable of type `CustomerDto[]` representing the array of matching customer DTOs.
   */
  public searchCustomers(keyword : string):Observable<Array<CustomerDto>> {
    return this.http.get<Array<CustomerDto>>(environment.host + "/customers/search2?keyword="+keyword);
  }

  /**
   * Retrieves operations associated with a customer from the server.
   * @param customerId The ID of the customer to retrieve operations for.
   * @returns An observable of type `OperationDto[]` representing the array of operation DTOs.
   */
  public getCustomerOperations(customerId:number):Observable<Array<OperationDto>> {
    return this.http.get<OperationDto[]>(environment.host + "/customers/" + customerId + "/operations");
  }

}
