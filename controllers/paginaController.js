import Pagina from '../models/Pagina.js';

// ===========================
// CRIAR PÁGINA
// ===========================
export const createPagina = async (req, res) => {
  try {
    const { slug, titulo, conteudo } = req.body;

    // A URL da imagem agora vem de req.file.path, fornecida pelo Cloudinary
    const midiaUrl = req.file ? req.file.path : null;

    // Verifica se o slug já existe
    const paginaExistente = await Pagina.findOne({ slug });
    if (paginaExistente) {
      return res.status(400).json({ message: 'Slug já existe' });
    }

    // Cria a página no MongoDB com a URL do Cloudinary
    const pagina = await Pagina.create({
      slug,
      titulo,
      conteudo,
      midiaUrl, // Salva a URL segura do Cloudinary
    });

    console.log('✅ Página criada com sucesso no Cloudinary:', pagina._id);
    res.status(201).json(pagina);
  } catch (err) {
    console.error('❌ Erro em createPagina:', err.message);
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

    // Lógica para atualizar a imagem:
    // Se um novo arquivo foi enviado (req.file existe), use a nova URL do Cloudinary.
    // Se não, mantenha a URL que já estava salva (req.body.midiaUrl).
    let midiaUrl = pagina.midiaUrl; // Começa com o valor antigo
    if (req.file) {
      midiaUrl = req.file.path; // Se houver novo upload, usa a nova URL
    } else if (req.body.midiaUrl === '') {
      midiaUrl = null; // Permite remover a imagem se o campo for enviado vazio
    }

    // Atualiza os campos da página
    pagina.slug = req.body.slug || pagina.slug;
    pagina.titulo = req.body.titulo || pagina.titulo;
    pagina.conteudo = req.body.conteudo || pagina.conteudo;
    pagina.midiaUrl = midiaUrl; // Atualiza com a URL correta

    const paginaAtualizada = await pagina.save();
    console.log('✅ Página atualizada com sucesso:', paginaAtualizada._id);
    res.json(paginaAtualizada);
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

    // Opcional: Deletar a imagem do Cloudinary também (código avançado, não incluído por padrão)

    await Pagina.deleteOne({ _id: req.params.id });
    console.log('🗑️ Página deletada com sucesso:', req.params.id);
    res.json({ message: 'Página removida com sucesso' });
  } catch (err) {
    console.error('❌ Erro em deletePagina:', err.message);
    res.status(500).json({ message: err.message });
  }
};
