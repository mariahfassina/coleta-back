// controllers/paginaController.js

import Pagina from '../models/Pagina.js';

// --- FUNÇÃO PARA CRIAR UMA NOVA PÁGINA ---
// @desc    Criar uma nova página de conteúdo
// @route   POST /api/paginas
// @access  Privado/Admin
const createPagina = async (req, res) => {
  try {
    const { slug, titulo, conteudo, midiaUrl } = req.body;

    if (!slug || !titulo) {
      return res.status(400).json({ message: 'Slug e título são obrigatórios.' });
    }

    const paginaExists = await Pagina.findOne({ slug });
    if (paginaExists) {
      return res.status(400).json({ message: 'Uma página com este slug já existe.' });
    }

    const pagina = await Pagina.create({
      slug,
      titulo,
      conteudo: conteudo || '',
      midiaUrl: midiaUrl || '',
    });

    res.status(201).json(pagina);
  } catch (error) {
    console.error('Erro em createPagina:', error);
    res.status(500).json({ message: 'Erro no servidor ao criar a página.' });
  }
};

// --- FUNÇÃO PARA LISTAR TODAS AS PÁGINAS (PARA O PAINEL ADMIN) ---
// @desc    Buscar todas as páginas
// @route   GET /api/paginas
// @access  Privado/Admin
const getPaginas = async (req, res) => {
  try {
    const paginas = await Pagina.find({}).sort({ titulo: 1 });
    res.json(paginas);
  } catch (error) {
    console.error('Erro em getPaginas:', error);
    res.status(500).json({ message: 'Erro no servidor ao buscar páginas.' });
  }
};


const getQuemSomos = async (req, res) => {
  try {
    const paginas = await Pagina.find({}).sort({ titulo: 1 });
    res.json(paginas);
  } catch (error) {
    console.error('Erro em getPaginas:', error);
    res.status(500).json({ message: 'Erro no servidor ao buscar páginas.' });
  }
};

// --- FUNÇÃO PARA BUSCAR UMA PÁGINA ESPECÍFICA PELO SLUG (PARA O SITE PÚBLICO) ---
// @desc    Buscar uma página específica pelo seu slug
// @route   GET /api/paginas/slug/:slug
// @access  Público
const getPaginaBySlug = async (req, res) => {
  try {
    const pagina = await Pagina.findOne({ slug: req.params.slug });

    if (pagina) {
      res.json(pagina);
    } else {
      res.status(404).json({ message: 'Página não encontrada.' });
    }
  } catch (error) {
    console.error('Erro em getPaginaBySlug:', error);
    res.status(500).json({ message: 'Erro no servidor ao buscar a página.' });
  }
};

// --- NOVA FUNÇÃO PARA BUSCAR UMA PÁGINA PELO ID (PARA O PAINEL DE EDIÇÃO) ---
// @desc    Buscar uma página específica pelo seu ID
// @route   GET /api/paginas/:id
// @access  Privado/Admin
const getPaginaById = async (req, res) => {
  try {
    const pagina = await Pagina.findById(req.params.id);

    if (pagina) {
      res.json(pagina);
    } else {
      res.status(404).json({ message: 'Página não encontrada.' });
    }
  } catch (error) {
    console.error('Erro em getPaginaById:', error);
    res.status(500).json({ message: 'Erro no servidor ao buscar a página por ID.' });
  }
};

// --- FUNÇÃO PARA ATUALIZAR UMA PÁGINA ---
// @desc    Atualizar uma página pelo seu ID
// @route   PUT /api/paginas/:id
// @access  Privado/Admin
const updatePagina = async (req, res) => {
  try {
    const { titulo, conteudo, midiaUrl } = req.body;
    const pagina = await Pagina.findById(req.params.id);

    if (pagina) {
      pagina.titulo = titulo || pagina.titulo;
      pagina.conteudo = conteudo !== undefined ? conteudo : pagina.conteudo;
      pagina.midiaUrl = midiaUrl !== undefined ? midiaUrl : pagina.midiaUrl;

      const updatedPagina = await pagina.save();
      res.json(updatedPagina);
    } else {
      res.status(404).json({ message: 'Página não encontrada para atualizar.' });
    }
  } catch (error) {
    console.error('Erro em updatePagina:', error);
    res.status(500).json({ message: 'Erro no servidor ao atualizar a página.' });
  }
};

// --- FUNÇÃO PARA DELETAR UMA PÁGINA ---
// @desc    Deletar uma página pelo seu ID
// @route   DELETE /api/paginas/:id
// @access  Privado/Admin
const deletePagina = async (req, res) => {
  try {
    const pagina = await Pagina.findById(req.params.id);

    if (pagina) {
      // Usar deleteOne() é mais moderno que remove()
      await pagina.deleteOne(); 
      res.json({ message: 'Página removida com sucesso.' });
    } else {
      res.status(404).json({ message: 'Página não encontrada para deletar.' });
    }
  } catch (error) {
    console.error('Erro em deletePagina:', error);
    res.status(500).json({ message: 'Erro no servidor ao deletar a página.' });
  }
};

// Exporta todas as funções para serem usadas no arquivo de rotas
export {
  createPagina,
  getPaginas,
  getPaginaBySlug,
  getPaginaById, // Exportando a nova função
  updatePagina,
  deletePagina,
};