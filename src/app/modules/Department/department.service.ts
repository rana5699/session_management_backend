import status from 'http-status';
import AppError from '../../helper/AppError';
import prisma from '../../helper/PrismaClient';
import { Department } from '@prisma/client';

//creation of new departments in the system.
const createNewDepartment = async (departmentData: Department) => {
  try {
    const existingDepartment = await prisma.department.findUnique({
      where: { name: departmentData.name },
    });

    if (existingDepartment) {
      throw new AppError(status.CONFLICT, 'Department name already exists');
    }

    const newDepartment = await prisma.department.create({
      data: departmentData,
    });

    if (!newDepartment) {
      throw new AppError(status.INTERNAL_SERVER_ERROR, 'Failed to create department');
    }

    return newDepartment;
  } catch {
    throw new AppError(status.INTERNAL_SERVER_ERROR, 'Error creating department');
  }
};

// get all departments .
const getAllDepartments = async () => {
  try {
    return await prisma.department.findMany();
  } catch (err) {
    throw err;
  }
};


export const DepartmentService = {
  createNewDepartment,
  getAllDepartments,
};
