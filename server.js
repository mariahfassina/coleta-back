// server.js - Versão Final Otimizada para Deploy

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

app.use(express.json());

// --- 1. Configuração do CORS (Simplificada para garantir que funcione) ---
// Esta configuração aberta é a melhor para depurar. 
// Ela diz "qualquer um pode me acessar".
app.use(cors());

// --- 2. Definição das Rotas da API (VEM PRIMEIRO) ---
// O servidor vai primeiro verificar se a requisição bate com alguma rota da API.
app.use('/api/auth', authRoutes);
app.use('/api/paginas', paginaRoutes);
app.use('/api/upload', uploadRoutes);

// --- 3. Configuração para Servir Arquivos Estáticos ---
// Apenas se a requisição não for para a API, ele continua para cá.
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


// --- 4. Tratamento de Erros (VEM POR ÚLTIMO) ---
// Se a requisição não bateu com nenhuma rota da API nem com um arquivo estático,
// ela cairá aqui.
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


// --- 5. Inicia o Servidor ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
  console.log(`Servidor rodando na porta ${PORT}`)
);