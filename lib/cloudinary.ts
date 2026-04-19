import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

export async function uploadImage(
  file: Buffer | string,
  folder = "cks-website",
  options: Record<string, unknown> = {}
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: "image" as const,
      transformation: [{ quality: "auto", fetch_format: "auto" }],
      ...options,
    };

    if (typeof file === "string") {
      // Base64 string
      cloudinary.uploader.upload(file, uploadOptions, (err, result) => {
        if (err || !result) return reject(err);
        resolve({ url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height, format: result.format });
      });
    } else {
      // Buffer
      cloudinary.uploader
        .upload_stream(uploadOptions, (err, result) => {
          if (err || !result) return reject(err);
          resolve({ url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height, format: result.format });
        })
        .end(file);
    }
  });
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
