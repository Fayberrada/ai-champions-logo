// Série « Inspirations » — 9 propositions (identifiants 81 à 89) dessinées à partir de familles de logos
// « AI Champions » repérées par l'organisateur : profil à circuits, bulles colorées, étincelle minimaliste,
// écusson / insigne de promotion. Dessins originaux, repris dans la palette LCL (indigo #272E80, jaune #FFD300).
const LOGOS_INSPI = (function () {
  const I = "#272E80", Y = "#FFD300", W = "#FFFFFF", B1 = "#1F368B", B2 = "#3E61E1", B3 = "#727EFD", LB = "#D4DEFF";
  const M = "Montserrat, Arial, sans-serif", ORB = "Orbitron, Montserrat, sans-serif", FRE = "Fredoka, Montserrat, sans-serif";
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const txt = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" text-anchor="${o.anchor || "middle"}" font-family="${o.font || M}" font-weight="${o.weight || 800}" font-size="${o.size || 20}" fill="${o.fill || W}"` +
    (o.ls ? ` letter-spacing="${o.ls}"` : "") + (o.len ? ` textLength="${o.len}" lengthAdjust="spacingAndGlyphs"` : "") + `>${s}</text>`;
  function motif(cx, cy, s, cc = Y, ic = W) {
    const k = s / 40;
    return `<path d="M${f1(cx - 26 * k)} ${f1(cy - 19 * k)}L${f1(cx - 4 * k)} ${f1(cy)}L${f1(cx - 26 * k)} ${f1(cy + 19 * k)}" fill="none" stroke="${cc}" stroke-width="${f1(10 * k)}" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="${f1(cx + 18 * k)}" cy="${f1(cy - 22 * k)}" r="${f1(7 * k)}" fill="${ic}"/>` +
      `<rect x="${f1(cx + 11 * k)}" y="${f1(cy - 9 * k)}" width="${f1(14 * k)}" height="${f1(30 * k)}" rx="${f1(7 * k)}" fill="${ic}"/>`;
  }
  const star = (cx, cy, R, fill) => {
    const p = [];
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI / 5) * i - Math.PI / 2, d = i % 2 ? R * 0.42 : R;
      p.push(`${f1(cx + d * Math.cos(a))},${f1(cy + d * Math.sin(a))}`);
    }
    return `<polygon points="${p.join(" ")}" fill="${fill}"/>`;
  };
  const frame = (fill) => `<rect width="240" height="240" rx="28" fill="${fill}"/>`;
  // Profil tourné vers la droite (repère d'origine : x 62–204, y 42–198)
  const HEAD = "M100 198L98 172C72 158 62 116 76 86C90 56 122 42 150 46C178 50 194 74 192 100L190 112L204 134L194 140L196 150L192 154L195 160C194 170 186 172 168 172L166 198";
  const TRACES = [
    ["M84 100H110L122 88H140", [84, 100], [140, 88]],
    ["M80 124H104L116 136H134", [80, 124], [134, 136]],
    ["M100 66V82H128L136 72H160", [100, 66], [160, 72]],
    ["M118 112H150L160 102H174", [118, 112], [174, 102]],
    ["M120 150V160H148", [120, 150], [148, 160]],
  ];
  const circuitHead = (tr, line, trace, node, nodeFill, sw = 5) =>
    `<g transform="${tr}"><path d="${HEAD}" fill="none" stroke="${line}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>` +
    TRACES.map(([d, a, b]) => `<path d="${d}" fill="none" stroke="${trace}" stroke-width="3.5" stroke-linejoin="round"/>` +
      [a, b].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${nodeFill}" stroke="${node}" stroke-width="3"/>`).join("")).join("") +
    // circuits qui sortent par l'arrière de la tête
    [[64, 110, 40], [70, 136, 30], [78, 84, 50]].map(([x, y, l]) => `<path d="M${x} ${y}H${x - l}" stroke="${trace}" stroke-width="3.5"/><circle cx="${x - l}" cy="${y}" r="5" fill="${nodeFill}" stroke="${node}" stroke-width="3"/>`).join("") + `</g>`;
  const solidHead = (tr, fill, bars) =>
    `<g transform="${tr}"><path d="${HEAD}Z" fill="${fill}"/>` +
    [[96, 66, 64], [88, 80, 84], [84, 94, 60], [150, 94, 22], [90, 108, 88], [98, 122, 52], [156, 122, 18]]
      .map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="7" rx="3.5" fill="${bars}"/>`).join("") + `</g>`;

  const L = [];
  const add = (name, style, tags, svg) => L.push({ id: 81 + L.length, name, style, tags, svg, serie: "Inspirations" });

  // 81 — Profil à circuits, version claire
  add("Profil circuit", "Tête à circuits · trait", ["tech", "illus", "fond-clair", "sobre"],
    frame(W) + circuitHead("translate(24 -16) scale(.78)", I, I, I, W) +
    txt(120, 196, "CHAMPIONS IA", { font: ORB, weight: 900, size: 19, fill: I, len: 184 }) +
    `<rect x="98" y="208" width="44" height="18" rx="9" fill="${Y}"/>` + txt(120, 222, "LCL", { size: 11, fill: I, ls: 2 }));

  // 82 — Profil à circuits, version nuit
  add("Profil circuit nuit", "Tête à circuits · néon", ["tech", "illus", "fond-indigo", "moderne"],
    `<defs><filter id="L82g" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>` +
    frame(I) + `<g filter="url(#L82g)">` + circuitHead("translate(24 -16) scale(.78)", W, Y, Y, I) + `</g>` +
    txt(120, 196, "CHAMPIONS IA", { font: ORB, weight: 900, size: 19, fill: W, len: 184 }) +
    txt(120, 220, "LCL · POUR ALLER DE L'AVANT", { weight: 700, size: 9, fill: Y, ls: 1.5 }));

  // 83 — Bulles
  add("Bulles", "Pastilles colorées superposées", ["ludique", "geo", "fond-clair", "moderne"],
    frame(W) +
    `<g style="mix-blend-mode:multiply"><circle cx="100" cy="74" r="40" fill="${Y}" opacity=".9"/><circle cx="150" cy="96" r="40" fill="${B3}" opacity=".75"/><circle cx="100" cy="124" r="38" fill="${B2}" opacity=".7"/></g>` +
    `<circle cx="168" cy="40" r="9" fill="${B2}"/><circle cx="60" cy="84" r="7" fill="${Y}"/><circle cx="176" cy="150" r="5" fill="${Y}"/><circle cx="84" cy="168" r="4" fill="${B3}"/><circle cx="182" cy="66" r="4" fill="${B3}"/>` +
    `<circle cx="122" cy="100" r="40" fill="${I}" stroke="${W}" stroke-width="4"/>` + solidHead("translate(55.5 40) scale(.5)", W, I) +
    txt(120, 196, "CHAMPIONS IA", { font: FRE, weight: 700, size: 25, fill: I, len: 184 }) +
    txt(120, 220, "LCL · POUR ALLER DE L'AVANT", { weight: 700, size: 9, fill: "#6B7194", ls: 1.5 }));

  // 84 — Étincelle, format horizontal
  add("Étincelle", "Rayons minimalistes · horizontal", ["minimal", "geo", "fond-clair", "sobre"],
    frame("#F4F5FA") +
    (function () {
      let s = "";
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI / 6) * i - Math.PI / 2, R = i % 2 ? 26 : 36, r = 11;
        const hot = i === 1;
        s += `<line x1="${f1(58 + r * Math.cos(a))}" y1="${f1(108 + r * Math.sin(a))}" x2="${f1(58 + R * Math.cos(a))}" y2="${f1(108 + R * Math.sin(a))}" stroke="${hot ? Y : I}" stroke-width="${hot ? 6 : 4.5}" stroke-linecap="round"/>`;
      }
      return s;
    })() +
    txt(104, 104, "Champions", { anchor: "start", weight: 500, size: 25, fill: I, len: 118 }) +
    txt(104, 132, "IA", { anchor: "start", weight: 800, size: 25, fill: I }) +
    `<rect x="138" y="114" width="40" height="20" rx="10" fill="${Y}"/>` + txt(158, 128, "LCL", { size: 11, fill: I, ls: 1 }) +
    txt(120, 196, "Pour aller de l'avant", { weight: 500, size: 11, fill: "#6B7194" }));

  // 85 — Soleil convergent (clin d'œil aux flèches et au soleil du Crédit Lyonnais)
  add("Soleil convergent", "Rayons vers le centre", ["heritage", "geo", "fond-indigo", "moderne"],
    frame(I) +
    (function () {
      let s = "";
      for (let i = 0; i < 16; i++) {
        const a = (Math.PI / 8) * i - Math.PI / 2, R = 84, r = i % 2 ? 54 : 44;
        const x1 = 120 + R * Math.cos(a), y1 = 96 + R * Math.sin(a), x2 = 120 + r * Math.cos(a), y2 = 96 + r * Math.sin(a);
        const c = i % 4 === 0 ? Y : B3;
        s += `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`;
        if (i % 4 === 0) {
          const px = -Math.sin(a), py = Math.cos(a), bx = x2 + 9 * Math.cos(a), by = y2 + 9 * Math.sin(a);
          s += `<path d="M${f1(bx + 6 * px)} ${f1(by + 6 * py)}L${f1(x2 - 2 * Math.cos(a))} ${f1(y2 - 2 * Math.sin(a))}L${f1(bx - 6 * px)} ${f1(by - 6 * py)}" fill="none" stroke="${Y}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
        }
      }
      return s;
    })() +
    `<circle cx="120" cy="96" r="30" fill="${Y}"/>` + txt(120, 108, "IA", { size: 32, fill: I }) +
    txt(120, 204, "CHAMPIONS IA", { size: 21, fill: W, len: 176 }) + txt(120, 224, "LCL", { weight: 700, size: 11, fill: Y, ls: 7 }));

  // 86 — Écusson
  add("Écusson", "Blason de promotion", ["emblem", "heritage", "fond-clair", "sobre"],
    `<defs><path id="L86a" d="M46 84Q120 26 194 84"/><clipPath id="L86c"><path d="M120 14L206 40V112C206 168 166 204 120 226C74 204 34 168 34 112V40Z"/></clipPath></defs>` +
    frame("#EEF1FB") +
    `<path d="M120 14L206 40V112C206 168 166 204 120 226C74 204 34 168 34 112V40Z" fill="${I}"/>` +
    `<g clip-path="url(#L86c)"><rect x="0" y="164" width="240" height="80" fill="${B2}"/></g>` +
    `<path d="M120 26L194 48V112C194 160 160 192 120 212C80 192 46 160 46 112V48Z" fill="none" stroke="${W}" stroke-width="2.5"/>` +
    `<text font-family="${M}" font-weight="800" font-size="14" fill="${W}" letter-spacing="2" text-anchor="middle"><textPath href="#L86a" startOffset="50%">CHAMPIONS IA</textPath></text>` +
    txt(120, 140, "IA", { weight: 900, size: 62, fill: Y }) +
    [[64, 104], [58, 124], [64, 144], [176, 104], [182, 124], [176, 144]].map(([x, y]) => star(x, y, 7, W)).join("") +
    `<path d="M56 156H184L174 168L184 180H56L66 168Z" fill="${Y}"/>` + txt(120, 172, "LCL · PROMO 2026", { size: 10, fill: I, ls: .5 }));

  // 87 — Écusson parti
  add("Écusson parti", "Blason jaune et indigo", ["emblem", "geo", "fond-clair", "moderne"],
    `<defs><clipPath id="L87c"><path d="M120 14L184 32V92C184 134 156 160 120 176C84 160 56 134 56 92V32Z"/></clipPath></defs>` +
    frame(W) +
    `<g clip-path="url(#L87c)"><rect x="40" y="0" width="80" height="190" fill="${Y}"/><rect x="120" y="0" width="80" height="190" fill="${I}"/></g>` +
    `<path d="M120 14L184 32V92C184 134 156 160 120 176C84 160 56 134 56 92V32Z" fill="none" stroke="${I}" stroke-width="4"/>` +
    motif(122, 96, 44, I, W) +
    txt(120, 206, "CHAMPIONS IA", { size: 21, fill: I, len: 176 }) + txt(120, 226, "LCL", { weight: 700, size: 11, fill: B2, ls: 7 }));

  // 88 — Insigne de promotion
  add("Insigne promo", "Médaillon et ruban", ["emblem", "ludique", "fond-indigo", "moderne"],
    `<defs><path id="L88r" d="M46 100A74 74 0 0 1 194 100"/></defs>` +
    frame("#1A1F5C") +
    `<path d="M70 164L56 214L80 204L94 222L104 176Z" fill="${B2}"/><path d="M170 164L184 214L160 204L146 222L136 176Z" fill="${B2}"/>` +
    `<circle cx="120" cy="100" r="88" fill="${Y}"/><circle cx="120" cy="100" r="62" fill="${I}"/><circle cx="120" cy="100" r="82" fill="none" stroke="${I}" stroke-width="1.5" stroke-dasharray="3 3"/>` +
    `<text font-family="${M}" font-weight="800" font-size="14" fill="${I}"><textPath href="#L88r" startOffset="50%" text-anchor="middle" letter-spacing="2">★ CHAMPIONS IA ★ LCL ★</textPath></text>` +
    `<polygon points="120,62 154,76 120,90 86,76" fill="${W}"/><path d="M98 82V94Q120 104 142 94V82L120 90Z" fill="${W}"/><path d="M150 77V96" stroke="${Y}" stroke-width="2.5"/><circle cx="150" cy="99" r="3.5" fill="${Y}"/>` +
    txt(120, 136, "IA", { size: 36, fill: Y }) +
    `<path d="M46 150H194L184 164L194 178H46L56 164Z" fill="${W}"/>` + txt(120, 169, "PROMOTION 2026", { size: 11, fill: I, ls: 1 }));

  // 89 — Tête data
  add("Tête data", "Silhouette et données", ["tech", "illus", "fond-jaune", "moderne"],
    frame(Y) + solidHead("translate(20 -20) scale(.82)", I, Y) +
    `<circle cx="160" cy="58" r="5" fill="${W}"/>` +
    txt(120, 200, "CHAMPIONS IA", { font: ORB, weight: 900, size: 19, fill: I, len: 184 }) +
    txt(120, 222, "LCL · POUR ALLER DE L'AVANT", { weight: 700, size: 9, fill: I, ls: 1.5 }));

  return L;
})();
if (typeof TAG_LABELS !== "undefined") Object.assign(TAG_LABELS, { tech: "Tech / circuits", minimal: "Minimaliste" });
