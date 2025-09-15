import Pagina from '../models/Pagina.js';

// ===========================
// CRIAR PÁGINA
// ===========================
export const createPagina = async (req, res) => {
  try {
    const { slug, titulo, conteudo } = req.body;
    const midiaUrl = req.file ? req.file.path : null;

    const paginaExistente = await Pagina.findOne({ slug });
    if (paginaExistente) {
      return res.status(400).json({ message: 'Slug já existe' });
    }

    const pagina = await Pagina.create({ slug, titulo, conteudo, midiaUrl });
    res.status(201).json(pagina);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// ATUALIZAR PÁGINA
// ===========================
export const updatePagina = async (req, res) => {
  try {
    const pagina = await Pagina.findById(req.params.id);
    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }

    if (req.file) {
      pagina.midiaUrl = req.file.path;
    } else if (req.body.midiaUrl !== undefined) {
      pagina.midiaUrl = req.body.midiaUrl || null;
    }

    pagina.slug = req.body.slug || pagina.slug;
    pagina.titulo = req.body.titulo || pagina.titulo;
    pagina.conteudo = req.body.conteudo || pagina.conteudo;

    const paginaAtualizada = await pagina.save();
    res.json(paginaAtualizada);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// LISTAR TODAS AS PÁGINAS (ADMIN)
// ===========================
export const getPaginas = async (req, res) => {
  try {
    const paginas = await Pagina.find().sort({ createdAt: -1 });
    res.json(paginas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// BUSCAR PÁGINA POR SLUG (PUBLIC)
// ===========================
export const getPaginaBySlug = async (req, res) => {
  try {
    const slugParam = req.params.slug.trim().toLowerCase();
    const pagina = await Pagina.findOne({ slug: { $regex: `^${slugParam}$`, $options: 'i' } });

    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }

    const dataFormatada = new Date(pagina.updatedAt).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    const resposta = { ...pagina.toObject(), ultimaAtualizacao: dataFormatada };
    res.json(resposta);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// BUSCAR PÁGINA POR ID (ADMIN)
// ===========================
export const getPaginaById = async (req, res) => {
  try {
    const pagina = await Pagina.findById(req.params.id);
    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    res.json(pagina);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// DELETAR PÁGINA
// ===========================
export const deletePagina = async (req, res) => {
  try {
    const pagina = await Pagina.findById(req.params.id);
    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    await Pagina.deleteOne({ _id: req.params.id });
    res.json({ message: 'Página removida com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// FUNÇÃO DE DIAGNÓSTICO (TEMPORÁRIA)
// ===========================
export const getAllSlugs = async (req, res) => {
  try {
    const paginas = await Pagina.find().select('slug titulo');
    res.json(paginas);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar slugs', error: err.message });
  }
};
