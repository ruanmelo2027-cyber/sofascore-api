#!/usr/bin/env bash
# Instala as dependências do projeto
npm install

# Instala o navegador do Playwright (com dependências)
npx playwright install --with-deps
