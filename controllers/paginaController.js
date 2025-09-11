// controllers/paginaController.js

import Pagina from '../models/Pagina.js';

// ===========================
// CRIAR PÁGINA
// ===========================
export const createPagina = async (req, res) => {
  try {
    console.log('📥 Recebido do CMS (createPagina):', req.body);

    const { slug, titulo, conteudo, midiaUrl } = req.body;

    // Verifica se o slug já existe
    const paginaExistente = await Pagina.findOne({ slug });
    if (paginaExistente) {
      return res.status(400).json({ message: 'Slug já existe' });
    }

    // Cria a página no MongoDB
    const pagina = await Pagina.create({
      slug,
      titulo,
      conteudo,
      midiaUrl, // garante que o midiaUrl seja salvo
    });

    console.log('✅ Página criada com sucesso:', pagina._id);
    res.status(201).json(pagina);
  } catch (err) {
    console.error('❌ Erro em createPagina:', err.message);
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
    console.error('❌ Erro em getPaginas:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// BUSCAR PÁGINA POR SLUG
// ===========================
export const getPaginaBySlug = async (req, res) => {
  try {
    const pagina = await Pagina.findOne({ slug: req.params.slug });
    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    res.json(pagina);
  } catch (err) {
    console.error('❌ Erro em getPaginaBySlug:', err.message);
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
    console.error('❌ Erro em getPaginaById:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// ATUALIZAR PÁGINA
// ===========================
export const updatePagina = async (req, res) => {
  try {
    console.log('📥 Recebido do CMS (updatePagina):', req.body);

    const pagina = await Pagina.findById(req.params.id);
    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }

    // Atualiza campos
    pagina.slug = req.body.slug || pagina.slug;
    pagina.titulo = req.body.titulo || pagina.titulo;
    pagina.conteudo = req.body.conteudo || pagina.conteudo;
    pagina.midiaUrl = req.body.midiaUrl || pagina.midiaUrl; // garante persistência

    const paginaAtualizada = await pagina.save();
    console.log('✅ Página atualizada com sucesso:', paginaAtualizada._id);
    res.json(paginaAtualizada);
  } catch (err) {
    console.error('❌ Erro em updatePagina:', err.message);
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

    await pagina.remove();
    console.log('🗑️ Página deletada com sucesso:', req.params.id);
    res.json({ message: 'Página removida com sucesso' });
  } catch (err) {
    console.error('❌ Erro em deletePagina:', err.message);
    res.status(500).json({ message: err.message });
  }
};
