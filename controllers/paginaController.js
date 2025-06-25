import Pagina from '../models/Pagina.js';

// @desc    Criar uma nova página de conteúdo
// @route   POST /api/paginas
// @access  Privado/Admin
const createPagina = async (req, res) => {
  try {
    const { slug, titulo, conteudo, midiaUrl } = req.body;

    // Verifica se uma página com o mesmo slug já existe
    const paginaExists = await Pagina.findOne({ slug });

    if (paginaExists) {
      return res.status(400).json({ message: 'Uma página com este slug já existe' });
    }

    const pagina = await Pagina.create({
      slug,
      titulo,
      conteudo,
      midiaUrl,
    });

    res.status(201).json(pagina);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar a página', error: error.message });
  }
};

// @desc    Buscar todas as páginas (para o painel de admin)
// @route   GET /api/paginas
// @access  Privado/Admin
const getPaginas = async (req, res) => {
  try {
    const paginas = await Pagina.find({});
    res.json(paginas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar páginas', error: error.message });
  }
};

// @desc    Buscar uma página específica pelo seu slug (para o site público)
// @route   GET /api/paginas/:slug
// @access  Público
const getPaginaBySlug = async (req, res) => {
  try {
    const pagina = await Pagina.findOne({ slug: req.params.slug });

    if (pagina) {
      res.json(pagina);
    } else {
      res.status(404).json({ message: 'Página não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar a página', error: error.message });
  }
};

// @desc    Atualizar uma página
// @route   PUT /api/paginas/:id
// @access  Privado/Admin
const updatePagina = async (req, res) => {
  try {
    const { titulo, conteudo, midiaUrl } = req.body;

    const pagina = await Pagina.findById(req.params.id);

    if (pagina) {
      pagina.titulo = titulo || pagina.titulo;
      pagina.conteudo = conteudo || pagina.conteudo;
      // Permite que a midiaUrl seja atualizada para um novo valor ou removida (string vazia)
      pagina.midiaUrl = midiaUrl !== undefined ? midiaUrl : pagina.midiaUrl;

      const updatedPagina = await pagina.save();
      res.json(updatedPagina);
    } else {
      res.status(404).json({ message: 'Página não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar a página', error: error.message });
  }
};

// @desc    Deletar uma página
// @route   DELETE /api/paginas/:id
// @access  Privado/Admin
const deletePagina = async (req, res) => {
  try {
    const pagina = await Pagina.findById(req.params.id);

    if (pagina) {
      await pagina.remove();
      res.json({ message: 'Página removida com sucesso' });
    } else {
      res.status(404).json({ message: 'Página não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar a página', error: error.message });
  }
};


export {
  createPagina,
  getPaginas,
  getPaginaBySlug,
  updatePagina,
  deletePagina,
};