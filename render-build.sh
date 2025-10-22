#!/usr/bin/bash
echo "Instalando dependências..."
npm install

echo "Instalando Playwright + Chromium..."
npx playwright install --with-deps chromium
