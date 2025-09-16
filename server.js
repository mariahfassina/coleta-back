import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/db.js';


import authRoutes from './routes/authRoutes.js';
import paginaRoutes from './routes/paginaRoutes.js';
import emailRoutes from './routes/emailRoutes.js';


import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
// ==================================================================

connectDB();
const app = express();


const allowedOrigins = [
  'http://localhost:3000',
  'https://coletareact.vercel.app'          
];



if (process.env.REACT_APP_API_URL ) {
  allowedOrigins.push(process.env.REACT_APP_API_URL);
}

app.use(cors({
  origin: function(origin, callback) {
   
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `O CORS para esta origem não está permitido: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
}));


app.options('*', cors());


app.use(express.json());
app.disable('x-powered-by'); 


app.use('/api/auth', authRoutes);
app.use('/api/paginas', paginaRoutes);
app.use('/api', emailRoutes);


app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});


app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  🚀 Servidor rodando em ${process.env.NODE_ENV || 'development'}
  📡 Porta: ${PORT}
  🌐 URLs permitidas: ${allowedOrigins.join(', ')}
  `);
});



