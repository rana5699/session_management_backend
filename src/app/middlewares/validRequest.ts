import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // check data validation
      await schema.parseAsync({
        body: req.body,
      });

      // if everything is okay !
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;