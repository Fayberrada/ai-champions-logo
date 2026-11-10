import { timingSafeEqual } from "node:crypto";
import { cors, body, allProposals, deleteProposal } from "../lib/shared.js";

// POST { key, action: "list" | "delete", id }
// Réservé à l'organisateur (clé ADMIN_KEY dans les variables d'environnement Vercel).
export default async function handler(req, res) {
  if (cors(req, res, "POST, OPTIONS")) return;
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });

  const b = body(req);
  const expected = Buffer.from(process.env.ADMIN_KEY || "");
  const given = Buffer.from(String(b.key || ""));
  if (!expected.length || expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return res.status(401).json({ error: "Clé organisateur incorrecte" });
  }
  try {
    if (b.action === "delete") {
      const id = Number(b.id);
      if (!Number.isInteger(id) || id < 1001) return res.status(400).json({ error: "Identifiant invalide" });
      await deleteProposal(id);
    }
    const list = (await allProposals()).map((p) => ({ id: p.id, name: p.name, by: p.by, at: p.at }));
    return res.status(200).json({ proposals: list });
  } catch (e) {
    return res.status(500).json({ error: "Action impossible pour le moment" });
  }
}
