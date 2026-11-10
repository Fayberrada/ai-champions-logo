import { cors, allGames, allProposals, validIds, stats, publicProposal } from "../lib/shared.js";

// GET → { proposals: [{ id, name, by }], played: { id: nombre de duels } }
// Le jeu s'en sert pour inclure les propositions des joueurs et favoriser les moins vues.
export default async function handler(req, res) {
  if (cors(req, res)) return;
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).json({ error: "Méthode non autorisée" });
  try {
    const props = await allProposals();
    const s = stats(await allGames(), await validIds());
    return res.status(200).json({ proposals: props.map(publicProposal), played: Object.fromEntries(s.played) });
  } catch (e) {
    return res.status(500).json({ error: "Liste indisponible pour le moment" });
  }
}
