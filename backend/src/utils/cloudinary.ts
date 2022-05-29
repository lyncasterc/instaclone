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
// cloudinary.uploader.destroy();

// TODO: write function for deleting an image.
// may need to store the public id in the database as well?
// create image schema
export default {
  upload,
};
