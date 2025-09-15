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

    const pagina = await Pagina.create({
      slug,
      titulo,
      conteudo,
      midiaUrl,
    });

    console.log('✅ Página criada com sucesso no Cloudinary:', pagina._id);
    res.status(201).json(pagina);
  } catch (err) {
    console.error('❌ Erro em createPagina:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// ATUALIZAR PÁGINA (COM DIAGNÓSTICO)
// ===========================
export const updatePagina = async (req, res) => {
  // ================= INÍCIO DO DIAGNÓSTICO =================
  console.log('--- DIAGNÓSTICO DE REQUISIÇÃO (UPDATE) ---');
  console.log('Conteúdo de req.body:', JSON.stringify(req.body, null, 2));
  console.log('Conteúdo de req.file:', req.file);
  console.log('Existe req.file?', !!req.file);
  console.log('--- FIM DO DIAGNÓSTICO ---');
  // =================== FIM DO DIAGNÓSTICO ===================

  try {
    const pagina = await Pagina.findById(req.params.id);
    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }

    if (req.file) {
      pagina.midiaUrl = req.file.path;
    } else {
      if (req.body.midiaUrl !== undefined) {
        pagina.midiaUrl = req.body.midiaUrl || null;
      }
    }

    pagina.slug = req.body.slug || pagina.slug;
    pagina.titulo = req.body.titulo || pagina.titulo;
    pagina.conteudo = req.body.conteudo || pagina.conteudo;

    const paginaAtualizada = await pagina.save();
    const resposta = { ...paginaAtualizada.toObject() };

    console.log('✅ Página atualizada:', paginaAtualizada._id);
    res.json(resposta);

  } catch (err) {
    console.error('❌ Erro em updatePagina:', err.message);
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

    const dataFormatada = new Date(pagina.updatedAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const paginaComUltimaAtualizacao = {
      ...pagina.toObject(),
      ultimaAtualizacao: dataFormatada,
    };

    res.json(paginaComUltimaAtualizacao);
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
// DELETAR PÁGINA
// ===========================
export const deletePagina = async (req, res) => {
  try {
    const pagina = await Pagina.findById(req.params.id);
    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }

    await Pagina.deleteOne({ _id: req.params.id });
    console.log('🗑️ Página deletada com sucesso:', req.params.id);
    res.json({ message: 'Página removida com sucesso' });
  } catch (err) {
    console.error('❌ Erro em deletePagina:', err.message);
    res.status(500).json({ message: err.message });
  }
};
