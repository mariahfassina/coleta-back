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

// Configura o storage para o Multer, que fará o upload para o Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'coleta-seletiva', // Nome da pasta onde as imagens serão salvas no Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg', 'gif', 'webp'], // Formatos de imagem permitidos
    transformation: [{ width: 1920, height: 1080, crop: 'limit' }], // Opcional: Redimensiona imagens grandes para economizar espaço
  },
});

export default storage;
