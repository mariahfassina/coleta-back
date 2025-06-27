// routes/paginaRoutes.js

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

// ✅ ROTA PRIVADA: Para o dashboard listar todas as páginas.
// Ex: GET /api/paginas/admin
router.get('/admin', protect, getPaginas);

// ✅ ROTA PÚBLICA: Para o site buscar páginas pelo nome (slug).
// É impossível de confundir com um ID por causa do '/slug/'.
// Ex: GET /api/paginas/slug/quem-somos
router.get('/slug/:slug', getPaginaBySlug);

// ✅ ROTA PRIVADA: Para criar uma nova página.
router.post('/', protect, createPagina);

// ✅ ROTA PRIVADA: Para buscar, atualizar ou deletar uma página pelo seu número (ID).
// Ex: GET /api/paginas/60f7e2a4b9d3b13f4c6e8a1
router
  .route('/:id')
  .get(protect, getPaginaById)
  .put(protect, updatePagina)
  .delete(protect, deletePagina);

export default router;
