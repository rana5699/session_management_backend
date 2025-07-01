// src/services/UserService.ts

import { Prisma, PrismaClient, UserRole } from '@prisma/client';
import prisma from '../../helper/PrismaClient';

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
  role,
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
  // Step 1: Create `professionalProfile` inside transaction without scheduleAvailability
  const createdProfessionalProfile = await tx.professionalProfile.create({
    data: {
      ...professionalProfile,
      userProfileId,
      departmentId: professionalProfile.departmentId,
    },
  });

  // Step 2: Outside transaction, bulk create `scheduleAvailability`
  const schedule = scheduleAvailability?.length
    ? await prisma.scheduleAvailability.findMany({
        where: { professionalId: createdProfessionalProfile.id },
      })
    : [];

  return {
    ...createdProfessionalProfile,
    scheduleAvailability: schedule,
  };
};
