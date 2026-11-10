import { cors, saveGame, allGames, ranking, LOGO_COUNT } from "../lib/shared.js";

// POST { pseudo, duels: [[a, b, gagnant], ...], champion }
// Enregistre la partie. Une seule partie compte par pseudo : la dernière remplace la précédente.
export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  const pseudo = String(body.pseudo || "").replace(/[\u0000-\u001f<>]/g, "").trim();
  if (pseudo.length < 2 || pseudo.length > 24) return res.status(400).json({ error: "Pseudo de 2 à 24 caractères" });

  const valid = (v) => Number.isInteger(v) && v >= 1 && v <= LOGO_COUNT;
  const duels = Array.isArray(body.duels) ? body.duels : [];
  if (duels.length < 1 || duels.length > 40) return res.status(400).json({ error: "Partie invalide" });
  for (const d of duels) {
    if (!Array.isArray(d) || d.length !== 3) return res.status(400).json({ error: "Duel invalide" });
    const [a, b, w] = d;
    if (!valid(a) || !valid(b) || a === b || (w !== a && w !== b)) return res.status(400).json({ error: "Duel invalide" });
  }
  const champion = valid(body.champion) ? body.champion : null;

  try {
    await saveGame({ pseudo, at: new Date().toISOString(), duels, champion });
    const result = ranking(await allGames());
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: "Enregistrement impossible pour le moment" });
  }
}

function safeParse(s) {
  try { return JSON.parse(s); } catch (e) { return {}; }
}
