// routes/paginaRoutes.js

import express from 'express';
const router = express.Router();
import {
  createPagina,
  getPaginas,
  getPaginaBySlug,
  updatePagina,
  deletePagina,
} from '../controllers/paginaController.js';
import { protect } from '../middleware/authMiddleware.js';


// --- Definição das Rotas ---

// Rota para buscar todas as páginas (protegida, para o admin) e criar uma nova página (protegida)
router.route('/')
  .get(protect, getPaginas)
  .post(protect, createPagina);

// Rota para buscar uma página específica pelo slug (pública)
// IMPORTANTE: Esta rota precisa vir ANTES da rota /:id para não haver conflito.
router.route('/:slug')
  .get(getPaginaBySlug);

// Rota para atualizar e deletar uma página pelo seu ID (protegidas)
router.route('/:id')
  .put(protect, updatePagina)
  .delete(protect, deletePagina);


export default router;