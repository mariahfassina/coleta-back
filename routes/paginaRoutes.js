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

// --- Definição das Rotas para a coleção 'paginas' ---

// ✅ 1. ROTA ESPECÍFICA PARA O DASHBOARD ADMIN
// Esta rota deve vir ANTES de qualquer rota com parâmetros como /:slug ou /:id.
// Ela usa a função getPaginas para listar todas as páginas para o painel.
router.get('/admin', protect, getPaginas);


// Rota para a raiz '/api/paginas'
router.route('/')
  .post(protect, createPagina); // POST continua aqui, mas o GET foi movido para a rota /admin


// ✅ 2. ROTA PÚBLICA MAIS CLARA
// Mudar de '/:slug' para '/slug/:slug' torna a rota única e evita o conflito.
// Agora o frontend vai chamar /api/paginas/slug/quem-somos, que é muito mais claro.
router.get('/slug/:slug', getPaginaBySlug);


// Rota para manipular uma página específica pelo seu ID do MongoDB
// Esta rota continua a mesma.
router.route('/:id')
  .get(protect, getPaginaById)
  .put(protect, updatePagina)
  .delete(protect, deletePagina);


export default router;
