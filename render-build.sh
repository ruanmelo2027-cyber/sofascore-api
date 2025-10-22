#!/usr/bin/env bash
# Instala dependências do projeto
npm install

# Instala Playwright (com permissão explícita)
npx playwright install chromium --with-deps || echo "Playwright já instalado"
