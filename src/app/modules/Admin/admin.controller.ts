import { Request, Response } from 'express';
import catchAsync from '../../helper/catchAsync';
import { AdminService } from './admin.service';
import responseHandler from '../../helper/responseHandler';
import status from 'http-status';

// This controller handles the creation of new admins in the system.
const createNewAdmin = catchAsync(async (req: Request, res: Response) => {
  const adminData = req.body;

  const newAdmin = await AdminService.createNewAdmin(adminData);

  responseHandler(res, status.CREATED, true, 'Admin created successfully', null, newAdmin);
});

// This controller handles the get all admins.
const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const {
    search,
    gender,
    bloodGroup,
    departmentName,
    sortBy,
    sortOrder,
    page,
    pageSize,
    scheduleFilter,
  } = req.query;

  const filters = {
    search: search as string,
    gender: gender as string,
    bloodGroup: bloodGroup as string,
    departmentName: departmentName as string,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'asc' | 'desc',
    page: page ? parseInt(page as string) : 1,
    pageSize: pageSize ? parseInt(pageSize as string) : 10,
    scheduleFilter: scheduleFilter ? JSON.parse(scheduleFilter as string) : undefined,
    allowedSortFields: ['firstName', 'lastName', 'user.email', 'user.phone'], // define your allowed fields
  };

  const admins = await AdminService.getAllAdmins(filters);

  const meta = {
    page: admins.meta.page,
    pageSize: admins.meta.pageSize,
    totalRecords: admins.meta.totalRecords,
    totalPages: admins.meta.totalPages,
  };

  responseHandler(res, status.OK, true, 'Admins fetched successfully', meta, admins.data);
});

// This controller handles the update admin profile.
const updateAdminProfile = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.params.adminId;
  const adminData = req.body;

  const updatedAdmin = await AdminService.updateAdminProfile(adminId, adminData);

  responseHandler(res, status.OK, true, 'Admin profile updated successfully', null, updatedAdmin);
});

export const AdminController = {
  createNewAdmin,
  getAllAdmins,
  updateAdminProfile,
};
