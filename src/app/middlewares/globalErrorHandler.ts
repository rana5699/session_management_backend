import { NextFunction, Request, Response } from 'express';
import status from 'http-status';

// Custom error interface (optional, extend as needed)
interface IError extends Error {
  statusCode?: number; // custom status code for error
  errors?: object; // optional detailed error info
}

// Global error handler middleware
const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  const error = err as IError;

  // Use error.statusCode if set, otherwise INTERNAL_SERVER_ERROR
  const statusCode = error.statusCode || status.INTERNAL_SERVER_ERROR;

  // Prepare response payload
  const response = {
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      errors: error.errors || null,
    }),
  };

  res.status(statusCode).json(response);
};

export default globalErrorHandler;
