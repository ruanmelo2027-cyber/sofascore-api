# Etapa 1: imagem base oficial do Node.js
FROM node:18-slim

# Instala dependências do sistema necessárias para o Playwright
RUN apt-get update && apt-get install -y wget gnupg ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 \
    libnss3 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libgtk-3-0 libpango-1.0-0 libxkbcommon0 \
    libxshmfence1 libx11-xcb1 libxcb-dri3-0 libdrm2 && \
    rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala dependências Node
RUN npm install

# Instala navegadores do Playwright
RUN npx playwright install --with-deps

# Copia o restante do projeto
COPY . .

# Define variável de ambiente para a porta (Render usa $PORT automaticamente)
ENV PORT=4000

# Expõe a porta
EXPOSE 4000

# Comando padrão
CMD ["npm", "start"]
