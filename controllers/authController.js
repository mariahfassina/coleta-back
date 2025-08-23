import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

// ===========================
// Função auxiliar para gerar JWT
// ===========================
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.error("⚠️ ERRO: JWT_SECRET não está definido no .env!");
    return null;
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// ===========================
// Middleware para proteger rotas
// ===========================
export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select('-password');
      if (!req.admin) {
        return res.status(401).json({ message: 'Admin não encontrado' });
      }
      next();
    } catch (error) {
      console.error('Erro no middleware de auth:', error);
      return res.status(401).json({ message: 'Não autorizado' });
    }
  } else {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
};

// ===========================
// Login de admin
// ===========================
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, forneça email e senha' });
    }

    const admin = await Admin.findOne({ email }).select('+password');

    if (admin && await admin.matchPassword(password)) {
      const tokenGerado = generateToken(admin._id);

      console.log("✅ Login bem-sucedido para:", admin.email);
      console.log("🔑 Token gerado:", tokenGerado);

      if (!tokenGerado) {
        return res.status(500).json({ message: 'Falha ao gerar token' });
      }

      res.json({
        _id: admin._id,
        nome: admin.nome,
        email: admin.email,
        role: admin.role || 'admin',
        token: tokenGerado,
        needsPasswordChange: admin.needsPasswordChange || false,
      });
    } else {
      res.status(401).json({ message: 'Email ou senha inválidos' });
    }
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// ===========================
// Retorna dados do admin logado
// ===========================
const getMe = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ message: 'Não autorizado' });
    }
    res.json({
      _id: req.admin._id,
      nome: req.admin.nome,
      email: req.admin.email,
      role: req.admin.role || 'admin',
      needsPasswordChange: req.admin.needsPasswordChange || false,
    });
  } catch (error) {
    console.error('❌ Erro em /api/auth/me:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// ===========================
// Listar todos os admins
// ===========================
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}).select('-password');
    res.json(admins);
  } catch (error) {
    console.error('❌ Erro ao buscar admins:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

export { loginAdmin, getAdmins, getMe };
