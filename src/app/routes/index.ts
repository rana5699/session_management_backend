import express from 'express';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { PatientRoutes } from '../modules/Patient/patient.routes';
import { AdminRoutes } from '../modules/Admin/admin.routes';
import { DepartmentRoutes } from '../modules/Department/department.routes';

const routers = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/patient',
    route: PatientRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/department',
    route: DepartmentRoutes,
  }
];

moduleRoutes.forEach((route) => {
  routers.use(route.path, route.route);
});

export default routers;
