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
  return {
    url: response.secure_url,
    publicId: response.public_id,
  };
};

const destroy = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId);
};

export default {
  upload,
  destroy,
};
