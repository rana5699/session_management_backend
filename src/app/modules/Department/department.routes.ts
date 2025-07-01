import express from 'express';
import { DepartmentController } from './department.controller';
import validateRequest from '../../middlewares/validRequest';
import { DepartmentValidation } from './department.validation';

const router = express.Router();

// Create department
router.post(
  '/create',
  validateRequest(DepartmentValidation.CreateDepartmentSchema),
  DepartmentController.createNewDepartment
);

// get all department
router.get('/all-departments', DepartmentController.getAllDepartments);

export const DepartmentRoutes = router;
