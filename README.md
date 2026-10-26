Projeto Ecopontos - Curitiba

Um sistema inteligente para facilitar o descarte correto de resíduos em Curitiba. O projeto integra um mapa interativo com um assistente virtual baseado em Inteligência Artificial (Google Gemini), capaz de orientar o usuário sobre como preparar o lixo e indicar o ecoponto mais próximo e adequado para cada material.
----------------------------------------------------------------------------------
 
-- Tecnologias Utilizadas

Backend: Node.js, Express

Inteligência Artificial: API Google Gemini (@google/genai - Modelo gemini-3.5-flash)

Banco de Dados: MySQL

Frontend: HTML, CSS, JavaScript (Leaflet para o mapa via Nginx)

Infraestrutura: Docker e Docker Compose (Ambiente 100% containerizado)

-- Pré-requisitos

Para rodar este projeto na sua máquina, você não precisa ter o Node.js ou o MySQL instalados. Toda a infraestrutura roda de forma isolada dentro de containers.

Você precisará apenas instalar:

Git (Para clonar o repositório)

Docker Desktop (Certifique-se de que o Docker esteja aberto e rodando antes de prosseguir).

-- Como Executar o Projeto

Siga o passo a passo abaixo

1. Clonar o repositório

Abra o seu terminal e execute:

git clone https://github.com/SEU_USUARIO/projeto_ecopontos.git
cd projeto_ecopontos


(Lembre-se de substituir o link acima pela URL real do seu repositório)

2. Configurar a Chave de IA (IMPORTANTE!!)

Por motivos de segurança, a chave de acesso a Inteligência Artificial do Google não é enviada para o repositório (o arquivo .env é ignorado). Você precisará criar uma chave válida:

Acesse o Google AI Studio e crie uma "API Key".

Na raiz do projeto recém-clonado, crie um arquivo vazio chamado exatamente .env.

Copie o conteúdo do arquivo .env.example e cole no seu .env, inserindo a sua chave real. Deve ficar assim:

GEMINI_API_KEY=sua_chave_gerada_aqui


3. Ligar os Containers (Docker)

Com o Docker aberto na sua máquina e o arquivo .env criado, rode o seguinte comando no terminal da raiz do projeto:

docker-compose up -d --build


O que este comando faz?
Ele fará o download da imagem do Banco de Dados, rodará o script SQL criando as tabelas, baixará as dependências do Node.js (node_modules) de forma invisível e levantará o servidor web do Front-end. A primeira execução pode levar alguns minutos.

-- Acessando a Aplicação

Quando o terminal terminar o processo e liberar a linha de comando, os serviços estarão rodando. Acesse-os pelo seu navegador:

Aplicação Web (Mapa e Chat): http://localhost

API do Assistente (Testes via Thunder Client/Postman): http://localhost:3000/api/assistente (Método POST)

Gerenciador do Banco de Dados (phpMyAdmin): http://localhost:8080

Usuário: root

Senha: root

-- Como Desligar o Servidor

Para parar a aplicação e desligar os containers de forma segura, execute na raiz do projeto:

docker-compose down


-- Resolução de Problemas Comuns

Erro "429 Rate Limit Exceeded" na IA: O Google Gemini possui um limite de requisições no plano gratuito. Se receber este erro, aguarde algumas horas ou insira uma nova chave de API gerada com outra conta Google no seu arquivo .env e reinicie o container do Node (docker restart ecopontos_node).

Erro no Banco de Dados no primeiro carregamento: Ocasionalmente, o Node.js pode iniciar frações de segundo antes do MySQL estar pronto. O próprio Docker tentará reiniciar a conexão. Se a página não responder, rode docker-compose restart api.

A pasta node_modules não veio junto? É normal! Ela está declarada no .gitignore para manter o projeto leve. O Docker cuida de baixá-la dinamicamente durante o docker-compose up --build.