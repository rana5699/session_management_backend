import { Gender, Prisma } from '@prisma/client';

export const buildGenderCondition = (gender?: string): Prisma.UserProfileWhereInput | undefined => {
  return gender
    ? {
        gender: gender as Gender,
      }
    : undefined;
};
