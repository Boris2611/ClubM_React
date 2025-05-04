import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file) => {
  try {
    const result = await cloudinary.v2.uploader.upload(file, {
      folder: 'my-fullstack-app',
    });
    return result;
  } catch (error) {
    throw new Error('Image upload failed');
  }
};

export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error('Image deletion failed');
  }
};