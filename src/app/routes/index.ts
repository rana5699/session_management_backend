import express from 'express';
import { AuthRoutes } from '../modules/Auth/auth.routes';

const routers = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => {
  routers.use(route.path, route.route);
});

export default routers;
