/**
 * Represents an error response returned from an API.
 */
export interface ErrorResponse {
  /* The name of the field related to the error */
  fieldName?: string;  

  /* The status code of the error response. */
  statusCode: number;

  /* The main error message describing the issue. */
  message: string;

  /* List of error messages */
  errorMessages?: string[]; 
}