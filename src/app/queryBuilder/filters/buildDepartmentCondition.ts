import { DepartmentType, Prisma } from '@prisma/client';

export const buildDepartmentCondition = (
  department?: string
): Prisma.UserProfileWhereInput | undefined => {
  return department
    ? {
        professional: {
          is: {
            department: {
              name: department as DepartmentType,
            },
          },
        },
      }
    : undefined;
};
