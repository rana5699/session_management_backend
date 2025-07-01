import prisma from '../../helper/PrismaClient';
import { generateUserKey } from '../Shared/generateUserKey';
import { CounterType, Department } from '@prisma/client';
import { hashedPassword } from '../Shared/hashedPassword';
import config from '../../config';
import { createUser, createUserProfile } from '../Shared/baseCreateMethod';
import AppError from '../../helper/AppError';
import status from 'http-status';
import { AdminUpdateData, CreateAdminInput } from '../Department/department.constant';
import {
  findExistingUserProfile,
  replaceScheduleAvailability,
  updateProfessionalDepartment,
  updateProfessionalProfile,
  updateUserData,
  updateUserProfileData,
  validateDepartment,
} from './helpers/update-admin-profile.service';

// create new admin
const createNewAdmin = async (adminData: any) => {
  try {
    const { user, userProfile, professionalProfile, scheduleAvailability, profilePicture } =
      adminData;

    // Hash password outside transaction
    const modifyPassword = await hashedPassword(user.password ?? config.defaultPassword);

    // Run transaction for atomic user creation
    const result = await prisma.$transaction(
      async (tx) => {
        const userKey = await generateUserKey(tx, {
          userType: CounterType.PROFESSIONAL,
          deptCode: 'AD',
        });

        const createdUser = await createUser({
          user,
          userKey,
          password: modifyPassword,
          role: 'ADMIN',
          tx,
        });

        const createdUserProfile = await createUserProfile({
          userId: createdUser.id,
          userProfile: {
            ...userProfile,
            profilePicture,
          },
          tx,
        });

        const createdProfessionalProfile = await tx.professionalProfile.create({
          data: {
            ...professionalProfile,
            userProfileId: createdUserProfile.id,
            departmentId: professionalProfile.departmentId,
          },
        });

        const createdAdmin = await tx.admin.create({
          data: {
            userProfileId: createdUserProfile.id,
            professionalProfile: {
              connect: { id: createdProfessionalProfile.id },
            },
          },
        });

        return {
          user: createdUser,
          userProfile: createdUserProfile,
          professionalProfile: createdProfessionalProfile,
          admin: createdAdmin,
        };
      },
      {
        timeout: 15000,
        maxWait: 10000,
      }
    );

    // Create scheduleAvailability outside transaction
    if (scheduleAvailability?.length) {
      await prisma.scheduleAvailability.createMany({
        data: scheduleAvailability.map((item: any) => ({
          ...item,
          professionalId: result.professionalProfile.id,
        })),
      });
    }

    //  Remove sensitive info before returning
    const { password, ...safeUser } = result.user;

    return {
      user: safeUser,
      userProfile: result.userProfile,
      professionalProfile: result.professionalProfile,
      admin: result.admin,
    };
  } catch (err) {
    throw err;
  }
};

// get all admins
const getAllAdmins = async () => {
  try {
    return await prisma.admin.findMany({
      include: {
        userProfile: {
          include: {
            user: true,
          },
        },
        professionalProfile: {
          include: {
            department: {
              select: {
                name: true,
                id: true,
              },
            },
            scheduleAvailability: true,
          },
        },
      },
    });
  } catch (err) {
    throw err;
  }
};

// update admin profile
const updateAdminProfile = async (adminId: string, adminData: AdminUpdateData) => {
  try {
    const { user, userProfile, professionalProfile, profilePicture, scheduleAvailability } =
      adminData;

    const existingUserProfile = await findExistingUserProfile(adminId);

    await validateDepartment(professionalProfile?.departmentId);

    const updatedUserProfile = await updateUserProfileData(
      existingUserProfile.id,
      userProfile,
      profilePicture
    );

    const updatedUser = await updateUserData(existingUserProfile.user, user);

    const updatedProfessionalProfile = await updateProfessionalProfile(
      existingUserProfile.professional?.id,
      professionalProfile
    );

    await updateProfessionalDepartment(
      existingUserProfile.professional?.departmentId,
      professionalProfile?.departmentId
    );

    if (scheduleAvailability?.length) {
      await replaceScheduleAvailability(
        existingUserProfile.professional?.id,
        updatedProfessionalProfile?.id,
        scheduleAvailability
      );
    }

    const { password, ...safeUser } = updatedUser;

    return {
      userProfile: updatedUserProfile,
      user: safeUser,
      professionalProfile: updatedProfessionalProfile,
    };
  } catch (err) {
    throw err;
  }
};

export const AdminService = {
  createNewAdmin,
  getAllAdmins,
  updateAdminProfile,
};
