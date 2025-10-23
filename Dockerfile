# Imagem base
FROM node:22-slim

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos essenciais primeiro
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Define a variável de ambiente
ENV PORT=4000

# Expõe a porta
EXPOSE 4000

# Comando padrão
CMD ["npm", "start"]
