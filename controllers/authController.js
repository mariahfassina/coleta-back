import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

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


// Exporta as duas funções para serem usadas nas rotas
export { loginAdmin, getAdmins };