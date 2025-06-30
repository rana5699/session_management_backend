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

//  Handle Prisma validation errors (e.g., field too long, enum mismatch)
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
  if (err.code === 'P2002') {
    const field = err?.meta?.target?.[0] || 'field';
    return {
      statusCode: status.CONFLICT,
      message: 'Duplicate Error. Same Unique data already exist.',
      errors: [
        {
          path: field,
          message: `The ${field} already exists. Please use a different one.`,
        },
      ],
    };
  }
};
