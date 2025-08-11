// routes/authRoutes.js

import express from 'express';
const router = express.Router();

// 1. Importa as funções do controller
import { loginAdmin, getAdmins, changePassword } from '../controllers/authController.js';

// 2. Importa o middleware de proteção
import { protect } from '../middleware/authMiddleware.js';

// --- ROTAS PÚBLICAS ---
// Qualquer um pode tentar fazer login. Mapeia a URL /login para a função loginAdmin.
router.post('/login', loginAdmin);

// --- ROTAS PROTEGIDAS ---
// Só quem estiver autenticado pode acessar.
// A ordem é crucial: o middleware 'protect' DEVE ser executado antes da função do controller.

// Rota para buscar administradores
router.get('/admins', protect, getAdmins);

// Rota para trocar senha - protegida
// Corrigido para o método PUT, que é o padrão para alterações
router.put('/change-password', protect, changePassword);

// 3. Exporta o router configurado para que o server.js possa usá-lo.
export default router;
