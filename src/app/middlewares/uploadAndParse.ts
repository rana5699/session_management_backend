import { NextFunction, Request, Response } from 'express';
import uploadBufferToCloudinary from '../modules/Shared/uploadBufferToCloudinary';

const uploadAndParse = (
  folder: string,
  fieldName: string = 'profilePicture',
  isMultiple: boolean = false
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let imageUrls: string[] = [];

      if (isMultiple && Array.isArray(req.files)) {
        const uploadResults = await Promise.all(
          req.files.map((file) => uploadBufferToCloudinary(file.buffer, folder))
        );
        imageUrls = uploadResults.map((result: any) => result.secure_url);
      } else if (!isMultiple && req.file) {
        const result = await uploadBufferToCloudinary(req.file.buffer, folder);
        const typedResult = result as { secure_url: string };
        imageUrls = [typedResult.secure_url];
      }

      // Optional: parse JSON string if body.data is sent as string
      if (typeof req.body.data === 'string') {
        req.body.data = JSON.parse(req.body.data);
      }

      // Final merged body
      req.body = {
        ...(req.body.data || {}),
        [fieldName]: isMultiple ? imageUrls : imageUrls[0] || null,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default uploadAndParse;
