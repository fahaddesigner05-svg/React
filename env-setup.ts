import dotenv from 'dotenv';
dotenv.config();

// Prevent Cloudinary SDK from crashing if CLOUDINARY_URL is invalid
if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.startsWith('cloudinary://')) {
  console.warn('Invalid CLOUDINARY_URL detected and removed to prevent crash.');
  delete process.env.CLOUDINARY_URL;
}
