import Pagina from '../models/Pagina.js';

// Função para listar todas as páginas publicamente
export const getPaginasPublic = async (req, res) => {
  try {
    const paginas = await Pagina.find({});
    res.json(paginas);
  } catch (error) {
    console.error('Erro ao buscar páginas:', error);
    res.status(500).json({ message: 'Erro ao buscar páginas' });
  }
};

// Função para listar todas as páginas (exemplo rota privada)
export const getPaginas = async (req, res) => {
  try {
    const paginas = await Pagina.find({});
    res.json(paginas);
  } catch (error) {
    console.error('Erro ao buscar páginas:', error);
    res.status(500).json({ message: 'Erro ao buscar páginas' });
  }
};

// Função para buscar página por slug
export const getPaginaBySlug = async (req, res) => {
  try {
    const pagina = await Pagina.findOne({ slug: req.params.slug });
    if (!pagina) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    res.json(pagina);
  } catch (error) {
    console.error('Erro ao buscar página por slug:', error);
    res.status(500).json({ message: 'Erro ao buscar página' });
  }
};

// Outras funções (createPagina, getPaginaById, updatePagina, deletePagina) aqui...

