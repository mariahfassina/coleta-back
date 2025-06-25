// routes/uploadRoutes.js

import path from 'path';
import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configuração de armazenamento do Multer
const storage = multer.diskStorage({
  // Define a pasta de destino para os uploads
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  // Define o nome do arquivo salvo
  filename(req, file, cb) {
    // Garante um nome de arquivo único adicionando a data atual
    // Ex: cronograma-2024-1678886400000.png
    const uniqueSuffix = Date.now();
    cb(null, `${path.parse(file.originalname).name}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Função para validar o tipo de arquivo
function checkFileType(file, cb) {
  // Define os tipos de arquivo permitidos (imagens)
  const filetypes = /jpeg|jpg|png|gif|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas!'));
  }
}

// Inicializa o middleware de upload com as configurações
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Fazer upload de uma imagem
// @route   POST /api/upload
// @access  Privado/Admin
// 'upload.single('image')' diz ao Multer para esperar um único arquivo no campo 'image'
router.post('/', protect, upload.single('image'), (req, res) => {
  if (req.file) {
    res.status(200).send({
      message: 'Imagem enviada com sucesso',
      // Retorna o caminho onde a imagem foi salva para o frontend poder usar
      image: `/${req.file.path.replace(/\\/g, '/')}`, 
    });
  } else {
    res.status(400).send({ message: 'Nenhum arquivo enviado.' });
  }
});

export default router;