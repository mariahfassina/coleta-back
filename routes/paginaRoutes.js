import express from 'express';
import multer from 'multer';

// Controladores
import {
  createPagina,
  getPaginas,
  getPaginaBySlug,
  getPaginaById,
  updatePagina,
  deletePagina,
} from '../controllers/paginaController.js';

// Middlewares
import { protect } from '../middleware/authMiddleware.js';
import storage from '../config/cloudinary.js'; // <-- 1. IMPORTA O STORAGE DO CLOUDINARY

const router = express.Router();

// Configura o Multer para usar o storage do Cloudinary
const upload = multer({ storage }); // <-- 2. CRIA A INSTÂNCIA DO UPLOAD

// =================================================================
// ROTAS
// =================================================================

// Rotas públicas (não precisam de autenticação nem upload)
router.get('/slug/:slug', getPaginaBySlug);

// Rotas de Admin (protegidas)
router.get('/admin', protect, getPaginas);

// Rota para CRIAR uma página (agora com upload de imagem)
// O middleware 'upload.single('midia')' intercepta a imagem e envia para o Cloudinary
router.post('/', protect, upload.single('midia'), createPagina); // <-- 3. APLICA O MIDDLEWARE DE UPLOAD

// Rotas que operam por ID
router
  .route('/:id')
  .get(protect, getPaginaById)
  // Rota para ATUALIZAR uma página (agora com upload de imagem)
  .put(protect, upload.single('midia'), updatePagina) // <-- 4. APLICA O MIDDLEWARE DE UPLOAD
  .delete(protect, deletePagina);

export default router;
