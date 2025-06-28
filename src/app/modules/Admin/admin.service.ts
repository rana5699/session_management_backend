import status from 'http-status';
import AppError from '../../helper/AppError';
import prisma from '../../helper/PrismaClient';
import { generateUserKey } from '../Shared/generateUserKey';
import { CounterType } from '@prisma/client';
import { hashedPassword } from '../Shared/hashedPassword';
import config from '../../config';
import {
  createProfessionalProfile,
  createUser,
  createUserProfile,
} from '../Shared/baseCreateMethod';

const createNewAdmin = async (adminData: any) => {
  try {
    const { user, userProfile, professionalProfile, scheduleAvailability } = adminData;

    // Hash the password
    const modifyPassword = await hashedPassword(user.password || config.defaultPassword);

    // Generate unique userKey
    const userKey = await generateUserKey({
      userType: CounterType.PROFESSIONAL,
      deptCode: 'AD',
    });

    const result = await prisma.$transaction(async (tx) => {
      // Create a new user
      const createdUser = await createUser({
        user,
        userKey,
        password: modifyPassword,
        role: 'ADMIN',
        tx,
      });

      // Create a new user profile
      const createdUserProfile = await createUserProfile({
        userId: createdUser.id,
        userProfile,
        tx,
      });

      // Create a new professional profile
      const createdProfessionalProfile = await createProfessionalProfile({
        tx,
        userProfileId: createdUserProfile.id,
        professionalProfile,
        scheduleAvailability,
      });

      // Create a new admin
      const createdAdmin = await tx.admin.create({
        data: {
          userProfileId: createdUserProfile.id,

          professionalProfile: {
            connect: { id: createdProfessionalProfile.id },
          },
        },
      });

      //  exclude password from return
      const { password, ...safeUser } = createdUser;

      return {
        user: safeUser,
        userProfile: createdUserProfile,
        professionalProfile: createdProfessionalProfile,
        admin: createdAdmin,
      };
    });

    return result;
  } catch {
    throw new AppError(status.INTERNAL_SERVER_ERROR, 'Error creating admin');
  }
};

export const AdminService = {
  createNewAdmin,
};
