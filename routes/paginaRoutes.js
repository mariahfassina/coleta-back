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
  getAllSlugs,
} from '../controllers/paginaController.js';

// Middlewares
import { protect } from '../middleware/authMiddleware.js';
import storage from '../config/cloudinary.js';

const router = express.Router();
const upload = multer({ storage });

// =============================================
// ROTA DE DIAGNÓSTICO (TODOS OS SLUGS) – PÚBLICA
// =============================================
router.get('/get-all-slugs-diagnostico', getAllSlugs);

// =============================================
// ROTAS PÚBLICAS
// =============================================
router.get('/slug/:slug', getPaginaBySlug);

// =============================================
// ROTAS ADMINISTRATIVAS (PROTEGIDAS)
// =============================================
router.get('/admin', protect, getPaginas);
router.post('/', protect, upload.single('midia'), createPagina);

router
  .route('/:id')
  .get(protect, getPaginaById)
  .put(protect, upload.single('midia'), updatePagina)
  .delete(protect, deletePagina);

export default router;
