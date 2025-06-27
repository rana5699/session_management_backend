import express from 'express';
import { DepartmentController } from './department.controller';
import validateRequest from '../../middlewares/validRequest';
import { DepartmentValidation } from './department.validation';

const router = express.Router();

router.post(
  '/create',
  validateRequest(DepartmentValidation.CreateDepartmentSchema),
  DepartmentController.createNewDepartment
);

export const DepartmentRoutes = router;
