import { Prisma } from '@prisma/client';

export const buildSearchCondition = (search?: string): Prisma.UserProfileWhereInput | undefined => {
  return search
    ? {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { user: { phone: { contains: search, mode: 'insensitive' } } },
        ],
      }
    : undefined;
};
