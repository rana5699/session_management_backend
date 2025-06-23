import { Response } from 'express';

interface ResponsePayload<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T | null;
}

const responseHandler = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: T | null = null
): Response<ResponsePayload<T>> => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export default responseHandler;
