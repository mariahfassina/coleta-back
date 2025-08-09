import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import paginaRoutes from './routes/paginaRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();
connectDB();
const app = express();

const allowedOrigins = [
  'https://coletareact.vercel.app',
  'http://localhost:3000',
  'https://coleta-front.vercel.app/',
   'http://127.0.0.1:3000'
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

const __dirname = path.resolve();
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/api/auth', authRoutes);
app.use('/api/paginas', paginaRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static(uploadsDir));

app.use((req, res, next) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
