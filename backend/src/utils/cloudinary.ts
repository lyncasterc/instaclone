import Cloudinary from 'cloudinary';
import config from './config';

const cloudinary = Cloudinary.v2;

console.log('name: ', config.CLOUDINARY_NAME);
console.log('key: ', config.CLOUDINARY_API_KEY);
console.log('secret: ', config.CLOUDINARY_API_SECRET);

cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

const upload = async (resource: string) => {
  const response = await cloudinary.uploader.upload(resource);
  return response.secure_url;
};
// cloudinary.uploader.destroy();

// TODO: write function for deleting an image.
// may need to store the public id in the database as well?
// create image schema
export default {
  upload,
};
