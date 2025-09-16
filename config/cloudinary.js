import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, 
} );


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'coleta-app',
    allowed_formats: ['jpeg', 'png', 'jpg', 'gif', 'webp'],
    transformation: [{ width: 1920, height: 1080, crop: 'limit' }],
  },
});

export default storage;
