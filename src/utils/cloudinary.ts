import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const uploadImage = async (imageFile: string) => {
  try {
    const result = await cloudinary.uploader.upload(imageFile, {
      folder: "sport-liesbauer-products",
    });
    
    return {
      cloudinaryUrl: result.secure_url,
      cloudinaryId: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

export const deleteImage = async (cloudinaryId: string) => {
  try {
    await cloudinary.uploader.destroy(cloudinaryId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Failed to delete image from Cloudinary");
  }
};
