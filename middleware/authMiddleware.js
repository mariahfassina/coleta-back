// middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  let token;

  // Verifica se o header Authorization existe e começa com 'Bearer '
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrai o token do header
      token = req.headers.authorization.split(' ')[1];

      // Verifica e decodifica o token usando a chave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Busca o admin pelo id decodificado e exclui a senha do resultado
      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        return res.status(401).json({ message: 'Admin não encontrado' });
      }

      // Tudo ok, permite continuar para a rota protegida
      next();
    } catch (error) {
      console.error('Erro de autenticação:', error);
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado, token ausente' });
  }
};
