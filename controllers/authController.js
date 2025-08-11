import mongoose from 'mongoose'; // ✅ IMPORTANTE: Precisamos do Mongoose aqui
import Pagina from '../models/Pagina.js';

// --- FUNÇÕES DO CONTROLLER ---

const createPagina = async (req, res) => {
    // ... (código existente, sem alterações)
};

const getPaginas = async (req, res) => {
    // ... (código existente, sem alterações)
};

const getPaginaBySlug = async (req, res) => {
    // ... (código existente, sem alterações)
};

// --- VERSÃO "À PROVA DE BALAS" ---
const getPaginaById = async (req, res) => {
  // ✅ PASSO 1: VERIFICA SE O ID É VÁLIDO ANTES DE USAR
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Página não encontrada (ID inválido).' });
  }

  try {
    const pagina = await Pagina.findById(req.params.id);
    if (pagina) {
      res.json(pagina);
    } else {
      res.status(404).json({ message: 'Página não encontrada.' });
    }
  } catch (error) {
    console.error('Erro em getPaginaById:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// --- VERSÃO "À PROVA DE BALAS" ---
const updatePagina = async (req, res) => {
    // ✅ PASSO 1: VERIFICA SE O ID É VÁLIDO ANTES DE USAR
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ message: 'Página não encontrada (ID inválido).' });
    }

    try {
        const pagina = await Pagina.findById(req.params.id);
        if (pagina) {
            pagina.titulo = req.body.titulo || pagina.titulo;
            pagina.conteudo = req.body.conteudo || pagina.conteudo;
            if(req.body.midiaUrl) {
                pagina.midiaUrl = req.body.midiaUrl;
            }
            const updatedPagina = await pagina.save();
            res.json(updatedPagina);
        } else {
            res.status(404).json({ message: 'Página não encontrada para atualizar.' });
        }
    } catch (error) {
        console.error('Erro em updatePagina:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

// --- VERSÃO "À PROVA DE BALAS" ---
const deletePagina = async (req, res) => {
    // ✅ PASSO 1: VERIFICA SE O ID É VÁLIDO ANTES DE USAR
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ message: 'Página não encontrada (ID inválido).' });
    }

    try {
        const pagina = await Pagina.findById(req.params.id);
        if (pagina) {
            await pagina.deleteOne(); 
            res.json({ message: 'Página removida com sucesso.' });
        } else {
            res.status(404).json({ message: 'Página não encontrada para deletar.' });
        }
    } catch (error) {
        console.error('Erro em deletePagina:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};


// Exporta todas as funções
export {
  createPagina,
  getPaginas,
  getPaginaBySlug,
  getPaginaById,
  updatePagina,
  deletePagina,
};
