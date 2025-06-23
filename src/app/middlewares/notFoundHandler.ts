import { Request, Response, NextFunction } from 'express';
import status from 'http-status';

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: 'API route not found',
  });
};

export default notFoundHandler;
