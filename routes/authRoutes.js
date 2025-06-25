// routes/authRoutes.js

import express from 'express';
const router = express.Router();

// 1. Importa as funções do controller
import { loginAdmin, getAdmins } from '../controllers/authController.js';

// 2. Importa o middleware de proteção
import { protect } from '../middleware/authMiddleware.js';

// --- ROTA PÚBLICA ---
// Qualquer um pode tentar fazer login. Mapeia a URL /login para a função loginAdmin.
router.post('/login', loginAdmin);

// --- ROTA PROTEGIDA ---
// Só quem estiver autenticado pode acessar. Mapeia a URL /admins para a função getAdmins,
// mas ANTES passa pelo "segurança" (o middleware 'protect').
router.get('/admins', protect, getAdmins);

// 3. A LINHA MAIS IMPORTANTE QUE RESOLVE O ERRO
// Exporta o router configurado para que o server.js possa usá-lo.
export default router;