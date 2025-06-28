import { Request, Response } from "express";
import catchAsync from "../../helper/catchAsync";
import { AdminService } from "./admin.service";
import responseHandler from "../../helper/responseHandler";
import status from "http-status";

const createNewAdmin = catchAsync(async (req:Request, res:Response) => {
    const adminData = req.body;

    const newAdmin = await AdminService.createNewAdmin(adminData);

    console.log(newAdmin,"newAdmin");

    responseHandler(
        res,
        status.CREATED,
        true,
        "Admin created successfully",
        newAdmin
    );
});

export const AdminController = {
    createNewAdmin,
};