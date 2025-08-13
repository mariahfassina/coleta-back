import express from 'express';
import multer from 'multer';
import path from 'path';
import { loginAdmin, getAdmins, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ========================
// Configuração do Multer
// ========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), // pasta para salvar arquivos
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)) // nome único
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Só imagens são permitidas!'), false);
};

const upload = multer({ storage, fileFilter });

// ========================
// ROTAS PÚBLICAS
// ========================
router.post('/login', loginAdmin);

// ========================
// ROTAS PROTEGIDAS
// ========================
router.get('/admins', protect, getAdmins);
router.get('/me', protect, getMe);

// ========================
// ROTA DE UPLOAD DE IMAGEM
// ========================
router.post('/upload', protect, upload.single('foto'), (req, res) => {
  if (!req.file) return res.status(400).send('Nenhum arquivo enviado');
  res.json({ mensagem: 'Upload OK', arquivo: req.file.filename });
});

// ========================
// Exporta o router
// ========================
export default router;
