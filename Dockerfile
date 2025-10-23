# Usa Node 18 (versão mais estável para Playwright)
FROM node:18-slim

# Instala dependências do sistema necessárias para Playwright
RUN apt-get update && apt-get install -y \
    wget gnupg ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 \
    libnss3 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libgtk-3-0 libpango-1.0-0 \
    libxkbcommon0 libxshmfence1 libx11-xcb1 libxcb-dri3-0 libdrm2 \
    && rm -rf /var/lib/apt/lists/*

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala dependências Node
RUN npm install

# Instala Playwright e os navegadores
RUN npx playwright install --with-deps

# Copia o restante do projeto
COPY . .

# Render define automaticamente a porta
ENV PORT=$PORT
EXPOSE $PORT

# Comando de inicialização
CMD ["npm", "start"]
