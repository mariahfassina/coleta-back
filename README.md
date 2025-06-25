Backend da API - Site Coleta Seletiva (PFC)
Este repositório contém o código-fonte do backend para o site da Coleta Seletiva de Assis Chateaubriand. A aplicação foi desenvolvida em Node.js com Express.js e utiliza um banco de dados MongoDB para gerenciar todo o conteúdo do site de forma dinâmica.
O objetivo desta API é fornecer endpoints seguros e funcionais para que o frontend (desenvolvido em React) possa consumir os dados e para que os administradores possam gerenciar o conteúdo através de um painel.
Desenvolvedora Backend: Mariah
Tecnologias Utilizadas
Node.js: Ambiente de execução para JavaScript no servidor.
Express.js: Framework para criação do servidor e das rotas da API.
MongoDB (com Atlas): Banco de dados NoSQL na nuvem para armazenar todos os dados da aplicação.
Mongoose: Biblioteca para modelar os dados da aplicação e interagir com o MongoDB.
JSON Web Tokens (JWT): Para autenticação e proteção das rotas administrativas.
bcryptjs: Para criptografia segura de senhas.
Multer: Middleware para lidar com o upload de arquivos (imagens).
Dotenv: Para gerenciamento de variáveis de ambiente.
CORS: Para permitir requisições do frontend.
Estrutura do Projeto
O projeto segue uma arquitetura modular para separação de responsabilidades:
config/: Contém a configuração de conexão com o banco de dados.
controllers/: Contém a lógica de negócio da aplicação (o que cada rota faz).
middleware/: Contém os "seguranças" da API, como o verificador de token.
models/: Define os "moldes" (Schemas) de como os dados são estruturados no MongoDB.
routes/: Mapeia as URLs (endpoints) para as funções dos controllers.
uploads/: Pasta onde as imagens enviadas pelo painel de admin são armazenadas.
Como Rodar o Projeto Localmente
Para rodar este backend no seu ambiente de desenvolvimento, siga os passos abaixo:
Clone o repositório:
Generated bash
git clone https://github.com/mariahfassina/coleta-back.git
cd coleta-back
Use code with caution.
Bash
Instale as dependências:
Generated bash
npm install
Use code with caution.
Bash
Crie e configure o arquivo .env:
Crie um arquivo chamado .env na raiz do projeto e adicione as seguintes variáveis:
Generated code
# String de conexão do seu cluster no MongoDB Atlas
MONGO_URI=mongodb+srv://...

# Chave secreta para gerar os tokens JWT (pode ser qualquer string longa e aleatória)
JWT_SECRET=meu-segredo-super-secreto-123

# Porta em que o servidor irá rodar
PORT=5000
Use code with caution.
Popule o banco de dados com dados iniciais:
Este comando irá criar o usuário administrador padrão e as páginas de conteúdo iniciais.
Generated bash
npm run data:import
Use code with caution.
Bash
Inicie o servidor em modo de desenvolvimento:
O servidor irá reiniciar automaticamente a cada alteração de arquivo.
Generated bash
npm run dev
Use code with caution.
Bash
O servidor estará rodando em http://localhost:5000.
Documentação da API (Contrato com o Frontend)
URL Base (Produção): https://pfc-coleta-api.onrender.com
URL Base (Desenvolvimento): http://localhost:5000
Autenticação
Login do Administrador
Endpoint: POST /api/auth/login
Descrição: Autentica um administrador e retorna um token JWT.
Acesso: Público
Corpo (Body) da Requisição (JSON):
Generated json
{
  "email": "diretoria@assis.gov.br",
  "password": "senha123"
}
Use code with caution.
Json
Resposta de Sucesso (200 OK):
Generated json
{
  "_id": "...",
  "nome": "Diretoria Meio Ambiente",
  "email": "diretoria@assis.gov.br",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
Use code with caution.
Json
Páginas de Conteúdo
Buscar uma Página Específica
Endpoint: GET /api/paginas/:slug
Descrição: Retorna o conteúdo completo de uma página, identificado pelo seu slug. Usado para renderizar o conteúdo em todas as páginas públicas.
Acesso: Público
Parâmetros de URL:
:slug (String): O identificador da página (ex: quem-somos, contato, home-cronograma).
Resposta de Sucesso (200 OK):
Generated json
{
    "_id": "...",
    "slug": "quem-somos",
    "titulo": "Sobre o Programa e a ACAMAR",
    "conteudo": "<h1>O que é o Programa...</h1>...",
    "midiaUrl": "/uploads/foto-acamar-uvr.jpg"
}
Use code with caution.
Json
Listar todas as Páginas (Painel Admin)
Endpoint: GET /api/paginas
Descrição: Retorna uma lista de todas as páginas gerenciáveis.
Acesso: Privado (Requer Authorization: Bearer <token>)
Atualizar uma Página
Endpoint: PUT /api/paginas/:id
Descrição: Atualiza o conteúdo de uma página existente.
Acesso: Privado (Requer Authorization: Bearer <token>)
Parâmetros de URL:
:id (String): O _id da página no MongoDB.
Corpo (Body) da Requisição (JSON):
Generated json
{
  "titulo": "Novo Título da Página",
  "conteudo": "<p>Novo conteúdo em HTML.</p>",
  "midiaUrl": "/uploads/nova-imagem.png"
}
Use code with caution.
Json
Upload de Imagens
Enviar uma Imagem
Endpoint: POST /api/upload
Descrição: Faz o upload de um arquivo de imagem. O painel de admin deve usar esta rota primeiro, pegar o caminho retornado e depois usá-lo para atualizar a midiaUrl de uma página.
Acesso: Privado (Requer Authorization: Bearer <token>)
Corpo (Body) da Requisição: form-data
Campo: image
Tipo: File
Resposta de Sucesso (200 OK):
Generated json
{
    "message": "Imagem enviada com sucesso",
    "image": "/uploads/nome-da-imagem-12345.png"
}
Use code with caution.
Json
Observação para o Frontend: A URL base da API para desenvolvimento é http://localhost:5000. Para a versão final publicada, a URL será a fornecida pelo Render. Todas as imagens salvas terão seus caminhos retornados relativos à URL base (ex: https://pfc-coleta-api.onrender.com/uploads/imagem.png).
