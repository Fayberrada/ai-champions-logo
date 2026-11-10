import { getImage } from "../lib/shared.js";

// GET /api/img?id=1001 → l'image d'une proposition (WebP, PNG ou JPEG, jamais de SVG).
export default async function handler(req, res) {
  const id = Number(req.query.id);
  if (!Number.isInteger(id) || id < 1001) return res.status(400).end();
  try {
    const img = await getImage(id);
    if (!img) return res.status(404).end();
    res.setHeader("Content-Type", img.type);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.status(200).send(Buffer.from(img.data, "base64"));
  } catch (e) {
    return res.status(500).end();
  }
}
