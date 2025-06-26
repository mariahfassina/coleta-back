// server.js - Ponto de entrada principal do Backend (Versão Final para Deploy)

// ---- 1. Importações Essenciais ----
import path from 'path'; // Módulo nativo do Node.js para trabalhar com caminhos de arquivos
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Importa a biblioteca CORS
import connectDB from './config/db.js';

// ---- 2. Importação das Rotas ----
import authRoutes from './routes/authRoutes.js';
import paginaRoutes from './routes/paginaRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';


// ---- 3. Configuração Inicial ----
// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Executa a função para conectar ao Banco de Dados
connectDB();

// Cria a instância principal da aplicação Express
const app = express();


// ---- 1. Configuração do CORS (com Whitelist) ----
// Lista de domínios que têm permissão para acessar esta API.
const whitelist = [
  'http://localhost:3000',        // Para o desenvolvimento local do React
  'https://coletareact.vercel.app',
  'https://coleta-back-teste.vercel.app'  // URL de produção do seu site no Vercel
];

const corsOptions = {
  origin: function (origin, callback) {
    // A condição `!origin` permite requisições sem origem (como do Postman ou de apps mobile).
    // A condição `whitelist.indexOf(origin) !== -1` verifica se a origem da requisição está na nossa lista de permissões.
    if (!origin || whitelist.indexOf(origin) !== -1) {
      // Se a origem for permitida, a resposta é enviada com sucesso.
      callback(null, true);
    } else {
      // Se a origem não for permitida, a requisição é rejeitada com um erro de CORS.
      callback(new Error('Não permitido pela política de CORS'));
    }
  },
};

// Aplica as opções de CORS à nossa aplicação. Esta deve ser uma das primeiras coisas.
app.use(cors(corsOptions));

// Permite que o servidor aceite e interprete dados no formato JSON
app.use(express.json());


// ---- 5. Definição das Rotas da API (vem ANTES dos arquivos estáticos) ----
// Rota de teste para verificar se a API está online
app.get('/api', (req, res) => {
  res.send('API do Coleta Seletiva está rodando...');
});

// Delega as rotas para os arquivos especializados
app.use('/api/auth', authRoutes);
app.use('/api/paginas', paginaRoutes);
app.use('/api/upload', uploadRoutes);


// ---- 6. Configuração para Servir Imagens Estáticas ----
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


// ---- 7. Middlewares de Tratamento de Erros (vem POR ÚLTIMO) ----
// Middleware para tratar erros de rotas não encontradas (404)
app.use((req, res, next) => {
  const error = new Error(`Rota não encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Middleware para tratar todos os outros erros da aplicação
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    // Em modo de produção, não mostramos a pilha de erros por segurança
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});


// ---- 8. Inicia o Servidor ----
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV || 'development'}`);
  // Mensagem de verificação para o deploy
  console.log('--- VERSÃO COM CORS SIMPLIFICADO PRONTA PARA DEPLOY ---'); 
});