import { OperationType } from "./operation-type.enum";

/**
 * Represents the details of an operation request.
 */
export interface OperationRequestDto {
    accountId: string;
    sourceAccountId:string;
    targetAccountId:string;
    amount:number;
    operationType:OperationType;
}