import { cors, body, cleanText, pseudoKey, allProposals, addProposal, publicProposal, MAX_PROPOSALS_PER_PSEUDO, MAX_IMAGE_BYTES } from "../lib/shared.js";

// POST { pseudo, name, image: "data:image/webp;base64,..." }
// Ajoute une proposition au tournoi. Le navigateur convertit l'image en WebP/PNG/JPEG avant l'envoi.
const TYPES = ["image/webp", "image/png", "image/jpeg"];
const MAGIC = {
  "image/png": (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8,
  "image/webp": (b) => b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP",
};

export default async function handler(req, res) {
  if (cors(req, res)) return;
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });

  const b = body(req);
  const by = cleanText(b.pseudo, 24);
  if (by.length < 2) return res.status(400).json({ error: "Pseudo de 2 à 24 caractères" });
  const name = cleanText(b.name, 40) || `Proposition de ${by}`;

  const m = /^data:(image\/[a-z]+);base64,([A-Za-z0-9+/=]+)$/.exec(String(b.image || ""));
  if (!m || !TYPES.includes(m[1])) return res.status(400).json({ error: "Image invalide (PNG, JPEG ou WebP)" });
  const buf = Buffer.from(m[2], "base64");
  if (buf.length < 100 || buf.length > MAX_IMAGE_BYTES) return res.status(400).json({ error: "Image trop lourde" });
  if (!MAGIC[m[1]](buf)) return res.status(400).json({ error: "Image invalide" });

  try {
    const mine = (await allProposals()).filter((p) => p.byKey === pseudoKey(by));
    if (mine.length >= MAX_PROPOSALS_PER_PSEUDO) {
      return res.status(409).json({ error: `Maximum ${MAX_PROPOSALS_PER_PSEUDO} propositions par pseudo` });
    }
    const meta = await addProposal({ name, by, type: m[1], data: m[2] });
    return res.status(201).json({ proposal: publicProposal(meta), remaining: MAX_PROPOSALS_PER_PSEUDO - mine.length - 1 });
  } catch (e) {
    return res.status(500).json({ error: "Envoi impossible pour le moment" });
  }
}
