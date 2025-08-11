import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

// Gera token JWT com id do admin
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Login do admin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Por favor, forneça email e senha' });
  }

  try {
    const admin = await Admin.findOne({ email }).select('+password');

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        nome: admin.nome,
        email: admin.email,
        token: generateToken(admin._id),
        needsPasswordChange: admin.needsPasswordChange || false,
      });
    } else {
      res.status(401).json({ message: 'Email ou senha inválidos' });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Alterar senha do admin autenticado
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Por favor, forneça a senha atual e a nova senha' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'A nova senha deve ter pelo menos 6 caracteres' });
  }

  try {
    // req.admin vem do middleware de autenticação
    const admin = await Admin.findById(req.admin._id).select('+password');

    if (!admin) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verifica se a senha atual confere
    if (!(await admin.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Senha atual incorreta' });
    }

    // Atualiza senha e reseta flag
    admin.password = newPassword;
    admin.needsPasswordChange = false;

    await admin.save();

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Listar todos os admins (exemplo)
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.json(admins);
  } catch (error) {
    console.error('Erro ao buscar admins:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

export { loginAdmin, changePassword, getAdmins };
