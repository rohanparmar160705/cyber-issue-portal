// Custom error class for API responses
export class ErrorHandler extends Error {
  statusCode: number;
  message: string;

  // Takes: statusCode (number), message (string)
  // Sets up custom error with status code and message
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    Object.setPrototypeOf(this, ErrorHandler.prototype); // fix prototype chain
  }
}

/*
  Purpose:

  - Standardizes error handling in the application
  - Allows throwing errors with HTTP status codes
  - Can be caught in controllers or middleware to send proper API responses
*/
