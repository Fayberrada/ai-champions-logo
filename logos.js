// Catalogue des propositions de logo « AI Champions LCL ».
// Chaque entrée : id, name, esprit (l'idée), style, svg (contenu interne, viewBox 0 0 240 240).
// Palette commune inspirée de l'univers LCL : bleu marine, bleu, cyan, or. À caler sur la charte officielle.
const LOGOS = (function () {
  const N = "#0B1F4B"; // bleu marine
  const B = "#1F5BD8"; // bleu
  const C = "#00A3E0"; // cyan
  const Y = "#FFC72C"; // or
  const W = "#FFFFFF";
  const F = "Montserrat, 'Segoe UI', Arial, sans-serif";

  const bg = (fill) => `<rect width="240" height="240" rx="28" fill="${fill}"/>`;
  const light = bg("#FFFFFF");
  const dark = bg(N);

  // Étincelle à 4 branches (le symbole « IA »)
  const sp = (cx, cy, r, fill) => {
    const k = r * 0.16;
    return `<path d="M${cx} ${cy - r}Q${cx + k} ${cy - k} ${cx + r} ${cy}Q${cx + k} ${cy + k} ${cx} ${cy + r}Q${cx - k} ${cy + k} ${cx - r} ${cy}Q${cx - k} ${cy - k} ${cx} ${cy - r}Z" fill="${fill}"/>`;
  };
  // Étoile à n branches
  const st = (cx, cy, R, r, fill, n = 5) => {
    const pts = [];
    for (let i = 0; i < n * 2; i++) {
      const a = (Math.PI / n) * i - Math.PI / 2;
      const d = i % 2 ? r : R;
      pts.push(`${(cx + d * Math.cos(a)).toFixed(1)},${(cy + d * Math.sin(a)).toFixed(1)}`);
    }
    return `<polygon points="${pts.join(" ")}" fill="${fill}"/>`;
  };
  const t = (x, y, size, weight, fill, txt, extra = "") =>
    `<text x="${x}" y="${y}" text-anchor="middle" font-family="${F}" font-weight="${weight}" font-size="${size}" fill="${fill}" ${extra}>${txt}</text>`;

  // Signatures typographiques
  const wmA = (y, ink, acc) =>
    t(120, y, 21, 800, ink, "AI CHAMPIONS", 'letter-spacing="0.5"') +
    `<line x1="78" y1="${y + 13}" x2="98" y2="${y + 13}" stroke="${acc}" stroke-width="2"/>` +
    `<line x1="142" y1="${y + 13}" x2="162" y2="${y + 13}" stroke="${acc}" stroke-width="2"/>` +
    t(122, y + 18, 13, 700, acc, "LCL", 'letter-spacing="4"');
  const tag = (y, fill, ink) =>
    `<rect x="98" y="${y}" width="44" height="20" rx="5" fill="${fill}"/>` + t(120, y + 15, 13, 800, ink, "LCL", 'letter-spacing="1.5"');
  const wmB = (y, ink, acc) => t(120, y, 17, 700, ink, "CHAMPIONS", 'letter-spacing="5"') + tag(y + 10, acc, N);

  const L = [];
  const add = (name, esprit, style, svg) => L.push({ id: L.length + 1, name, esprit, style, svg });

  add("Étincelle", "IA", "Emblème", light +
    `<circle cx="120" cy="88" r="52" fill="${N}"/>` + sp(120, 90, 32, Y) + sp(150, 60, 10, C) + wmA(178, N, B));

  add("Trophée connecté", "Champion", "Plat", light +
    `<path d="M88 46H152V76A32 32 0 0 1 88 76Z" fill="${N}"/>` +
    `<g fill="none" stroke="${N}" stroke-width="5" stroke-linejoin="round"><path d="M88 56H70V78L82 90"/><path d="M152 56H170V78L158 90"/></g>` +
    `<circle cx="82" cy="90" r="6" fill="${C}"/><circle cx="158" cy="90" r="6" fill="${C}"/>` +
    `<rect x="113" y="107" width="14" height="16" fill="${N}"/><rect x="94" y="123" width="52" height="11" rx="3" fill="${N}"/>` +
    sp(120, 72, 16, Y) + wmA(172, N, B));

  add("Couronne neuronale", "Champion", "Sombre", dark +
    `<polygon points="68,112 68,70 94,92 120,54 146,92 172,70 172,112" fill="${Y}"/>` +
    `<rect x="68" y="112" width="104" height="14" rx="3" fill="${W}"/>` +
    [[68, 70], [120, 54], [172, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${C}" stroke="${N}" stroke-width="3"/>`).join("") +
    wmA(176, W, Y));

  add("Blason AI", "Champion", "Écusson", light +
    `<path d="M120 22L170 38V88C170 122 148 144 120 154C92 144 70 122 70 88V38Z" fill="${N}"/>` +
    `<path d="M120 32L160 45V88C160 115 143 133 120 142C97 133 80 115 80 88V45Z" fill="none" stroke="${Y}" stroke-width="2.5"/>` +
    st(120, 58, 9, 4, Y) + t(120, 114, 44, 800, W, "AI") + wmB(186, N, Y));

  add("Laurier de données", "Champion", "Graphique", light +
    (function () {
      let s = "";
      for (let i = 0; i < 8; i++) {
        const a = ((115 + i * 17) * Math.PI) / 180;
        const r = 9 - i * 0.7;
        const col = i % 2 ? C : B;
        s += `<circle cx="${(120 + 54 * Math.cos(a)).toFixed(1)}" cy="${(90 - 54 * Math.sin(a)).toFixed(1)}" r="${r.toFixed(1)}" fill="${col}"/>`;
        s += `<circle cx="${(120 - 54 * Math.cos(a)).toFixed(1)}" cy="${(90 - 54 * Math.sin(a)).toFixed(1)}" r="${r.toFixed(1)}" fill="${col}"/>`;
      }
      return s;
    })() + t(120, 104, 40, 800, N, "AI") + sp(120, 46, 9, Y) + wmA(182, N, B));

  add("Médaille", "Champion", "Plat", light +
    `<polygon points="96,24 118,24 132,66 110,66" fill="${B}"/><polygon points="144,24 122,24 108,66 130,66" fill="${C}"/>` +
    `<circle cx="120" cy="100" r="40" fill="${Y}"/><circle cx="120" cy="100" r="31" fill="none" stroke="${W}" stroke-width="2.5"/>` +
    sp(120, 100, 19, N) + wmA(178, N, B));

  add("Sceau", "Champion", "Cachet", bg("#FFFFFF") +
    `<circle cx="120" cy="120" r="104" fill="${N}"/><circle cx="120" cy="120" r="64" fill="none" stroke="${Y}" stroke-width="2"/>` +
    `<defs><path id="sTop7" d="M40 120A80 80 0 0 1 200 120"/><path id="sBot7" d="M30 120A90 90 0 0 0 210 120"/></defs>` +
    `<text font-family="${F}" font-weight="800" font-size="18" letter-spacing="4" fill="${W}" text-anchor="middle"><textPath href="#sTop7" startOffset="50%">AI CHAMPIONS</textPath></text>` +
    `<text font-family="${F}" font-weight="700" font-size="15" letter-spacing="6" fill="${Y}" text-anchor="middle"><textPath href="#sBot7" startOffset="50%">LCL</textPath></text>` +
    st(36, 128, 6, 2.5, Y) + st(204, 128, 6, 2.5, Y) + sp(120, 120, 40, Y) + sp(146, 94, 9, C));

  add("Sommet A", "Progression", "Monogramme", light +
    `<polygon points="120,46 170,152 144,152 120,98 96,152 70,152" fill="${N}"/>` +
    `<rect x="92" y="126" width="56" height="10" rx="5" fill="${C}"/>` + sp(120, 34, 16, Y) + wmA(186, N, B));

  add("Podium", "Champion", "Plat", light +
    `<rect x="70" y="96" width="32" height="44" rx="3" fill="${B}"/><rect x="104" y="76" width="32" height="64" rx="3" fill="${N}"/><rect x="138" y="108" width="32" height="32" rx="3" fill="${C}"/>` +
    t(86, 124, 16, 800, W, "2") + t(120, 108, 18, 800, Y, "1") + t(154, 130, 14, 800, W, "3") +
    sp(120, 52, 18, Y) + wmA(176, N, B));

  add("Galons", "Progression", "Géométrique", light +
    `<g fill="none" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"><path d="M80 138L120 110L160 138" stroke="${N}"/><path d="M80 110L120 82L160 110" stroke="${B}"/><path d="M80 82L120 54L160 82" stroke="${C}"/></g>` +
    sp(120, 30, 14, Y) + wmA(182, N, B));

  add("Bulle étincelante", "IA générative", "Plat", light +
    `<rect x="66" y="40" width="108" height="80" rx="24" fill="${N}"/><polygon points="90,116 88,144 116,118" fill="${N}"/>` +
    sp(120, 80, 24, Y) + sp(150, 60, 8, C) + wmA(178, N, B));

  add("Flambeau", "Champion", "Sombre", dark +
    `<path d="M120 34C142 60 154 78 148 100C144 116 132 124 120 124C107 124 95 116 93 100C91 86 101 78 107 68C109 80 115 85 120 85C118 68 113 54 120 34Z" fill="${Y}"/>` +
    `<path d="M120 76C130 90 134 98 131 106C129 114 124 118 120 118C115 118 110 114 109 106C108 98 114 92 120 76Z" fill="${C}"/>` +
    `<polygon points="102,128 138,128 130,158 110,158" fill="${W}"/>` + wmA(190, W, Y));

  add("Réseau hexagonal", "IA", "Graphique", light +
    (function () {
      let lines = "", nodes = "", pts = [];
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        pts.push([120 + 52 * Math.cos(a), 92 + 52 * Math.sin(a)]);
      }
      pts.forEach(([x, y]) => {
        lines += `<line x1="120" y1="92" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${B}" stroke-width="3"/>`;
        nodes += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="${C}"/>`;
      });
      return `<polygon points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" fill="none" stroke="${N}" stroke-width="7" stroke-linejoin="round"/>` + lines + nodes + `<circle cx="120" cy="92" r="15" fill="${Y}"/>`;
    })() + wmA(182, N, B));

  add("Trophée 8-bit", "Jeu", "Pixel", dark +
    (function () {
      const rows = ["X.XXXXXX.X", "XXXXXXXXXX", "X.XXXXXX.X", ".XXXXXXXX.", "..XXXXXX..", "...XXXX...", "....XX....", "....XX....", "..XXXXXX..", "..XXXXXX.."];
      let s = "";
      rows.forEach((r, y) => [...r].forEach((c, x) => { if (c === "X") s += `<rect x="${80 + x * 8}" y="${36 + y * 9}" width="8" height="9" fill="${y < 6 ? Y : W}"/>`; }));
      return s + `<rect x="112" y="45" width="8" height="9" fill="${C}"/><rect x="120" y="45" width="8" height="9" fill="${C}"/>`;
    })() + t(120, 168, 22, 800, W, "AI CHAMPIONS", 'letter-spacing="1"') + tag(180, Y, N));

  add("Constellation", "IA", "Sombre", dark +
    (function () {
      const p = [[72, 116], [86, 70], [104, 96], [120, 48], [136, 96], [154, 70], [168, 116]];
      let s = `<polyline points="${p.map((q) => q.join(",")).join(" ")}" fill="none" stroke="${C}" stroke-width="2" stroke-opacity=".8"/><line x1="72" y1="116" x2="168" y2="116" stroke="${C}" stroke-width="2" stroke-opacity=".8"/>`;
      p.forEach(([x, y], i) => { if (i !== 3) s += `<circle cx="${x}" cy="${y}" r="${i % 2 ? 5 : 4}" fill="${W}"/>`; });
      return s + sp(120, 48, 16, Y) + `<circle cx="60" cy="40" r="1.6" fill="${W}"/><circle cx="184" cy="52" r="1.6" fill="${W}"/><circle cx="196" cy="102" r="1.2" fill="${W}"/><circle cx="46" cy="92" r="1.2" fill="${W}"/>`;
    })() + wmA(172, W, Y));

  add("Monogramme carré", "Marque", "Monogramme", light +
    `<rect x="70" y="30" width="100" height="100" rx="26" fill="${N}"/>` + t(118, 100, 50, 800, W, "AI") + sp(152, 52, 11, Y) + wmB(166, N, Y));

  add("Cible atteinte", "Performance", "Plat", light +
    `<circle cx="112" cy="94" r="54" fill="${N}"/><circle cx="112" cy="94" r="40" fill="${W}"/><circle cx="112" cy="94" r="27" fill="${B}"/><circle cx="112" cy="94" r="13" fill="${Y}"/>` +
    `<line x1="112" y1="94" x2="166" y2="40" stroke="${N}" stroke-width="6" stroke-linecap="round"/><polygon points="160,30 176,30 176,46 168,38" fill="${C}"/>` + wmA(182, N, B));

  add("Fusée", "Innovation", "Plat", light +
    `<path d="M120 30C140 46 148 74 144 108H96C92 74 100 46 120 30Z" fill="${N}"/><circle cx="120" cy="70" r="12" fill="${C}" stroke="${W}" stroke-width="3"/>` +
    `<path d="M96 96L78 118V130L98 116Z" fill="${B}"/><path d="M144 96L162 118V130L142 116Z" fill="${B}"/>` +
    `<path d="M104 112H136L128 140L120 128L112 140Z" fill="${Y}"/>` + wmA(180, N, B));

  add("Bande signature", "Marque", "Typographique", dark +
    `<polygon points="0,150 240,104 240,126 0,172" fill="${Y}"/>` + t(120, 118, 92, 800, W, "AI", 'letter-spacing="-2"') +
    sp(178, 46, 12, C) + t(120, 206, 19, 700, W, "CHAMPIONS", 'letter-spacing="6"') + t(120, 226, 12, 700, Y, "LCL", 'letter-spacing="5"'));

  add("Étoile filante", "Ambition", "Dynamique", light +
    `<g stroke-linecap="round" stroke-width="8"><line x1="62" y1="132" x2="126" y2="96" stroke="${C}"/><line x1="76" y1="148" x2="132" y2="116" stroke="${B}"/><line x1="96" y1="156" x2="140" y2="130" stroke="${N}"/></g>` +
    st(152, 86, 30, 13, Y) + wmA(188, N, B));

  add("Anneau", "IA", "Minimal", light +
    `<path d="M104 38A54 54 0 1 0 136 38" fill="none" stroke="${N}" stroke-width="7" stroke-linecap="round"/>` +
    sp(120, 36, 15, Y) + t(120, 106, 34, 800, N, "AI") + wmA(182, N, B));

  add("Puce couronnée", "IA", "Technique", light +
    (function () {
      let pins = "";
      [96, 120, 144].forEach((v) => {
        pins += `<line x1="${v}" y1="40" x2="${v}" y2="54" stroke="${B}" stroke-width="5" stroke-linecap="round"/><line x1="${v}" y1="130" x2="${v}" y2="144" stroke="${B}" stroke-width="5" stroke-linecap="round"/>`;
        const w = v - 28;
        pins += `<line x1="62" y1="${w + 20}" x2="76" y2="${w + 20}" stroke="${B}" stroke-width="5" stroke-linecap="round"/><line x1="164" y1="${w + 20}" x2="178" y2="${w + 20}" stroke="${B}" stroke-width="5" stroke-linecap="round"/>`;
      });
      return pins;
    })() + `<rect x="76" y="54" width="88" height="76" rx="14" fill="${N}"/>` +
    `<polygon points="96,108 96,80 108,92 120,72 132,92 144,80 144,108" fill="${Y}"/>` + wmA(182, N, B));

  add("Ampoule", "Idée", "Plat", light +
    `<circle cx="120" cy="78" r="40" fill="${Y}"/><path d="M100 104H140L134 122H106Z" fill="${Y}"/>` +
    `<rect x="104" y="124" width="32" height="8" rx="3" fill="${N}"/><rect x="108" y="135" width="24" height="8" rx="3" fill="${N}"/>` +
    sp(120, 78, 22, N) + wmA(180, N, B));

  add("Écusson sport", "Esprit d'équipe", "Écusson", light +
    `<path d="M70 30H170V100C170 132 148 152 120 164C92 152 70 132 70 100Z" fill="${N}"/>` +
    `<path d="M70 30H170V58H70Z" fill="${B}"/>` + t(120, 50, 13, 800, W, "LCL", 'letter-spacing="4"') +
    st(120, 98, 24, 10, Y) +
    `<path d="M56 116H184L176 130L184 144H56L64 130Z" fill="${Y}"/>` + t(120, 135, 13, 800, N, "AI CHAMPIONS", 'letter-spacing="1"') + st(100, 192, 6, 2.5, B) + st(120, 192, 6, 2.5, B) + st(140, 192, 6, 2.5, B));

  add("Typo pure", "Marque", "Typographique", light +
    t(120, 112, 84, 800, N, "AI", 'letter-spacing="-3"') + `<rect x="78" y="126" width="84" height="8" rx="4" fill="${Y}"/>` +
    sp(170, 50, 11, C) + t(120, 166, 19, 700, N, "CHAMPIONS", 'letter-spacing="6"') + t(120, 192, 13, 700, B, "LCL", 'letter-spacing="5"'));

  add("Robot couronné", "Mascotte", "Plat", light +
    `<polygon points="94,50 94,30 107,40 120,24 133,40 146,30 146,50" fill="${Y}"/>` +
    `<rect x="78" y="54" width="84" height="70" rx="20" fill="${N}"/>` +
    `<circle cx="102" cy="86" r="10" fill="${C}"/><circle cx="138" cy="86" r="10" fill="${C}"/>` +
    `<path d="M104 106Q120 116 136 106" fill="none" stroke="${W}" stroke-width="4" stroke-linecap="round"/>` +
    `<rect x="68" y="78" width="10" height="20" rx="4" fill="${B}"/><rect x="162" y="78" width="10" height="20" rx="4" fill="${B}"/>` + wmA(170, N, B));

  add("Cercle d'équipe", "Communauté", "Graphique", light +
    (function () {
      let s = "";
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        const x = 120 + 48 * Math.cos(a), y = 90 + 48 * Math.sin(a);
        s += `<circle cx="${x.toFixed(1)}" cy="${(y - 6).toFixed(1)}" r="8" fill="${i % 2 ? C : B}"/><path d="M${(x - 12).toFixed(1)} ${(y + 12).toFixed(1)}A12 12 0 0 1 ${(x + 12).toFixed(1)} ${(y + 12).toFixed(1)}Z" fill="${i % 2 ? C : B}"/>`;
      }
      return s;
    })() + `<circle cx="120" cy="90" r="26" fill="${N}"/>` + sp(120, 90, 16, Y) + wmA(180, N, B));

  add("Bannière", "Champion", "Écusson", light + '<g transform="translate(0,14)">' +
    st(92, 62, 12, 5, Y) + st(120, 52, 16, 6.5, Y) + st(148, 62, 12, 5, Y) +
    `<polygon points="30,96 58,96 58,128 30,128 40,112" fill="${B}"/><polygon points="210,96 182,96 182,128 210,128 200,112" fill="${B}"/>` +
    `<rect x="44" y="86" width="152" height="38" fill="${N}"/>` + t(120, 111, 16, 800, W, "AI CHAMPIONS", 'letter-spacing="0.3"') +
    tag(140, Y, N) + "</g>");

  add("Losange", "IA", "Dégradé", light +
    `<defs><linearGradient id="g29" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${B}"/><stop offset="1" stop-color="${C}"/></linearGradient></defs>` +
    `<rect x="78" y="44" width="84" height="84" rx="16" fill="url(#g29)" transform="rotate(45 120 86)"/>` + sp(120, 86, 26, W) + sp(144, 62, 7, Y) + wmA(182, N, B));

  add("Boucle infinie", "Apprentissage", "Dégradé", light +
    `<defs><linearGradient id="g30" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${N}"/><stop offset="1" stop-color="${C}"/></linearGradient></defs>` +
    `<path d="M120 90C104 66 66 62 66 90S104 114 120 90S174 62 174 90S136 114 120 90Z" fill="none" stroke="url(#g30)" stroke-width="13" stroke-linejoin="round"/>` +
    sp(120, 90, 15, Y) + wmA(172, N, B));

  add("Éclair", "Énergie", "Emblème", dark +
    `<circle cx="120" cy="88" r="56" fill="${B}"/><polygon points="128,40 92,96 116,96 108,138 148,78 124,78" fill="${Y}"/>` + sp(160, 50, 9, C) + wmA(184, W, Y));

  add("Boussole", "Cap", "Emblème", light +
    `<circle cx="120" cy="88" r="54" fill="${N}"/><circle cx="120" cy="88" r="44" fill="none" stroke="${C}" stroke-width="2" stroke-dasharray="3 6"/>` +
    `<polygon points="120,44 132,88 120,96 108,88" fill="${Y}"/><polygon points="120,132 108,88 120,80 132,88" fill="${W}"/><circle cx="120" cy="88" r="5" fill="${N}"/>` + wmA(180, N, B));

  return L;
})();
