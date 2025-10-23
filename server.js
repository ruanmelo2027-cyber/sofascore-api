const express = require("express");
const { chromium } = require("playwright");

const app = express();
const PORT = process.env.PORT || 4000; // Render define automaticamente a porta
let browser, context;

// 🔹 Inicia o navegador Playwright (só uma vez)
async function initBrowser() {
  if (browser) return;
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext();
  console.log("✅ Navegador Playwright iniciado");
}

// 🔹 Função para buscar dados da API SofaScore
async function fetchFromSofa(path) {
  await initBrowser();
  const url = `https://api.sofascore.com/api/v1${path}`;

  const response = await context.request.get(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0",
      "Referer": "https://www.sofascore.com",
      "Origin": "https://www.sofascore.com",
    },
  });

  if (!response.ok()) {
    throw new Error(`Erro ${response.status()} ao acessar ${url}`);
  }

  return await response.json();
}

// 🔹 Rota inicial — aparece quando você acessa o domínio base
app.get("/", (req, res) => {
  res.send("🚀 API SofaScore está online!");
});

// 🔹 Rota principal — retorna partidas e estatísticas
app.get("/matches", async (req, res) => {
  try {
    const [live, upcoming] = await Promise.all([
      fetchFromSofa("/sport/football/events/live").catch(() => ({ events: [] })),
      fetchFromSofa("/sport/football/events/scheduled").catch(() => ({ events: [] })),
    ]);

    const allMatches = [...(live.events || []), ...(upcoming.events || [])];

    const detailedMatches = await Promise.all(
      allMatches.map(async (event) => {
        const match = {
          id: event.id,
          tournament: event.tournament?.name,
          country: event.tournament?.category?.name,
          homeTeam: event.homeTeam?.name,
          awayTeam: event.awayTeam?.name,
          status: event.status?.type,
          startTimestamp: event.startTimestamp,
          homeScore: event.homeScore?.current || 0,
          awayScore: event.awayScore?.current || 0,
          statistics: null,
          probabilities: null,
          incidents: null,
        };

        try {
          const stats = await fetchFromSofa(`/event/${event.id}/statistics`);
          match.statistics = stats.statistics || null;
        } catch {}

        try {
          const probs = await fetchFromSofa(`/event/${event.id}/probabilities`);
          match.probabilities = probs.probabilities || null;
        } catch {}

        try {
          const inc = await fetchFromSofa(`/event/${event.id}/incidents`);
          match.incidents = inc.incidents || null;
        } catch {}

        return match;
      })
    );

    res.json({
      total: detailedMatches.length,
      lastUpdate: new Date().toISOString(),
      matches: detailedMatches,
    });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// 🔹 Inicia o servidor — ajuste ESSENCIAL para Render
app.listen(PORT, "0.0.0.0", async () => {
  await initBrowser();
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
