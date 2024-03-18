import { AccountDto, CurrentAccountDto, SavingsAccountDto } from '../models/accountDto.model';

export class CommonMixin {

  /**
   * Checks if the given account is a current account.
   * @param account The account DTO to check.
   * @returns `true` if the account is a current account, otherwise `false`.
   */
  isCurrentAccount(account: AccountDto): account is CurrentAccountDto {
    return account.hasOwnProperty('overdraftLimit');
  }

  /**
   * Checks if the given account is a savings account.
   * @param account The account DTO to check.
   * @returns `true` if the account is a savings account, otherwise `false`.
   */
  isSavingsAccount(account: AccountDto): account is SavingsAccountDto {
    return account.hasOwnProperty('interestRate');
  }
}