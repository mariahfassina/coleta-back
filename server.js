// server.js - Ponto de entrada principal do Backend (v. Final com CORS)
// Forçando o deploy - 25/06/2025
// ---- 1. Importações Essenciais ----
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// ---- 2. Importação das Rotas ----
import authRoutes from './routes/authRoutes.js';
import paginaRoutes from './routes/paginaRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';


// ---- 3. Configuração Inicial ----
dotenv.config();
connectDB();
const app = express();


// ---- 4. Middlewares ----

// --- Configuração do CORS (Cross-Origin Resource Sharing) ---
// Lista de origens (domínios) que têm permissão para acessar esta API
const whitelist = [
  'http://localhost:3000', // Permite o acesso durante o desenvolvimento local do React
  'https://sitecoleta.vercel.app' // URL de produção do seu site no Vercel
];

const corsOptions = {
  origin: function (origin, callback) {
    // A condição `!origin` permite que ferramentas como o Postman acessem a API.
    // `whitelist.indexOf(origin) !== -1` verifica se a origem da requisição está na nossa lista de permissões.
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado pela política de CORS'));
    }
  },
};

// Aplica as opções de CORS à nossa aplicação
app.use(cors(corsOptions));

// Permite que o servidor aceite e interprete dados no formato JSON
app.use(express.json());


// ---- 5. Definição das Rotas da API ----
app.get('/api', (req, res) => {
  res.send('API do Coleta Seletiva está rodando...');
});

app.use('/api/auth', authRoutes);
app.use('/api/paginas', paginaRoutes);
app.use('/api/upload', uploadRoutes);


// ---- 6. Servir Imagens Estáticas ----
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


// ---- 7. Middlewares de Tratamento de Erros ----
// Rota não encontrada (404)
app.use((req, res, next) => {
  const error = new Error(`Rota não encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Erro geral da aplicação (500)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});


// ---- 8. Inicia o Servidor ----
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => 
  console.log(`Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV || 'development'}`)
);