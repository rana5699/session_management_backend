import { Request, Response } from 'express';
import catchAsync from '../../helper/catchAsync';
import { DepartmentService } from './department.service';
import responseHandler from '../../helper/responseHandler';
import status from 'http-status';

// This controller handles the creation of new departments in the system.
const createNewDepartment = catchAsync(async (req: Request, res: Response) => {
  const departmentData = req.body;
  const newDepartment = await DepartmentService.createNewDepartment(departmentData);

  responseHandler(res, status.CREATED, true, 'Department created successfully', newDepartment);
});

// This controller handles the get all departments.
const getAllDepartments = catchAsync(async (req: Request, res: Response) => {
  const departments = await DepartmentService.getAllDepartments();

  responseHandler(res, status.OK, true, 'Departments fetched successfully', departments);
});

export const DepartmentController = {
  createNewDepartment,
  getAllDepartments,
};
