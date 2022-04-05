import Cloudinary from 'cloudinary';
import config from './config';

const cloudinary = Cloudinary.v2;

cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

const upload = async (resource: string) => {
  const response = await cloudinary.uploader.upload(resource);
  return response.secure_url;
};

export default {
  upload,
};
