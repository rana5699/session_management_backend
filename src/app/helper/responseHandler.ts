import { Response } from 'express';

interface ResponsePayload<T> {
  success: boolean;
  message: string;
  statusCode: number;
  meta?: {
    page: number;
    pageSize: number;
    total: number;
  } | null;
  data: T | null;
}

const responseHandler = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  meta?: { page: number; pageSize: number; totalRecords: number; totalPages: number } | null,

  data: T | null = null
): Response<ResponsePayload<T>> => {
  return res.status(statusCode).json({
    success,
    message,
    meta,
    data,
  });
};

export default responseHandler;
