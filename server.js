// server.js - Ponto de entrada principal do Backend

// ---- 1. Importações Essenciais ----
import path from 'path'; // Módulo nativo do Node.js para trabalhar com caminhos de arquivos
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// ---- 2. Importação das Rotas ----
// Cada arquivo de rota é como um "capítulo" da sua API
import authRoutes from './routes/authRoutes.js';
import paginaRoutes from './routes/paginaRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';


// ---- 3. Configuração Inicial ----
// Carrega as variáveis de ambiente do arquivo .env para process.env
dotenv.config();

// Executa a função para conectar ao Banco de Dados MongoDB
connectDB();

// Cria a instância principal da aplicação Express
const app = express();


// ---- 4. Middlewares ----
// Habilita o CORS para permitir que o seu frontend (em outro domínio) faça requisições
app.use(cors());

// Permite que o servidor aceite e interprete dados no formato JSON no corpo das requisições
app.use(express.json());


// ---- 5. Definição das Rotas da API ----
// Rota de teste para verificar se a API está online
app.get('/api', (req, res) => {
  res.send('API do Coleta Seletiva está rodando...');
});

// Delega as rotas para os arquivos especializados
app.use('/api/auth', authRoutes);
app.use('/api/paginas', paginaRoutes);
app.use('/api/upload', uploadRoutes);


// ---- 6. Configuração para Servir Imagens Estáticas ----
// Esta parte é crucial para que as imagens salvas na pasta 'uploads' possam ser acessadas pelo navegador
const __dirname = path.resolve(); // Obtém o caminho absoluto do diretório do projeto
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


// ---- 7. Middlewares de Tratamento de Erros (Opcional, mas boa prática) ----
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
    // Em modo de desenvolvimento, é útil ver a pilha de erros
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});


// ---- 8. Inicia o Servidor ----
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => 
  console.log(`Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV || 'development'}`)
);