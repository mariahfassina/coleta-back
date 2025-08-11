import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import connectDB from './config/db.js';

// Importa apenas o arquivo de rotas que realmente existe no backend
import authRoutes from './routes/authRoutes.js';

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  'https://coletareact.vercel.app',
  'http://localhost:3000',
  'https://coleta-front.vercel.app',
  'http://127.0.0.1:3000',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido por CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Criar pasta uploads se necessário
const __dirname = path.resolve();
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Rotas
// Apenas a rota de autenticação é usada, pois é a única que existe no projeto
app.use('/api/auth', authRoutes);

// A linha abaixo foi removida, pois 'AppRoutes.js' não existe no backend.
// app.use('/api/app', AppRoutes);
// A linha abaixo foi removida, pois 'privateRoutes.js' não existe no backend.
// app.use('/api/private', privateRoutes);


app.use('/uploads', express.static(uploadsDir));

// 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
