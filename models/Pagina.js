// models/Pagina.js

import mongoose from 'mongoose';

// Este é o "molde" para todas as páginas de conteúdo do seu site.
const paginaSchema = new mongoose.Schema(
  {
    // Identificador único para a URL (ex: "quem-somos", "contato").
    // É como o React vai saber qual página buscar.
    slug: {
      type: String,
      required: [true, 'O slug é obrigatório (ex: "quem-somos")'],
      unique: true,
      trim: true, // Remove espaços em branco do início e fim
    },
    // O título que aparecerá no topo da página.
    titulo: {
      type: String,
      required: [true, 'O título da página é obrigatório'],
    },
    // O corpo principal da página.
    // O frontend enviará o HTML gerado por um editor de texto para cá.
    conteudo: {
      type: String,
      required: [true, 'O conteúdo da página é obrigatório'],
    },
    // Opcional: para o caminho da imagem de destaque ou URL de vídeo.
    midiaUrl: {
      type: String,
    },
  },
  {
    // Adiciona automaticamente os campos `createdAt` e `updatedAt`.
    timestamps: true,
  }
);

// Cria o Model 'Pagina' que será usado para interagir com a coleção 'paginas' no MongoDB.
const Pagina = mongoose.model('Pagina', paginaSchema);

// A linha mais importante: exporta o Model para que outros arquivos (como o seeder) possam usá-lo.
export default Pagina;