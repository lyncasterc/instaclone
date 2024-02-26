import { Area } from 'react-easy-crop';

/**
 * Creates a new image from the provided url
 * @param {string} url - The url of the image
 * @returns {Promise<HTMLImageElement>}
 */
export function createImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });
}

/**
 * Crops the provided image.
 * @param {string} imageSrc - The url of the image
 * @param {Area} crop - The area to crop
 * @returns {Promise<string>} - The cropped image as a data url
 */
async function getCroppedImage(imageSrc: string, crop: Area) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not create canvas context');
  }

  // setting the canvas size to the size of the cropped image
  canvas.width = crop.width;
  canvas.height = crop.height;

  // drawing the cropped image on the canvas
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  return canvas.toDataURL('image/jpeg');
}

export default getCroppedImage;
