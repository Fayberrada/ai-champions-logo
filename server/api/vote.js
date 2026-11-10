import { cors, body, cleanText, saveGame, allGames, allProposals, validIds, ranking, publicProposal } from "../lib/shared.js";

// POST { pseudo, duels: [[a, b, gagnant], ...], champion }
// Enregistre la partie. Une seule partie compte par pseudo : la dernière remplace la précédente.
export default async function handler(req, res) {
  if (cors(req, res)) return;
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });

  const b = body(req);
  const pseudo = cleanText(b.pseudo, 24);
  if (pseudo.length < 2) return res.status(400).json({ error: "Pseudo de 2 à 24 caractères" });
  const duels = Array.isArray(b.duels) ? b.duels : [];
  if (duels.length < 1 || duels.length > 40) return res.status(400).json({ error: "Partie invalide" });

  try {
    const ids = await validIds();
    for (const d of duels) {
      const [a, x, w] = Array.isArray(d) && d.length === 3 ? d : [];
      if (!ids.has(a) || !ids.has(x) || a === x || (w !== a && w !== x)) return res.status(400).json({ error: "Duel invalide" });
    }
    const champion = ids.has(b.champion) ? b.champion : null;
    await saveGame({ pseudo, at: new Date().toISOString(), duels, champion });
    const result = ranking(await allGames(), ids);
    const props = new Map((await allProposals()).map((p) => [p.id, publicProposal(p)]));
    result.top = result.top.map((r) => ({ ...r, proposal: props.get(r.id) || null }));
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: "Enregistrement impossible pour le moment" });
  }
}
