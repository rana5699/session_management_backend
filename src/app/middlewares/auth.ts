import { NextFunction, Request, Response } from 'express';
import AppError from '../helper/AppError';
import status from 'http-status';
import verifyToken from '../helper/verifyToken';
import { UserRole } from '@prisma/client';

const auth = (...userRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(
          new AppError(status.UNAUTHORIZED, 'You are not authorized to access this route')
        );
      }

      verifyToken(token, process.env.JWT_SECRET as string, req, res, next, {
        allowedRoles: userRoles,
      });
    } catch (error) {
      next(error);
    }
  };
};
