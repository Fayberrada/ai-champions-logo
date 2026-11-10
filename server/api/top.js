import { cors, allGames, allProposals, validIds, ranking, publicProposal } from "../lib/shared.js";

// GET → { players, duels, ranked, top: [{ id, rank, score, wins, duels, champion, proposal }] } ; ?all=1 ajoute le classement complet
export default async function handler(req, res) {
  if (cors(req, res)) return;
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).json({ error: "Méthode non autorisée" });
  try {
    const { all, ...result } = ranking(await allGames(), await validIds());
    const props = new Map((await allProposals()).map((p) => [p.id, publicProposal(p)]));
    const withProp = (r) => ({ ...r, proposal: props.get(r.id) || null });
    result.top = result.top.map(withProp);
    if (req.query.all) result.all = all.map(withProp); // classement complet (?all=1)
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: "Classement indisponible pour le moment" });
  }
}
