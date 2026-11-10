// Outils communs : accès Redis (API REST Upstash), CORS, classement.
export const LOGO_COUNT = 32;
const KEY = "champions-ia:v1:games";

const ALLOWED = ["https://fayberrada.github.io"];

export function cors(req, res) {
  const origin = req.headers.origin || "";
  const ok = ALLOWED.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  if (ok) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

async function redis(...cmd) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Base de données non configurée");
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  const data = await r.json();
  if (!r.ok || data.error) throw new Error(data.error || `Redis ${r.status}`);
  return data.result;
}

export const pseudoKey = (p) => p.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");

export async function saveGame(game) {
  await redis("HSET", KEY, pseudoKey(game.pseudo), JSON.stringify(game));
}

export async function allGames() {
  const flat = (await redis("HGETALL", KEY)) || [];
  const out = [];
  for (let i = 1; i < flat.length; i += 2) {
    try { out.push(JSON.parse(flat[i])); } catch (e) { /* entrée illisible ignorée */ }
  }
  return out;
}

// Classement Bradley-Terry : estime la « force » de chaque logo à partir de tous les duels,
// quel que soit l'ordre ou le tour. Un adversaire fictif moyen (1 victoire, 1 défaite) lisse les petits échantillons.
export function ranking(games) {
  const n = LOGO_COUNT;
  const wins = new Array(n + 1).fill(0);
  const played = new Array(n + 1).fill(0);
  const champions = new Array(n + 1).fill(0);
  const pair = new Map();
  const add = (a, b) => {
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    pair.set(k, (pair.get(k) || 0) + 1);
  };
  let duels = 0;
  for (const g of games) {
    if (g.champion) champions[g.champion] += 1;
    for (const [a, b, w] of g.duels || []) {
      wins[w] += 1;
      played[a] += 1;
      played[b] += 1;
      add(a, b);
      duels += 1;
    }
  }
  const ids = [];
  for (let i = 1; i <= n; i++) if (played[i] > 0) ids.push(i);
  const p = new Array(n + 1).fill(1);
  for (let it = 0; it < 200; it++) {
    const next = p.slice();
    for (const i of ids) {
      let denom = 2 / (p[i] + 1); // adversaire fictif de force 1 : 2 rencontres
      for (const [k, c] of pair) {
        const [a, b] = k.split("-").map(Number);
        if (a === i) denom += c / (p[i] + p[b]);
        else if (b === i) denom += c / (p[i] + p[a]);
      }
      next[i] = (wins[i] + 1) / denom;
    }
    for (const i of ids) p[i] = next[i];
  }
  const rows = ids.map((id) => ({
    id,
    score: Math.round((p[id] / (p[id] + 1)) * 100), // % de chances de battre un logo moyen
    wins: wins[id],
    duels: played[id],
    champion: champions[id],
  }));
  rows.sort((x, y) => y.score - x.score || y.champion - x.champion || y.wins - x.wins);
  return { players: games.length, duels, top: rows.slice(0, 5) };
}
