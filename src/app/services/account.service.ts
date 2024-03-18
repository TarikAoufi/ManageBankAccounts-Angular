import { Injectable } from '@angular/core';
import { AccountDetails } from '../models/accountDetails.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountDto, CurrentAccountDto, SavingsAccountDto } from '../models/accountDto.model';
import { OperationDto } from '../models/operationDto.model';

/**
 * This service is responsible for managing account-related data and interactions with the server.
 */
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  // BehaviorSubject to store and notify subscribers about changes in accounts
  private accountsSubject: BehaviorSubject<AccountDto[]> = new BehaviorSubject<AccountDto[]>([]);
  public accounts$: Observable<AccountDto[]> = this.accountsSubject.asObservable();

  constructor(private http:HttpClient) { }

  /**
   * Sets the accounts data and notifies subscribers.
   * @param accounts An array of account DTOs.
   */
  setAccounts(accounts: AccountDto[]): void {
    this.accountsSubject.next(accounts);
  }

  /**
   * Retrieves account details from the server.
   * @param accountId The ID of the account to retrieve details for.
   * @param page The page number for pagination.
   * @param size The number of items per page for pagination.
   * @returns An observable of type `AccountDetails` representing the account details.
   */
  public getAccount(accountId:string, page:number, size:number):Observable<AccountDetails> {
    return  this.http.get<AccountDetails>(environment.host 
      + "/accounts/"+accountId+"/history?page="+page+"&size="+size);
  }

  /**
   * Retrieves account operations from the server.
   * @param accountId The ID of the account to retrieve operations for.
   * @returns An observable of type `OperationDto[]` representing the array of operation DTOs.
   */
  public getAccountOperations(accountId:string):Observable<Array<OperationDto>> {
    return this.http.get<OperationDto[]>(environment.host + "/accounts/" + accountId + "/operations");
  }

}
