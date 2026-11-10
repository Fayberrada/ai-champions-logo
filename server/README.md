# API des votes — Champions IA

Petite API Vercel (`champions-ia-api`) qui enregistre les parties et calcule le top 5 commun.

- `POST /api/vote` : `{ pseudo, duels: [[a, b, gagnant], ...], champion }`. Une seule partie compte par pseudo (la dernière).
- `GET /api/top` : `{ players, duels, top: [{ id, score, wins, duels, champion }] }`.

Classement : modèle de Bradley-Terry sur tous les duels de tous les joueurs. Le score est la probabilité (en %) de battre une proposition moyenne.

Stockage : Upstash Redis via le Marketplace Vercel (variables `KV_REST_API_URL` / `KV_REST_API_TOKEN`).

Déploiement : `cd server && vercel deploy --prod`.
