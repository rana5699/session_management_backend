import express from 'express';
import { AdminController } from './admin.controller';

const router = express.Router();

router.post('/create-admin', AdminController.createNewAdmin);

export const AdminRoutes = router;
