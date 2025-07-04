import cloudinary from '../../helper/cloudinary';

const uploadBufferToCloudinary  = (fileBuffer: Buffer, folder = 'projects') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      })
      .end(fileBuffer);
  });
};

export default uploadBufferToCloudinary ;
