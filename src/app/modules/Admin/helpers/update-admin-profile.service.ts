import status from 'http-status';
import { ProfessionalProfile, ScheduleAvailability, User, UserProfile } from '@prisma/client';
import prisma from '../../../helper/PrismaClient';
import AppError from '../../../helper/AppError';

export const findExistingUserProfile = async (adminId: string) => {
  const profile = await prisma.userProfile.findUnique({
    where: { id: adminId },
    include: {
      user: true,
      professional: {
        include: {
          department: { select: { name: true, id: true } },
          scheduleAvailability: true,
        },
      },
    },
  });

  if (!profile) {
    throw new AppError(status.NOT_FOUND, 'Admin not found');
  }

  return profile;
};

export const validateDepartment = async (departmentId?: string) => {
  if (!departmentId) return;

  const department = await prisma.department.findUnique({
    where: { id: departmentId },
  });

  if (!department) {
    throw new AppError(status.NOT_FOUND, 'Department not found');
  }
};

export const updateUserProfileData = async (
  userProfileId: string,
  userProfile?: Partial<UserProfile>,
  profilePicture?: string
) => {
  return prisma.userProfile.update({
    where: { id: userProfileId },
    data: {
      ...userProfile,
      ...(profilePicture !== undefined && profilePicture !== null ? { profilePicture } : {}),
    },
  });
};

export const updateUserData = async (existingUser: User, user?: Partial<User>) => {
  if (!user) return existingUser;

  if (user.email && user.email !== existingUser.email) {
    const emailExists = await prisma.user.findFirst({
      where: {
        email: user.email,
        NOT: { id: existingUser.id },
      },
    });

    if (emailExists) {
      throw new AppError(status.CONFLICT, 'Email already exists');
    }
  }

  return prisma.user.update({
    where: { id: existingUser.id },
    data: user,
  });
};

export const updateProfessionalProfile = async (
  professionalId: string | undefined,
  professionalProfile?: Partial<ProfessionalProfile>
) => {
  if (!professionalId || !professionalProfile) return null;

  return prisma.professionalProfile.update({
    where: { id: professionalId },
    data: professionalProfile,
  });
};

export const updateProfessionalDepartment = async (
  currentDeptId: string | undefined,
  newDeptId?: string
) => {
  if (!currentDeptId || !newDeptId) return null;

  return prisma.department.update({
    where: { id: currentDeptId },
    data: { id: newDeptId },
  });
};

export const replaceScheduleAvailability = async (
  oldProfessionalId: string | undefined,
  newProfessionalId: string | undefined,
  availability: ScheduleAvailability[]
) => {
  if (!oldProfessionalId || !newProfessionalId) return;

  await prisma.scheduleAvailability.deleteMany({
    where: { professionalId: oldProfessionalId },
  });

  await prisma.scheduleAvailability.createMany({
    data: availability.map((item) => ({
      ...item,
      professionalId: newProfessionalId,
    })),
  });
};

// export default {
//   findExistingUserProfile,
//   validateDepartment,
//   updateUserProfileData,
//   updateUserData,
//   updateProfessionalProfile,
//   updateProfessionalDepartment,
//   replaceScheduleAvailability,
// };
