// Arquivo: routes/emailRoutes.js

import express from 'express';
import { subscribeEmail } from '../controllers/emailController.js';

const router = express.Router();

router.post('/subscribe', subscribeEmail);

export default router; 

