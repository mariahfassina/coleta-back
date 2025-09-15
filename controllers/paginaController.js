import Pagina from '../models/Pagina.js';

// ===========================
// FUNÇÃO DE NORMALIZAÇÃO DE SLUG
// ===========================
// Esta função centraliza a lógica de limpeza de slugs para ser usada em buscas.
const normalizeSlug = (slug) => {
  if (!slug) return '';
  // Normaliza para o formato de composição Unicode (NFC), remove caracteres invisíveis
  // e espaços em branco no início/fim.
  return slug
    .normalize('NFC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove caracteres de largura zero (invisíveis)
    .trim();
};


// ===========================
// BUSCAR PÁGINA POR SLUG (PUBLIC) - VERSÃO CORRIGIDA
// ===========================
export const getPaginaBySlug = async (req, res) => {
  try {
    // 1. Normaliza o slug recebido na URL para garantir que ele esteja "limpo".
    const slugParam = normalizeSlug(req.params.slug);

    if (!slugParam) {
      return res.status(400).json({ message: 'Slug inválido fornecido.' });
    }

    // 2. Usa o pipeline de agregação do MongoDB para uma busca mais inteligente.
    const paginas = await Pagina.aggregate([
      {
        // 3. Cria um campo temporário 'normalizedSlug' para cada documento durante a consulta.
        $addFields: {
          normalizedSlug: {
            // Aplica as mesmas transformações no slug que está no banco de dados.
            // $trim remove espaços, e $toLower garante que a comparação não diferencia maiúsculas/minúsculas.
            $toLower: {
              $trim: {
                input: '$slug'
              }
            }
          }
        }
      },
      {
        // 4. Filtra os documentos onde o slug normalizado do banco corresponde ao slug normalizado da URL.
        $match: {
          normalizedSlug: slugParam.toLowerCase()
        }
      }
    ]);

    // 5. Pega o primeiro (e único) resultado da agregação.
    const pagina = paginas[0];

    if (!pagina) {
      // Adiciona um log no servidor para ajudar a depurar futuras falhas.
      console.error(`[LOG] Página não encontrada para o slug normalizado: "${slugParam.toLowerCase()}"`);
      return res.status(404).json({ message: 'Página não encontrada' });
    }

    // Remove o campo temporário antes de enviar a resposta para o front-end.
    delete pagina.normalizedSlug;

    // Formata a data como no seu código original.
    const dataFormatada = new Date(pagina.updatedAt).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    const resposta = { ...pagina, ultimaAtualizacao: dataFormatada };
    res.json(resposta);

  } catch (err) {
    console.error("[ERRO] Falha no servidor ao buscar página por slug:", err);
    res.status(500).json({ message: err.message });
  }
};


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
