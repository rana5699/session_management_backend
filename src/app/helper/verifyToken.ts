import { UserRole } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from './AppError';
import status from 'http-status';

type TVerifyOptions = {
  allowedRoles?: UserRole[];
};

const verifyToken = (
  token: string,
  secret: string,
  req: Request,
  res: Response,
  next: NextFunction,
  options?: TVerifyOptions
) => {
  jwt.verify(token, secret, (err, decoded) => {
    if (err || !decoded) {
      return next(new AppError(status.UNAUTHORIZED, 'You are UNAUTHORIZED'));
    }

    // ✅ Check that decoded is of type JwtPayload
    if (typeof decoded === 'string') {
      return next(new AppError(status.UNAUTHORIZED, 'Invalid token payload'));
    }

    const { role } = decoded as JwtPayload;

    if (options?.allowedRoles && !options.allowedRoles.includes(role)) {
      return next(new AppError(status.FORBIDDEN, 'Access Denied: Unauthorized Role'));
    }

    req.user = decoded;
    next();
  });
};

export default verifyToken;