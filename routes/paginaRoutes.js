import express from 'express';
import multer from 'multer';


import {
  createPagina,
  getPaginas,
  getPaginaBySlug,
  getPaginaById,
  updatePagina,
  deletePagina,
  getAllSlugs,
} from '../controllers/paginaController.js';


import { protect } from '../middleware/authMiddleware.js';
import storage from '../config/cloudinary.js';

const router = express.Router();
const upload = multer({ storage });


router.get('/get-all-slugs-diagnostico', getAllSlugs);


router.get('/slug/:slug', getPaginaBySlug);

router.get('/admin', protect, getPaginas);
router.post('/', protect, upload.single('midia'), createPagina);

router
  .route('/:id')
  .get(protect, getPaginaById)
  .put(protect, upload.single('midia'), updatePagina)
  .delete(protect, deletePagina);

export default router;

