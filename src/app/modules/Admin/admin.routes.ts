import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validRequest';
import { createAdminSchema } from './admin.validation';
import upload from '../../middlewares/upload';
import uploadAndParse from '../../middlewares/uploadAndParse';

const router = express.Router();



// update admin profile
router.put(
  '/update-admin/:adminId',
  upload.single('file'),
  uploadAndParse('admin', 'profilePicture', false),
  AdminController.updateAdminProfile
);

// create admin
router.post(
  '/create-admin',
  upload.single('file'),
  uploadAndParse('admin', 'profilePicture', false),
  validateRequest(createAdminSchema),
  AdminController.createNewAdmin
);

// get all admin
router.get('/all-admins', AdminController.getAllAdmins);


export const AdminRoutes = router;
