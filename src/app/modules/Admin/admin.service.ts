import status from "http-status";
import AppError from "../../helper/AppError";

const createNewAdmin = async (adminData: any) => {
  try {
    
  } catch (error) {
   throw new AppError(status.INTERNAL_SERVER_ERROR, "Error creating admin");
  }
};

export const AdminService = {
  createNewAdmin,
};
