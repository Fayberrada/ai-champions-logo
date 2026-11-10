import { cors, allGames, allProposals, validIds, ranking, publicProposal } from "../lib/shared.js";

// GET → { players, duels, top: [{ id, score, wins, duels, champion, proposal }] }
export default async function handler(req, res) {
  if (cors(req, res)) return;
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).json({ error: "Méthode non autorisée" });
  try {
    const result = ranking(await allGames(), await validIds());
    const props = new Map((await allProposals()).map((p) => [p.id, publicProposal(p)]));
    result.top = result.top.map((r) => ({ ...r, proposal: props.get(r.id) || null }));
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: "Classement indisponible pour le moment" });
  }
}
