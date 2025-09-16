import mongoose from 'mongoose';

const paginaSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'O slug é obrigatório (ex: "quem-somos")'],
      unique: true,
      trim: true,
    },
    titulo: {
      type: String,
      required: [true, 'O título da página é obrigatório'],
    },
    conteudo: {
      type: String,
      required: [true, 'O conteúdo da página é obrigatório'],
    },
    midiaUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Pagina = mongoose.model('Pagina', paginaSchema);

export default Pagina;
