import { AccountDto } from "./accountDto.model";
import { OperationDto } from "./operationDto.model";

/**
 * Represents details of an account, including its associated data.
 */
export interface AccountDetails {
    accountDto:    AccountDto;
    currentPage:   number;
    totalPage:     number;
    pageSize:      number;
    operationDtos: OperationDto[];
}