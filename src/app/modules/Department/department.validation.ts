import { z } from 'zod';
import { DepartmentType } from '@prisma/client';

export const CreateDepartmentSchema = z.object({
  name: z.nativeEnum(DepartmentType, {
    errorMap: () => ({ message: 'Invalid department name.' }),
  }),
  description: z.string().optional(),
});

export const DepartmentValidation = {
  CreateDepartmentSchema,
};
