import { Request, Response } from 'express';
import catchAsync from '../../helper/catchAsync';
import { AdminService } from './admin.service';
import responseHandler from '../../helper/responseHandler';
import status from 'http-status';

// This controller handles the creation of new admins in the system.
const createNewAdmin = catchAsync(async (req: Request, res: Response) => {
  const adminData = req.body;

  const newAdmin = await AdminService.createNewAdmin(adminData);

  responseHandler(res, status.CREATED, true, 'Admin created successfully', newAdmin);
});

// This controller handles the get all admins.
const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const admins = await AdminService.getAllAdmins();

  responseHandler(res, status.OK, true, 'Admins fetched successfully', admins);
});

// This controller handles the update admin profile.
const updateAdminProfile = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.params.adminId;
  const adminData = req.body;

  const updatedAdmin = await AdminService.updateAdminProfile(adminId, adminData);

  responseHandler(res, status.OK, true, 'Admin profile updated successfully', updatedAdmin);
});

export const AdminController = {
  createNewAdmin,
  getAllAdmins,
  updateAdminProfile,
};
