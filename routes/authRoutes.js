import express from 'express';
import { loginAdmin, getAdmins } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rota pública de login
router.post('/login', loginAdmin);

// Rota protegida para listar admins
router.get('/admins', protect, getAdmins);

export default router;
