import { v2 as cloudinary } from "cloudinary";

export async function uploadImage(image: File) {
  const mime = image.type;
  const encoding = "base64";
  const arrayBuffer = await image.arrayBuffer();
  const base64Data = Buffer.from(arrayBuffer).toString("base64");
  const fileUri = "data:" + mime + ";" + encoding + "," + base64Data;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true,
  });

  const uploadResult = await cloudinary.uploader
    .upload(fileUri, { folder: "money-forge" })
    .catch(() => {
      throw new Error("Image upload failed");
    });

  return uploadResult?.secure_url;
}
