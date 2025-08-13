import Pagina from '../models/Pagina.js';

// Listar todas as páginas (público ou admin)
export const getPaginasPublic = async (req, res) => {
  try {
    const paginas = await Pagina.find({});
    res.json(paginas);
  } catch (error) {
    console.error('Erro ao buscar páginas:', error);
    res.status(500).json({ message: 'Erro ao buscar páginas' });
  }
};

export const getPaginas = async (req, res) => {
  try {
    const paginas = await Pagina.find({});
    res.json(paginas);
  } catch (error) {
    console.error('Erro ao buscar páginas:', error);
    res.status(500).json({ message: 'Erro ao buscar páginas' });
  }
};

// Buscar página por slug
export const getPaginaBySlug = async (req, res) => {
  try {
    const pagina = await Pagina.findOne({ slug: req.params.slug });
    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    
    // Adicionar timestamp formatado para o cronograma ou home-cronograma
    const paginaResponse = pagina.toObject();
    if ((req.params.slug === 'cronograma' || req.params.slug === 'home-cronograma') && pagina.updatedAt) {
      const dataAtualizacao = new Date(pagina.updatedAt);
      paginaResponse.ultimaAtualizacao = dataAtualizacao.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    
    res.json(paginaResponse);
  } catch (error) {
    console.error('Erro ao buscar página por slug:', error);
    res.status(500).json({ message: 'Erro ao buscar página' });
  }
};

// Criar uma nova página
export const createPagina = async (req, res) => {
  const { slug, titulo, conteudo, midiaUrl } = req.body;

  if (!slug || !titulo || !conteudo) {
    return res.status(400).json({ message: 'Slug, título e conteúdo são obrigatórios' });
  }

  try {
    // Verifica se o slug já existe
    const paginaExiste = await Pagina.findOne({ slug });
    if (paginaExiste) {
      return res.status(400).json({ message: 'Slug já está em uso' });
    }

    const novaPagina = new Pagina({
      slug,
      titulo,
      conteudo,
      midiaUrl: midiaUrl || '',
    });

    const paginaCriada = await novaPagina.save();
    res.status(201).json(paginaCriada);
  } catch (error) {
    console.error('Erro ao criar página:', error);
    res.status(500).json({ message: 'Erro ao criar página' });
  }
};

// Buscar página por ID
export const getPaginaById = async (req, res) => {
  try {
    const pagina = await Pagina.findById(req.params.id);
    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    res.json(pagina);
  } catch (error) {
    console.error('Erro ao buscar página por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar página' });
  }
};

// Atualizar página por ID
export const updatePagina = async (req, res) => {
  try {
    const pagina = await Pagina.findById(req.params.id);

    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }

    const { slug, titulo, conteudo, midiaUrl } = req.body;

    if (slug) pagina.slug = slug;
    if (titulo) pagina.titulo = titulo;
    if (conteudo) pagina.conteudo = conteudo;
    if (midiaUrl !== undefined) pagina.midiaUrl = midiaUrl;

    const paginaAtualizada = await pagina.save();
    res.json(paginaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar página:', error);
    res.status(500).json({ message: 'Erro ao atualizar página' });
  }
};

// Deletar página por ID
export const deletePagina = async (req, res) => {
  try {
    const pagina = await Pagina.findById(req.params.id);

    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }

    await pagina.remove();
    res.json({ message: 'Página deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar página:', error);
    res.status(500).json({ message: 'Erro ao deletar página' });
  }
};

