import prisma from '../../helper/PrismaClient';
import { generateUserKey } from '../Shared/generateUserKey';
import { CounterType, UserRole } from '@prisma/client';
import { hashedPassword } from '../Shared/hashedPassword';
import config from '../../config';
import { createUser, createUserProfile } from '../Shared/baseCreateMethod';
import { AdminUpdateData } from '../Department/department.constant';
import {
  checkEmail,
  checkPhone,
  findExistingUserProfile,
  replaceScheduleAvailability,
  updateProfessionalDepartment,
  updateProfessionalProfile,
  updateUserData,
  updateUserProfileData,
  validateDepartment,
} from './helpers/update-admin-profile.service';
import queryUserProfiles, { IFilterOptions } from '../../queryBuilder/queryUserProfiles';

// create new admin
const createNewAdmin = async (adminData: any) => {
  try {
    const { user, userProfile, professionalProfile, scheduleAvailability, profilePicture } =
      adminData;

    await checkEmail(user.email);

    await checkPhone(user.phone);

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
// const getAllAdmins = async (filters: Partial<Parameters<typeof queryUserProfiles>[0]> = {}) => {
//   try {
//     const extendedFilters = {
//       ...filters,
//       allowedSortFields: ['createdAt', 'firstName', 'lastName', 'user.email', 'user.phone'],
//     };

//     console.log(extendedFilters, 'extendedFilters');

//     const results = await queryUserProfiles({
//       ...extendedFilters,
//       // Force include only active admin users
//       search: filters.search,
//       gender: filters.gender,
//       bloodGroup: filters.bloodGroup,
//       departmentName: filters.departmentName,
//       scheduleFilter: filters.scheduleFilter,
//       page: filters.page,
//       pageSize: filters.pageSize,
//       sortBy: filters.sortBy,
//       sortOrder: filters.sortOrder,
//       allowedSortFields: extendedFilters.allowedSortFields,
//     });

//     const filteredAdmins = results.filter(
//       (profile) =>
//         profile.user?.role === UserRole.ADMIN &&
//         profile.user?.isActive === true &&
//         profile.user?.isDeleted === false &&
//         profile.user?.isBlocked === false
//     );

//     // return await prisma.admin.findMany({
//     //   where: {
//     //     userProfile: {
//     //       user: {
//     //         isActive: true,
//     //         isDeleted: false,
//     //         isBlocked: false,
//     //         role: UserRole.ADMIN,
//     //       },
//     //     },
//     //   },
//     //   include: {
//     //     userProfile: {
//     //       include: {
//     //         user: true,
//     //       },
//     //     },
//     //     professionalProfile: {
//     //       include: {
//     //         department: {
//     //           select: {
//     //             name: true,
//     //             id: true,
//     //           },
//     //         },
//     //         scheduleAvailability: true,
//     //       },
//     //     },
//     //   },
//     //   orderBy: {
//     //     createdAt: 'desc',
//     //   },
//     // });

//     return filteredAdmins;
//   } catch (err) {
//     throw err;
//   }
// };

const getAllAdmins = async (filters: IFilterOptions) => {

  console.log(filters.scheduleFilter, 'filters');

  const results = await queryUserProfiles(filters);

  return results;
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
