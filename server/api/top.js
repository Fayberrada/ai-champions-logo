import { cors, allGames, ranking } from "../lib/shared.js";

// GET → { players, duels, top: [{ id, score, wins, duels, champion }] }
export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== "GET") return res.status(405).json({ error: "Méthode non autorisée" });
  try {
    return res.status(200).json(ranking(await allGames()));
  } catch (e) {
    return res.status(500).json({ error: "Classement indisponible pour le moment" });
  }
}
