import { buildGenderCondition } from './filters/buildGenderCondition';
import { buildSearchCondition } from './filters/buildSearchCondition';
import { Prisma, ScheduleAvailabilityType } from '@prisma/client';
import prisma from '../helper/PrismaClient';
import { buildBloodGroupCondition } from './filters/buildBloodGroupCondition';
import { buildDepartmentCondition } from './filters/buildDepartmentCondition';
import { buildScheduleCondition } from './filters/buildScheduleCondition';

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
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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
  const searchCondition = buildSearchCondition(search);
  // Gender condition
  const genderCondition = buildGenderCondition(gender);
  // BloodGroup condition
  const bloodGroupCondition = buildBloodGroupCondition(bloodGroup);
  // DepartmentName condition
  const departmentNameCondition = buildDepartmentCondition(departmentName);
  // Schedule condition: if empty, make undefined instead of {}
  const scheduleCondition = buildScheduleCondition(scheduleFilter);

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
