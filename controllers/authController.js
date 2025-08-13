import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

// Função auxiliar para gerar o token JWT
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.error("⚠️ ERRO: JWT_SECRET não está definido no .env!");
    return null;
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token válido por 1 dia
  });
};

// @desc    Autenticar um admin e retornar um token
// @route   POST /api/auth/login
// @access  Público
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, forneça email e senha' });
    }

    // Busca o admin pelo email (incluindo o campo senha)
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
        token: tokenGerado,
        needsPasswordChange: admin.needsPasswordChange || false,
      });
    } else {
      console.warn("⚠️ Tentativa de login inválida para:", email);
      res.status(401).json({ message: 'Email ou senha inválidos' });
    }
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// @desc    Obter todos os admins (Rota protegida)
// @route   GET /api/auth/admins
// @access  Privado/Admin
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.json(admins);
  } catch (error) {
    console.error('❌ Erro ao buscar admins:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

export { loginAdmin, getAdmins };
