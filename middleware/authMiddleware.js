// src/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const protect = async (req, res, next) => {
  let token;

  // Verifica se o header Authorization existe e começa com 'Bearer '
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extrai o token do header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token recebido no middleware protect:', token);

      // Verifica e decodifica o token usando a chave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decodificado:', decoded);

      // Verifica se o decoded existe e tem a propriedade id
      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: 'Token inválido' });
      }

      // Busca o usuário admin pelo id do token e exclui a senha
      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        return res.status(401).json({ message: 'Não autorizado, usuário não encontrado' });
      }

      // Continua para a próxima função/middleware
      next();
    } catch (error) {
      console.error('Erro na verificação do token:', error);
      return res.status(401).json({ message: 'Não autorizado, token inválido' });
    }
  } else {
    console.log('Nenhum token fornecido no header Authorization');
    return res.status(401).json({ message: 'Não autorizado, nenhum token fornecido' });
  }
};

export { protect };
