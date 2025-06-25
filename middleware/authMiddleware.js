import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Middleware para proteger rotas
const protect = async (req, res, next) => {
  let token;

  // 1. Verifica se o cabeçalho de autorização existe e se começa com "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extrai apenas o token do cabeçalho (formato: "Bearer TOKEN_AQUI")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verifica e decodifica o token usando o seu segredo do .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Usa o ID do token decodificado para buscar o admin no banco de dados.
      // O '-password' garante que a senha criptografada não seja anexada ao objeto da requisição.
      req.admin = await Admin.findById(decoded.id).select('-password');

      // Se o admin não for encontrado (ex: usuário deletado), bloqueia o acesso
      if (!req.admin) {
        return res.status(401).json({ message: 'Não autorizado, usuário não encontrado' });
      }

      // 5. Se o token for válido e o usuário existir, permite que a requisição continue para o controller.
      next();
    } catch (error) {
      console.error('Erro na verificação do token:', error);
      return res.status(401).json({ message: 'Não autorizado, token falhou' });
    }
  }

  // Se não houver nenhum token no cabeçalho da requisição
  if (!token) {
    return res.status(401).json({ message: 'Não autorizado, nenhum token fornecido' });
  }
};

export { protect };