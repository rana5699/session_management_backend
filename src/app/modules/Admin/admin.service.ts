import status from 'http-status';
import AppError from '../../helper/AppError';
import prisma from '../../helper/PrismaClient';

const createNewAdmin = async (adminData: any) => {
  try {
    const { user, userProfile, professionalProfile, scheduleAvailability } = adminData;

    const existingUser = await prisma.user.findUnique({
      where: { userKey: user.userKey },
    });

    if (existingUser) {
      throw new AppError(status.CONFLICT, 'User with this userKey already exists');
    }

    // Create a new user
    const createdUser = await prisma.user.create({
      data: {
        ...user,
        role: 'ADMIN', // Set the role to ADMIN
      },
    });

    const createdUserProfile = await prisma.userProfile.create({
      data: {
        userId: createdUser.id,
        ...userProfile,
      },
    });

    const createdProfessionalProfile = await prisma.professionalProfile.create({
      data: {
        userProfileId: createdUserProfile.id, // এখানে userProfileId
        ...professionalProfile,
        departmentId: "f2b6259e-2990-4b3c-a918-2a9b7e5d3767",
        scheduleAvailability: scheduleAvailability?.length
          ? { create: scheduleAvailability }
          : undefined,
      },
      include: {
        scheduleAvailability: true,
      },
    });

    const createdAdmin = await prisma.admin.create({
      data: {
        userProfileId: createdUserProfile.id,

        professionalProfile: {
          connect: { id: createdProfessionalProfile.id },
        },
      },
    });

    console.log('✅ Admin and related profiles created successfully:', {
      user: createdUser,
      userProfile: createdUserProfile,
      professionalProfile: createdProfessionalProfile,
      admin: createdAdmin,
    });
    return createdUser;
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    throw new AppError(status.INTERNAL_SERVER_ERROR, 'Error creating admin');
  }
};

export const AdminService = {
  createNewAdmin,
};
