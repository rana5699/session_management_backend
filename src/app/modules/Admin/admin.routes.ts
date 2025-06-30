import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validRequest';
import { createAdminSchema } from './admin.validation';
import upload from '../../middlewares/upload';
import uploadAndParse from '../../middlewares/uploadAndParse';

const router = express.Router();

router.post(
  '/create-admin',
  upload.single('file'),
  uploadAndParse('admin', 'profilePicture', false),
  validateRequest(createAdminSchema),
  AdminController.createNewAdmin
);

export const AdminRoutes = router;
