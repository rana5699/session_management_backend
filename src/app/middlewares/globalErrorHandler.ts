import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

import AppError from "../helper/AppError"; 
import { handlePrismaValidationError, handleZodValidationError } from "../helper/errorHandlers";

interface IError extends Error {
  statusCode?: number;
  errors?: object;
}

const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formatted = handleZodValidationError(err);
    return res.status(formatted.statusCode).json({
      success: false,
      message: formatted.message,
      errors: formatted.error,
    });
  }

  // Handle Prisma validation errors (e.g., P2002 duplicate, enum error)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const formatted = handlePrismaValidationError(err);
    return res.status(formatted.statusCode).json({
      success: false,
      message: formatted.message,
      errors: formatted.errors,
    });
  }

  // Handle custom AppError if used
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errorDetails || null,
    });
  }

  // Default fallback for unknown errors
  const error = err as IError;
  const statusCode = error.statusCode || status.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
    errors: error.errors || null,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

export default globalErrorHandler;
