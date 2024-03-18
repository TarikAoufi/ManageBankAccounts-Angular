import { OperationType } from "./operation-type.enum";

/**
 * Represents the details of an operation.
 */
export interface OperationDto {
    id:            number;
    amount:        number;
    operationType: OperationType;
    operationDate: Date;
    description:   string;
}