import { cors, body, cleanText, pseudoKey, saveGame, allGames, allProposals, validIds, ranking, publicProposal } from "../lib/shared.js";

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
  if (duels.length < 1 || duels.length > 120) return res.status(400).json({ error: "Partie invalide" });

  try {
    const ids = await validIds();
    for (const d of duels) {
      const [a, x, w] = Array.isArray(d) && d.length === 3 ? d : [];
      if (!ids.has(a) || !ids.has(x) || a === x || (w !== a && w !== x)) return res.status(400).json({ error: "Duel invalide" });
    }
    const champion = ids.has(b.champion) ? b.champion : null;
    await saveGame({ pseudo, at: new Date().toISOString(), duels, champion });
    const { all, ...result } = ranking(await allGames(), ids);
    const proposals = await allProposals();
    const props = new Map(proposals.map((p) => [p.id, publicProposal(p)]));
    const withProp = (r) => ({ ...r, proposal: props.get(r.id) || null });
    const rankOf = (id) => all.find((r) => r.id === id) || { id, rank: null };
    result.top = result.top.map(withProp);
    // Classement général du champion de ce joueur et de ses propres propositions
    result.mine = {
      champion: champion ? withProp(rankOf(champion)) : null,
      proposals: proposals.filter((p) => p.byKey === pseudoKey(pseudo)).map((p) => withProp(rankOf(p.id)))
        .sort((x, y) => (x.rank || 1e9) - (y.rank || 1e9)),
    };
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: "Enregistrement impossible pour le moment" });
  }
}
