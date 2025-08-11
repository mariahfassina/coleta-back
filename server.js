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

// =============================================
// CONFIGURAÇÃO OTIMIZADA DO CORS (ATUALIZADA)
// =============================================
const allowedOrigins = [
  'https://coletareact.vercel.app', // Seu frontend na Vercel
  'http://localhost:3000'           // Para desenvolvimento local
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Handle pre-flight requests
app.options('*', cors());

// =============================================
// MIDDLEWARES
// =============================================
app.use(express.json());
app.disable('x-powered-by'); // Remove header X-Powered-By

// =============================================
// ROTAS DA API
// =============================================
app.use('/api/auth', authRoutes);
app.use('/api/paginas', paginaRoutes);
app.use('/api/upload', uploadRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// =============================================
// SERVIÇO DE ARQUIVOS ESTÁTICOS (APENAS BACKEND)
// =============================================
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// =============================================
// MANEJO DE ERROS
// =============================================
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: `Rota não encontrada: ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

// =============================================
// INICIALIZAÇÃO DO SERVIDOR
// =============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  🚀 Servidor rodando em ${process.env.NODE_ENV || 'development'}
  📡 Porta: ${PORT}
  🌐 URLs permitidas: ${allowedOrigins.join(', ')}
  `);
});
