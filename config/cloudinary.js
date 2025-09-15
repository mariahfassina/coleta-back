import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// --- INÍCIO DO TESTE DE DIAGNÓSTICO ---
// Estamos colocando as credenciais diretamente no código para eliminar
// qualquer chance de erro nas variáveis de ambiente do Render.
// Lembre-se de remover isso depois que o teste funcionar.

cloudinary.config({
  cloud_name: 'dihhpcbk4', // SEU CLOUD NAME, PEGUEI DAS IMAGENS ANTERIORES
  api_key: process.env.CLOUDINARY_API_KEY, // Sua API Key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Seu API Secret
  secure: true,
});

console.log('--- DIAGNÓSTICO CLOUDINARY ---');
console.log('Cloud Name Usado:', 'dihhpcbk4');
console.log('API Key Carregada:', process.env.CLOUDINARY_API_KEY ? 'Sim' : 'Não');
console.log('--- FIM DO DIAGNÓSTICO ---');

// --- FIM DO TESTE DE DIAGNÓSTICO ---

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'TESTE-DEFINITIVO-PASTA', // <<-- NOME DA PASTA FORÇADO PARA O TESTE
    allowed_formats: ['jpeg', 'png', 'jpg', 'gif', 'webp'],
    transformation: [{ width: 1920, height: 1080, crop: 'limit' }],
  },
});

export default storage;
