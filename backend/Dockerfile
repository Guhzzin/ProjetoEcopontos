# imagem oficial do Node (versão 20)
FROM node:20

# pasta onde o código vai ficar dentro do container
WORKDIR /app

# copia os arquivos de configuração do Node primeiro
COPY package*.json ./

# Instala as dependências (express, mysql, etc)
RUN npm install

# Copia o resto do código da API
COPY . .

#expõe porta que a API vai usar
EXPOSE 3000