import status from 'http-status';
import AppError from '../../helper/AppError';
import prisma from '../../helper/PrismaClient';
import { generateUserKey } from '../Shared/generateUserKey';
import { CounterType } from '@prisma/client';
import { hashedPassword } from '../Shared/hashedPassword';
import config from '../../config';
import { createUser, createUserProfile } from '../Shared/baseCreateMethod';

const createNewAdmin = async (adminData: any) => {
  try {
    const { user, userProfile, professionalProfile, scheduleAvailability, profilePicture } =
      adminData;

    // ✅ Step 1: Hash password outside transaction
    const modifyPassword = await hashedPassword(user.password || config.defaultPassword);

    // ✅ Step 2: Run transaction for atomic user creation
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

    // ✅ Step 3: Create scheduleAvailability outside transaction
    if (scheduleAvailability?.length) {
      await prisma.scheduleAvailability.createMany({
        data: scheduleAvailability.map((item: any) => ({
          ...item,
          professionalId: result.professionalProfile.id,
        })),
      });
    }

    // ✅ Step 4: Remove sensitive info before returning
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

export const AdminService = {
  createNewAdmin,
};
