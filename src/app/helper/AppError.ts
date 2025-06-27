class AppError extends Error {
  public statusCode: number;
  public errorDetails?: any;

  constructor(statusCode: number, message: string, errorDetails?: any, stack?: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Generate a structured error response
  toResponse() {
    return {
      success: false,
      message: this.message,
      statusCode: this.statusCode,
      error: this.errorDetails || null,
      stack: this.stack || null,
    };
  }
}

export default AppError;
