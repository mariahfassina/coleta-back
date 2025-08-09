import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Função auxiliar para gerar o token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token será válido por 1 dia
  });
};

// @desc    Autenticar um admin e retornar um token
// @route   POST /api/auth/login
// @access  Público
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validação de entrada
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, forneça email e senha' });
    }

    // Procura o admin pelo email no banco de dados
    const admin = await Admin.findOne({ email }).select('+password');

    // Verifica se o admin foi encontrado e se a senha está correta
    if (admin && (await admin.matchPassword(password))) {
      // Se estiver tudo certo, retorna os dados do admin e o token gerado
      res.json({
        _id: admin._id,
        nome: admin.nome,
        email: admin.email,
        token: generateToken(admin._id),
        needsPasswordChange: admin.needsPasswordChange || false
      });
    } else {
      // Caso contrário, retorna erro de não autorizado
      res.status(401).json({ message: 'Email ou senha inválidos' });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// @desc    Trocar senha do usuário
// @route   POST /api/auth/change-password
// @access  Privado
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Validação de entrada
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Por favor, forneça a senha atual e a nova senha' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'A nova senha deve ter pelo menos 6 caracteres' });
    }

    // Busca o admin pelo ID do token
    const admin = await Admin.findById(req.admin._id.).select('+password');

    if (!admin) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verifica se a senha atual está correta
    if (!(await admin.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Senha atual incorreta' });
    }

    // Atualiza a senha
    admin.password = newPassword;
    admin.needsPasswordChange = false;
    await admin.save();

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// @desc    Obter todos os admins (Rota de Teste Protegida)
// @route   GET /api/auth/admins
// @access  Privado/Admin
const getAdmins = async (req, res) => {
  // Se a requisição chegou até aqui, o middleware 'protect' já fez a validação.
  try {
    const admins = await Admin.find({}); // Busca todos os documentos na coleção de admins
    res.json(admins);
  } catch (error) {
    console.error('Erro ao buscar admins:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Exporta as funções para serem usadas nas rotas
export { loginAdmin, getAdmins, changePassword };
