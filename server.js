const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// 🔹 Middleware
app.use(cors());

// 🔹 Função para buscar dados diretamente da API SofaScore
async function fetchFromSofa(path) {
  const url = `https://api.sofascore.com/api/v1${path}`;
  try {
    const response = await axios.get(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Referer": "https://www.sofascore.com/",
        "Origin": "https://www.sofascore.com/",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao buscar ${url}:`, error.response?.status || error.message);
    return { events: [] };
  }
}

// 🔹 Página inicial
app.get("/", (req, res) => {
  res.send("🚀 API SofaScore (Axios) está online e funcional no Render!");
});

// 🔹 Rota principal — partidas + estatísticas
app.get("/matches", async (req, res) => {
  try {
    const [live, upcoming] = await Promise.all([
      fetchFromSofa("/sport/football/events/live"),
      fetchFromSofa("/sport/football/events/scheduled"),
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
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// 🔹 Inicia o servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
