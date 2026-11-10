// Outils communs : accès Redis (API REST Upstash), CORS, propositions, classement.
// Identités du site actuellement en compétition (12 « charte LCL » + 8 « Héritage » + 16 « Univers LCL » + 9 « Inspirations »).
// Les duels sur des identités retirées ne comptent plus dans le classement.
export const ACTIVE_BUILTIN = [33, 35, 36, 37, 40, 41, 42, 43, 45, 48, 50, 53, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89];
export const MAX_PROPOSALS_PER_PSEUDO = 3;
export const MAX_IMAGE_BYTES = 350 * 1024;

const P = "champions-ia:v1:";
const GAMES = P + "games"; // pseudo → partie (la dernière)
const PROPS = P + "props"; // id → { id, name, by, byKey, type, at }
const IMGS = P + "imgs"; // id → image en base64
const SEQ = P + "propseq"; // compteur d'identifiants (≥ 1001)

const ALLOWED = ["https://fayberrada.github.io"];

export function cors(req, res, methods = "GET, POST, OPTIONS") {
  const origin = req.headers.origin || "";
  const ok = ALLOWED.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  if (ok) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", methods);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

export async function redis(...cmd) {
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

const pairs = (flat) => {
  const out = [];
  for (let i = 1; i < (flat || []).length; i += 2) {
    try { out.push(JSON.parse(flat[i])); } catch (e) { /* entrée illisible ignorée */ }
  }
  return out;
};

export const body = (req) => {
  if (typeof req.body !== "string") return req.body || {};
  try { return JSON.parse(req.body); } catch (e) { return {}; }
};
export const cleanText = (s, max) => String(s || "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
export const pseudoKey = (p) => p.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");

// ---------- Parties ----------
export const saveGame = (game) => redis("HSET", GAMES, pseudoKey(game.pseudo), JSON.stringify(game));
export const allGames = async () => pairs(await redis("HGETALL", GAMES));

// ---------- Propositions ----------
export const allProposals = async () => pairs(await redis("HGETALL", PROPS)).sort((a, b) => a.id - b.id);
export async function addProposal({ name, by, type, data }) {
  const id = 1000 + Number(await redis("INCR", SEQ));
  const meta = { id, name, by, byKey: pseudoKey(by), type, at: new Date().toISOString() };
  await redis("HSET", IMGS, String(id), JSON.stringify({ type, data }));
  await redis("HSET", PROPS, String(id), JSON.stringify(meta));
  return meta;
}
export async function getImage(id) {
  const raw = await redis("HGET", IMGS, String(id));
  return raw ? JSON.parse(raw) : null;
}
export async function deleteProposal(id) {
  await redis("HDEL", PROPS, String(id));
  await redis("HDEL", IMGS, String(id));
}
export const publicProposal = (p) => ({ id: p.id, name: p.name, by: p.by });

export async function validIds() {
  const ids = new Set();
  for (const i of ACTIVE_BUILTIN) ids.add(i);
  for (const p of await allProposals()) ids.add(p.id);
  return ids;
}

// ---------- Classement ----------
// Modèle de Bradley-Terry : estime la « force » de chaque proposition à partir de tous les duels,
// quel que soit l'ordre ou le tour. Un adversaire fictif moyen (1 victoire, 1 défaite) lisse les petits échantillons.
export function stats(games, ids) {
  const wins = new Map(), played = new Map(), champions = new Map(), pair = new Map();
  const inc = (m, k) => m.set(k, (m.get(k) || 0) + 1);
  let duels = 0, players = 0;
  for (const g of games) {
    let counted = false;
    if (ids.has(g.champion)) inc(champions, g.champion);
    for (const [a, b, w] of g.duels || []) {
      if (!ids.has(a) || !ids.has(b)) continue; // proposition retirée
      inc(wins, w);
      inc(played, a);
      inc(played, b);
      inc(pair, a < b ? `${a}-${b}` : `${b}-${a}`);
      duels += 1;
      counted = true;
    }
    if (counted) players += 1;
  }
  return { wins, played, champions, pair, duels, players };
}

export function ranking(games, ids) {
  const s = stats(games, ids);
  const list = [...s.played.keys()];
  const p = new Map(list.map((i) => [i, 1]));
  const edges = [...s.pair].map(([k, c]) => [...k.split("-").map(Number), c]);
  for (let it = 0; it < 200; it++) {
    const denom = new Map(list.map((i) => [i, 2 / (p.get(i) + 1)]));
    for (const [a, b, c] of edges) {
      const d = c / (p.get(a) + p.get(b));
      denom.set(a, denom.get(a) + d);
      denom.set(b, denom.get(b) + d);
    }
    for (const i of list) p.set(i, ((s.wins.get(i) || 0) + 1) / denom.get(i));
  }
  const rows = list.map((id) => ({
    id,
    score: Math.round((p.get(id) / (p.get(id) + 1)) * 100), // % de chances de battre une proposition moyenne
    wins: s.wins.get(id) || 0,
    duels: s.played.get(id) || 0,
    champion: s.champions.get(id) || 0,
  }));
  rows.sort((x, y) => y.score - x.score || y.champion - x.champion || y.wins - x.wins);
  rows.forEach((r, i) => (r.rank = i + 1));
  return { players: s.players, duels: s.duels, ranked: rows.length, top: rows.slice(0, 5), all: rows };
}
