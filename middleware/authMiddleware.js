import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verifica e decodifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log('Token decodificado:', decoded);

      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: 'Token inválido' });
      }

      // Busca o admin pelo id do token
      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        return res.status(401).json({ message: 'Não autorizado, usuário não encontrado' });
      }

      next();
    } catch (error) {
      console.error('Erro na verificação do token:', error);
      return res.status(401).json({ message: 'Não autorizado, token inválido' });
    }
  } else {
    return res.status(401).json({ message: 'Não autorizado, nenhum token fornecido' });
  }
};

export { protect };

