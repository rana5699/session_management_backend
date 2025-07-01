import { BloodGroup, Gender, Prisma, ScheduleAvailabilityType } from '@prisma/client';
import prisma from '../helper/PrismaClient';

export interface IFilterOptions {
  search?: string;
  gender?: string;
  bloodGroup?: string;
  departmentName?: string;
  scheduleFilter?: {
    type?: ScheduleAvailabilityType;
    dayOfWeek?: number;
    specificDate?: Date;
    fromDate?: Date;
    toDate?: Date;
    dayOfMonth?: number;
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
  };
  page?: number;
  pageSize?: number;
  sortBy?: string; // উদাহরণ: "firstName", "createdAt", "user.email"
  sortOrder?: 'asc' | 'desc'; // "asc" or "desc"
  allowedSortFields: string[];
}

const queryUserProfiles = async (filters: IFilterOptions) => {
  const {
    search,
    gender,
    bloodGroup,
    departmentName,
    scheduleFilter,
    page = 1,
    pageSize = 10,
    sortBy = 'firstName',
    sortOrder = 'asc',
    allowedSortFields = [],
  } = filters;

  // Search condition
  const searchCondition: Prisma.UserProfileWhereInput | undefined = search
    ? {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { user: { phone: { contains: search, mode: 'insensitive' } } },
        ],
      }
    : undefined;

  // Gender condition
  const genderCondition: Prisma.UserProfileWhereInput | undefined = gender
    ? { gender: gender as Gender }
    : undefined;

  // BloodGroup condition
  const bloodGroupCondition: Prisma.UserProfileWhereInput | undefined = bloodGroup
    ? { bloodGroup: bloodGroup as BloodGroup }
    : undefined;

  // DepartmentName condition
  const departmentNameCondition: Prisma.UserProfileWhereInput | undefined = departmentName
    ? {
        professional: {
          is: {
            department: {
              name: departmentName as Prisma.EnumDepartmentTypeFilter,
            },
          },
        },
      }
    : undefined;

  // Schedule condition: if empty, make undefined instead of {}
  const scheduleCondition: Prisma.UserProfileWhereInput | undefined = scheduleFilter
    ? {
        professional: {
          scheduleAvailability: {
            some: {
              ...(scheduleFilter.type && { type: scheduleFilter.type }),
              ...(scheduleFilter.dayOfWeek !== undefined && { dayOfWeek: scheduleFilter.dayOfWeek }),
              ...(scheduleFilter.specificDate && { specificDate: scheduleFilter.specificDate }),
              ...(scheduleFilter.fromDate && { fromDate: { gte: scheduleFilter.fromDate } }),
              ...(scheduleFilter.toDate && { toDate: { lte: scheduleFilter.toDate } }),
              ...(scheduleFilter.dayOfMonth && { dayOfMonth: scheduleFilter.dayOfMonth }),
              ...(scheduleFilter.startTime && { startTime: scheduleFilter.startTime }),
              ...(scheduleFilter.endTime && { endTime: scheduleFilter.endTime }),
              ...(scheduleFilter.isAvailable !== undefined && { isAvailable: scheduleFilter.isAvailable }),
            },
          },
        },
      }
    : undefined;

  // Collect all conditions; only add if defined and not empty object
  const andConditions: Prisma.UserProfileWhereInput[] = [];

  if (searchCondition) andConditions.push(searchCondition);
  if (genderCondition) andConditions.push(genderCondition);
  if (bloodGroupCondition) andConditions.push(bloodGroupCondition);
  if (departmentNameCondition) andConditions.push(departmentNameCondition);
  if (scheduleCondition) andConditions.push(scheduleCondition);

  const whereCondition: Prisma.UserProfileWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Count total matching records
  const totalRecords = await prisma.userProfile.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(totalRecords / pageSize);

  // Validate sort field
  const isValidSortField = allowedSortFields.includes(sortBy || '');
  const finalSortBy = isValidSortField ? sortBy! : 'firstName';
  const finalSortOrder = sortOrder || 'asc';

  // Prepare orderBy object for nested fields
  let orderBy: any;
  if (finalSortBy === 'user.email') {
    orderBy = { user: { email: finalSortOrder } };
  } else if (finalSortBy === 'user.phone') {
    orderBy = { user: { phone: finalSortOrder } };
  } else {
    orderBy = { [finalSortBy]: finalSortOrder };
  }

  const results = await prisma.userProfile.findMany({
    where: whereCondition,
    include: {
      user: true,
      professional: {
        include: {
          department: true,
          scheduleAvailability: true,
        },
      },
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy,
  });

  return {
    data: results,
    meta: {
      page,
      pageSize,
      totalPages,
      totalRecords,
    },
  };
};

export default queryUserProfiles;
