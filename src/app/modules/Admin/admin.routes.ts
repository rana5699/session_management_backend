import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validRequest';
import { createAdminSchema } from './admin.validation';

const router = express.Router();

router.post('/create-admin', validateRequest(createAdminSchema), AdminController.createNewAdmin);

export const AdminRoutes = router;
