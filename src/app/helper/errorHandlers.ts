import { Prisma } from '@prisma/client';
import status from 'http-status';
import { ZodError } from 'zod';

// handle zod  validation eror
export const handleZodValidationError = (err: ZodError) => {
  return {
    statusCode: status.BAD_REQUEST,
    message: 'Validation failed',
    error: err.errors.map((error) => ({
      path: error.path.join('.'),
      message: error.message,
    })),
  };
};

// Handle Prisma validation errors
// ✅ Handle Prisma validation errors (e.g., field too long, enum mismatch)
export const handlePrismaValidationError = (err: Prisma.PrismaClientKnownRequestError) => {
  return {
    statusCode: status.BAD_REQUEST,
    message: 'Prisma validation failed',
    errors: [
      {
        path: err.meta?.target?.toString() || 'unknown',
        message: err.message,
      },
    ],
  };
};

/// Handle duplicate key (e.g., unique field conflict)
export const handleDuplicateError = (err: any) => {
  const field = err?.meta?.target?.[0] || "unknown";
  return {
    statusCode: status.CONFLICT,
    message: "Duplicate Key Error",
    errors: [
      {
        path: field,
        message: `The value for "${field}" already exists. Please provide a unique value.`,
      },
    ],
  };
};
