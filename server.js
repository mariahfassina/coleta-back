// server.js - Versão de Teste com CORS Aberto

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

app.use(cors({
  origin: ['http://localhost:3000', 'https://coleta-back-teste.vercel.app/','https://coletareact.vercel.app/,'https://coletareact.vercel.app'], // coloca o domínio liberado aqui
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));


app.use(express.json());

// ROTAS DA API
app.use('/api/auth', authRoutes);
app.use('/api/paginas', paginaRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api', (req, res) => {
  res.send('API do Coleta Seletiva está rodando...');
});

// SERVIR ARQUIVOS ESTÁTICOS
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// TRATAMENTO DE ERROS
app.use((req, res, next) => {
  const error = new Error(`Rota não encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

// INICIA O SERVIDOR
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
  console.log(`Servidor rodando na porta ${PORT} no modo ${process.env.NODE_ENV || 'development'}`)
);
