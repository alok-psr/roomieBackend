import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'
import { ApiErr } from './ApiErr.js'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout:5000
})

// upload buffer directly
const cloudinaryUpload = async (fileBuffer, folder = "roomie_uploads") => {
  try {
    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder },
        (error, result) => {
          if (error) reject(new ApiErr(500, "unable to upload to cloudinary", error));
          else resolve(result);
        }
      );
      streamifier.createReadStream(fileBuffer).pipe(uploadStream).on("finish", () => {
        console.log("Upload stream finished piping");}
      );

    });
  } catch (error) {
    throw new ApiErr(500, "cloudinary upload failed", error);
  }
};

const cloudinaryRemove = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("image removed ... woohoo , ", result);
    return result;
  } catch (error) {
    throw new ApiErr(401, "unable to remove image");
  }
};

export { cloudinaryUpload, cloudinaryRemove }
