// controllers/paginaController.js

import mongoose from 'mongoose';
import Pagina from '../models/Pagina.js';

// --- FUNÇÃO PARA CRIAR UMA NOVA PÁGINA ---
const createPagina = async (req, res) => {
  try {
    const { slug, titulo, conteudo, midiaUrl } = req.body;

    if (!slug || !titulo) {
      return res.status(400).json({ message: 'Slug e título são obrigatórios.' });
    }

    const slugFormatado = slug.trim().toLowerCase();

    const paginaExists = await Pagina.findOne({ slug: slugFormatado });
    if (paginaExists) {
      return res.status(400).json({ message: 'Uma página com este slug já existe.' });
    }

    const pagina = await Pagina.create({
      slug: slugFormatado,
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
const getPaginas = async (req, res) => {
  try {
    const paginas = await Pagina.find({}).sort({ titulo: 1 });
    res.json(paginas);
  } catch (error) {
    console.error('Erro em getPaginas:', error);
    res.status(500).json({ message: 'Erro no servidor ao buscar páginas.' });
  }
};

// --- FUNÇÃO PARA BUSCAR UMA PÁGINA ESPECÍFICA PELO SLUG (PARA O SITE PÚBLICO) ---
const getPaginaBySlug = async (req, res) => {
  try {
    const slugParam = req.params.slug.trim().toLowerCase();
    const pagina = await Pagina.findOne({ slug: slugParam });

    if (pagina) {
      res.json(pagina);
    } else {
      res.status(404).json({ message: `Página com slug "${slugParam}" não encontrada.` });
    }
  } catch (error) {
    console.error('Erro em getPaginaBySlug:', error);
    res.status(500).json({ message: 'Erro no servidor ao buscar a página.' });
  }
};

// --- FUNÇÃO PARA BUSCAR UMA PÁGINA PELO ID (PARA O PAINEL DE EDIÇÃO) ---
const getPaginaById = async (req, res) => {
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

// --- FUNÇÃO PARA ATUALIZAR UMA PÁGINA ---
const updatePagina = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Página não encontrada (ID inválido).' });
  }

  try {
    const pagina = await Pagina.findById(req.params.id);
    if (pagina) {
      if (req.body.slug) {
        pagina.slug = req.body.slug.trim().toLowerCase();
      }
      pagina.titulo = req.body.titulo || pagina.titulo;
      pagina.conteudo = req.body.conteudo !== undefined ? req.body.conteudo : pagina.conteudo;
      
      if (req.body.midiaUrl) {
        pagina.midiaUrl = req.body.midiaUrl;
      } else if (req.body.midiaUrl === '') {
        // Se enviar uma string vazia, mantém a URL existente
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

// --- FUNÇÃO PARA DELETAR UMA PÁGINA ---
const deletePagina = async (req, res) => {
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

export {
  createPagina,
  getPaginas,
  getPaginaBySlug,
  getPaginaById,
  updatePagina,
  deletePagina,
};
