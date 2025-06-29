import { v2 as cloudinary } from 'cloudinary';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinaryCloud.cloudName,
  api_key: config.cloudinaryCloud.apiKey,
  api_secret: config.cloudinaryCloud.apiSecret,
});
export default cloudinary;