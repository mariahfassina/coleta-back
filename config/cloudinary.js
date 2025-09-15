import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Configura o SDK do Cloudinary com as credenciais do seu ambiente
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Garante que as URLs sejam sempre https
} );

// Configura o storage para o Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // ADAPTANDO À REALIDADE: Vamos usar a pasta que já existe.
    folder: 'coleta-app',
    allowed_formats: ['jpeg', 'png', 'jpg', 'gif', 'webp'],
    transformation: [{ width: 1920, height: 1080, crop: 'limit' }],
  },
});

export default storage;
