import { CustomerDto } from "./customerDto.model";

/**
 * Represents the basic structure of an account.
 */
export interface AccountDto {
    id: string;
    balance: number;
    createdOn: Date;
    status: string;
    modifiedOn: Date;
    accountType: string;
    customerDto: CustomerDto;
}

/**
 * Represents the structure of a current account.
 */
export interface CurrentAccountDto extends AccountDto {
    overdraftLimit: number;
}

/**
 * Represents the structure of a savings account.
 */
export interface SavingsAccountDto extends AccountDto {
    interestRate: number;
}
