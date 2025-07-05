import { BloodGroup, Prisma } from '@prisma/client';

export const buildBloodGroupCondition = (
  bloodGroup?: string
): Prisma.UserProfileWhereInput | undefined => {
  return bloodGroup ? { bloodGroup: bloodGroup as BloodGroup } : undefined;
};
