import express from 'express';
import {
  createPagina,
  getPaginas,
  getPaginaBySlug,
  getPaginaById,
  updatePagina,
  deletePagina,
} from '../controllers/paginaController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin', protect, getPaginas);
router.get('/slug/:slug', getPaginaBySlug);
router.post('/', protect, createPagina);
router
  .route('/:id')
  .get(protect, getPaginaById)
  .put(protect, updatePagina)
  .delete(protect, deletePagina);

export default router;
