// seeder.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import Pagina from './models/Pagina.js';

// Carrega as variáveis de ambiente
dotenv.config();

// Conecta ao banco de dados
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Conectado para o Seeder...');
  } catch (error) {
    console.error(`Erro na conexão do Seeder: ${error.message}`);
    process.exit(1);
  }
};

// Dados iniciais
const adminUser = {
  nome: 'Diretoria Meio Ambiente',
  email: 'diretoria@assis.gov.br',
  password: 'senha123', // Senha para o primeiro login
};

const paginasData = [
  // --- Páginas de Conteúdo Principal ---
  {
    slug: 'como-fazer-separacao',
    titulo: 'Como fazer a separação?',
    conteudo: `
      <p class="texto-destaque">É muito fácil!</p>
      <p>Separe os resíduos recicláveis, considerando o que for de papel, plástico, vidro e metal.</p>
      <p>Enxágue as embalagens e as coloque no saco de ráfia ou reaproveite sacolas e caixas de papelão. Depois, coloque na frente de sua casa/comércio, mas lembrando, é necessário que seja nos dias e períodos específicos, para o caminhão da <strong>“Coleta Amiga”</strong> passar recolhendo esses materiais, que são encaminhados para a Unidade de Valorização de Recicláveis do município.</p>
    `,
    midiaUrl: 'https://www.youtube.com/embed/n9DEAh9c6vI' // Link do vídeo do YouTube
  },
  {
    slug: 'porque-separar',
    titulo: 'POR QUE SEPARAR OS RESÍDUOS RECICLÁVEIS DOS ORGÂNICOS E REJEITOS?',
    conteudo: `
      <p>A separação poupa a natureza e traz mais qualidade de vida. O plástico usado, por exemplo, quando reciclado se transforma em plástico novo. Isso também acontece com o papel, vidro e metal. Para se ter uma ideia, cada 50 quilos de papel usado transformado em novo, evita que uma árvore seja cortada. Imagine quantas árvores nós podemos salvar!</p>
      <p>O descarte correto de resíduos e rejeitos também é muito importante para evitar diversos tipos de prejuízo ao meio ambiente e até mesmo a nossa saúde, além de contribuir para a economia de recursos naturais, como água e a energia.</p>
    `,
    midiaUrl: 'https://www.youtube.com/embed/0_PEVu_2omA'
  },
  {
    slug: 'quais-residuos',
    titulo: 'Quais são os resíduos recicláveis?',
    conteudo: `
      <ul>
        <li><strong>Papéis:</strong> papelão, embalagens cartonadas, caixas de ovos, cadernos usados, caixas de leite longa vida, jornais, revistas, entre outros.</li>
        <li><strong>Plásticos:</strong> garrafa pet, embalagens de detergente, amaciante, óleo de cozinha, álcool, tampas de plástico, pacotes em gerais, frascos de xampu, potinhos de iogurte, sacolas de supermercados, copos descartáveis, balde, PVC, entre outros.</li>
        <li><strong>Vidros:</strong> garrafas de bebida, potes de conserva, frascos de perfume, potes de geleia, entre outros.</li>
        <li><strong>Metais:</strong> latinhas de cerveja e refrigerante, latas de doces, leite em pó, azeite, latinhas de sardinha, arames, embalagens metálicas, latinhas de milho e ervilha, entre outros.</li>
      </ul>
    `,
    midiaUrl: '' // Sem mídia para esta página
  },
  {
    slug: 'quem-somos',
    titulo: 'Sobre o Programa e a ACAMAR',
    conteudo: `
      <h2>O que é o Programa Coleta Amiga?</h2>
      <p>O Programa Coleta Amiga foi instituído através da <a href="http://leismunicipa.is/dnozx" target="_blank" rel="noopener noreferrer">Lei Municipal n° 3250 em 03 de maio de 2022</a>. Seus principais objetivos são:</p>
      <ul>
        <li>Regularizar a Coleta Seletiva de Resíduos Sólidos Recicláveis do Município;</li>
        <li>Valorizar os constantes investimentos realizados na Unidade de Valorização de Recicláveis – UVR;</li>
        <li>Desenvolver medidas em defesa do Meio Ambiente, articulando-as com planos e políticas em níveis nacional, estadual e municipal;</li>
        <li>Estimular a geração de emprego e receita, em especial, para famílias de baixa renda.</li>
      </ul>
      <hr/>
      <h2>O que é a ACAMAR?</h2>
      <p>A ACAMAR é a <strong>Associação dos Catadores de Materiais Recicláveis de Assis Chateaubriand - PR</strong>, fundada em 10 de outubro de 2001. Ela é considerada uma Entidade de Utilidade Pública, conforme a <a href="http://leismunicipa.is/htnfz" target="_blank" rel="noopener noreferrer">Lei Municipal n° 3.217 de 23 de abril de 2020</a>.</p>
      <hr/>
      <h2>Qual o local de destino dos recicláveis?</h2>
      <p>Todo material previamente separado pela população e recolhido com auxílio dos caminhões da Coleta Amiga é encaminhado para a <strong>Unidade de Valorização de Recicláveis (UVR)</strong>.</p>
    `,
    midiaUrl: '/uploads/foto-acamar-uvr.jpg' // Caminho inicial da imagem, que será upada depois
  },
  {
    slug: 'contato',
    titulo: 'Entre em Contato',
    conteudo: `
      <p>Tem dúvidas sobre a coleta seletiva, horários, separação de materiais ou gostaria de fazer uma sugestão ou reclamação? Utilize os canais abaixo:</p>
      <div style="margin-top: 30px; line-height: 2;">
          <h3>Secretaria de Meio Ambiente / Coleta Amiga:</h3>
          <p><strong>Telefone:</strong> (44) 3528-XXXX</p>
          <p><strong>Email:</strong> meioambiente@assischateaubriand.pr.gov.br</p>
          <h3>ACAMAR (Associação de Catadores):</h3>
          <p><strong>Telefone:</strong> (44) XXXX-XXXX</p>
          <p><strong>Instagram:</strong> <a href="https://www.instagram.com/uvr_assis/" target="_blank">@uvr_assis</a></p>
      </div>
    `,
    midiaUrl: ''
  },
  // --- Seções Especiais tratadas como Páginas ---
  {
    slug: 'home-hero',
    titulo: 'Banner da Página Inicial',
    conteudo: 'Imagem principal do caminhão da coleta.',
    midiaUrl: '/uploads/caminhao-coleta.jpg' // Caminho da imagem que será upada
  },
  {
    slug: 'home-cronograma',
    titulo: 'Imagem do Cronograma',
    conteudo: 'Imagem exibida na seção de cronograma da página inicial.',
    midiaUrl: '/uploads/cronograma-atual.png' // Caminho da imagem que será upada
  },
  {
    slug: 'total-coletado-grafico',
    titulo: 'Gráfico do Total Coletado',
    conteudo: 'Imagem do gráfico de evolução da coleta.',
    midiaUrl: '/uploads/grafico-total-coletado.png' // Caminho da imagem que será upada
  },
];

// Função para importar os dados
const importData = async () => {
  try {
    // Apaga dados antigos para evitar duplicatas
    await Admin.deleteMany();
    await Pagina.deleteMany();

    // Insere os novos dados
    await Admin.create(adminUser);
    await Pagina.create(paginasData);

    console.log('✅ Dados importados com sucesso!');
    process.exit();
  } catch (error) {
    console.error(`❌ Erro ao importar dados: ${error}`);
    process.exit(1);
  }
};

// Função para destruir os dados
const destroyData = async () => {
  try {
    await Admin.deleteMany();
    await Pagina.deleteMany();
    
    console.log('Dados destruídos com sucesso!');
    process.exit();
  } catch (error) {
    console.error(`❌ Erro ao destruir dados: ${error}`);
    process.exit(1);
  }
};

// Conecta ao DB e decide qual função rodar
const run = async () => {
  await connectDB();
  if (process.argv[2] === '-d') {
    await destroyData();
  } else {
    await importData();
  }
};

run();