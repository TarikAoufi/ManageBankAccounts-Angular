import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OperationRequestDto } from '../models/OperationRequestDto.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

/**
 * This service is responsible for managing operations such as withdrawal, deposit, transfer, 
 * and deletion of operations.
 */
@Injectable({
  providedIn: 'root'
})
export class OperationService {

  constructor(private http:HttpClient) { }

  /**
   * Initiates a withdrawal operation on the server.
   * @param request The operation request DTO representing the withdrawal request.
   * @returns An observable of type `OperationRequestDto` representing the withdrawal operation request DTO.
   */
  public withdraw(request:OperationRequestDto): Observable<OperationRequestDto> {
    return this.http.post<OperationRequestDto>(environment.host+"/operations/withdraw", request);
  }

  /**
   * Initiates a deposit operation on the server.
   * @param request The operation request DTO representing the deposit request.
   * @returns An observable of type `OperationRequestDto` representing the deposit operation request DTO.
   */
  public deposit(request:OperationRequestDto): Observable<OperationRequestDto> {
    return this.http.post<OperationRequestDto>(environment.host+"/operations/deposit", request);
  }

  /**
   * Initiates a transfer operation on the server.
   * @param request The operation request DTO representing the transfer request.
   * @returns An observable representing the result of the transfer operation.
   */
  public transfer(request:OperationRequestDto): Observable<any> {
    return this.http.post(environment.host+"/operations/transfer", request);
  }

  /**
   * Deletes an operation from the server.
   * @param id The ID of the operation to delete.
   * @returns An observable representing the result of the delete operation.
   */
  public deleteOperation(id: any): Observable<any> {
    return this.http.delete(environment.host + "/operations/" + id, { observe: 'response', responseType: 'text' });
  }
  
}
