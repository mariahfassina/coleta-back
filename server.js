import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import paginaRoutes from './routes/paginaRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();
connectDB();
const app = express();

// Configuração do CORS para produção/desenvolvimento
const allowedOrigins = [
  'http://localhost:3000',
  'https://coleta-back-teste.vercel.app',
  'https://coletareact.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requests sem origin (como mobile apps ou curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'A política de CORS para este site não permite acesso a partir da origem especificada.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/paginas', paginaRoutes);
app.use('/api/upload', uploadRoutes);

// Rota de health check para o Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Configuração para servir arquivos estáticos e o frontend React
const __dirname = path.resolve();

// 1. Servir arquivos estáticos do upload
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// 2. Servir o frontend React (se estiver no mesmo repositório)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  // Rota fallback para o frontend
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// Tratamento de erros
app.use((req, res, next) => {
  res.status(404).json({ message: `Rota não encontrada - ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} no modo ${process.env.NODE_ENV || 'development'}`);
});
