// src/services/UserService.ts

import { Prisma, PrismaClient, UserRole } from '@prisma/client';

export interface CreateUserInput {
  user: Prisma.UserCreateInput;
  userKey: string;
  password: string;
  role: UserRole;
  tx: PrismaClient | Prisma.TransactionClient;
}

// create user
export const createUser = async ({
  user,
  userKey,
  password,
  role = 'PATIENT',
  tx,
}: CreateUserInput) => {
  const createdUser = await tx.user.create({
    data: {
      ...user,
      userKey,
      password,
      role,
    },
  });

  return createdUser;
};

// create user profile
export const createUserProfile = async ({
  userId,
  userProfile,
  tx,
}: {
  userId: string;
  userProfile: Prisma.UserProfileCreateInput;
  tx: PrismaClient | Prisma.TransactionClient;
}) => {
  const createdUserProfile = await tx.userProfile.create({
    data: {
      ...userProfile,
      user: { connect: { id: userId } },
    },
  });

  return createdUserProfile;
};

// create professional profile

interface CreateProfessionalProfileInput {
  tx: PrismaClient | Prisma.TransactionClient;
  userProfileId: string;
  professionalProfile: Prisma.ProfessionalProfileUncheckedCreateInput;
  scheduleAvailability?: Prisma.ScheduleAvailabilityCreateInput[];
}
export const createProfessionalProfile = async ({
  tx,
  userProfileId,
  professionalProfile,
  scheduleAvailability,
}: CreateProfessionalProfileInput) => {
  const createdProfessionalProfile = await tx.professionalProfile.create({
    data: {
      ...professionalProfile,
      userProfileId,
      departmentId: professionalProfile.departmentId,
      scheduleAvailability: scheduleAvailability?.length
        ? { create: scheduleAvailability }
        : undefined,
    },
    include: {
      scheduleAvailability: true,
    },
  });

  return createdProfessionalProfile;
};
