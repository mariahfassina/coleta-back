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
  getAllSlugs, // <-- 1. IMPORTA A NOVA FUNÇÃO DE DIAGNÓSTICO
} from '../controllers/paginaController.js';

// Middlewares
import { protect } from '../middleware/authMiddleware.js';
import storage from '../config/cloudinary.js';

const router = express.Router();

// Configura o Multer para usar o storage do Cloudinary
const upload = multer({ storage });

// =================================================================
// ROTAS
// =================================================================

// ROTA DE DIAGNÓSTICO PARA VER TODOS OS SLUGS (pública e temporária)
router.get('/get-all-slugs-diagnostico', getAllSlugs); // <-- 2. ADICIONA A NOVA ROTA

// Rotas públicas (não precisam de autenticação nem upload)
router.get('/slug/:slug', getPaginaBySlug);

// Rotas de Admin (protegidas)
router.get('/admin', protect, getPaginas);

// Rota para CRIAR uma página (agora com upload de imagem)
router.post('/', protect, upload.single('midia'), createPagina);

// Rotas que operam por ID
router
  .route('/:id')
  .get(protect, getPaginaById)
  .put(protect, upload.single('midia'), updatePagina)
  .delete(protect, deletePagina);

export default router;
