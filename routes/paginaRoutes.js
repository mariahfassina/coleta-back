// routes/paginaRoutes.js

import express from 'express';

// 1. Importa todas as funções do controller de páginas
import {
  createPagina,
  getPaginas,
  getQuemSomos,
  getPaginaBySlug,
  getPaginaById, // <-- Importando a nova função
  updatePagina,
  deletePagina,
} from '../controllers/paginaController.js';

// 2. Importa o middleware de segurança
import { protect } from '../middleware/authMiddleware.js';

// 3. Inicializa o roteador do Express
const router = express.Router();

// --- Definição das Rotas para a coleção 'paginas' ---

// Rota para a raiz '/api/paginas'
router.route('/')
  .get(protect, getPaginas)      // GET: Lista todas as páginas (apenas para admin logado)
  .post(protect, createPagina);  // POST: Cria uma nova página (apenas para admin logado)


  router.route('/quem-somos')
  .get(getQuemSomos)
  .post(getQuemSomos);

// Rota para buscar uma página pública pelo seu SLUG (identificador de texto)
// Exemplo de acesso: GET /api/paginas/slug/quem-somos
// É importante ter o '/slug/' para não confundir com um ID.
router.get('/slug/:slug', getPaginaBySlug);


// Rota para manipular uma página específica pelo seu ID do MongoDB
// Exemplo de acesso: GET /api/paginas/60f7e2a4b9d3b1e3f4c6e8a1
// Esta rota faz três coisas diferentes dependendo do método HTTP:
router.route('/:id')
  .get(protect, getPaginaById)       // GET: Busca os dados de uma página para o formulário de edição (admin)
  .put(protect, updatePagina)       // PUT: Atualiza os dados da página (admin)
  .delete(protect, deletePagina);  // DELETE: Remove a página do banco de dados (admin)


// 4. Exporta o router configurado
export default router;