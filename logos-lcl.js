// Série « charte LCL » — 24 propositions Champions IA (identifiants 33 à 56).
// Palette relevée sur lcl.fr : indigo #272E80 et jaune #FFD300 (logo), bleus secondaires
// #1F368B, #3E61E1, #727EFD, #D4DEFF, gris #393939 ; typographie Montserrat.
// À valider avec la direction de la marque avant tout usage officiel.
const LOGOS_LCL = (function () {
  const I = "#272E80", Y = "#FFD300", W = "#FFFFFF", B1 = "#1F368B", B2 = "#3E61E1", B3 = "#727EFD", LB = "#D4DEFF", G = "#393939";
  const M = "Montserrat, Arial, sans-serif";
  const f1 = (v) => (Math.round(v * 10) / 10).toString();

  const txt = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" text-anchor="${o.anchor || "middle"}" font-family="${o.font || M}" font-weight="${o.weight || 800}" font-size="${o.size || 20}" fill="${o.fill || W}"` +
    (o.ls ? ` letter-spacing="${o.ls}"` : "") + (o.len ? ` textLength="${o.len}" lengthAdjust="spacingAndGlyphs"` : "") +
    (o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}" paint-order="stroke" stroke-linejoin="round"` : "") +
    (o.style ? ` font-style="${o.style}"` : "") + `>${s}</text>`;

  function wm(y, o = {}) {
    const size = o.size || 20, w = o.w || 132, pw = size * 1.6, gap = 6, x0 = 120 - (w + gap + pw) / 2;
    let s = txt(x0, y, "CHAMPIONS", { anchor: "start", weight: o.weight, size, fill: o.fill || W, len: w });
    const px = x0 + w + gap, ph = size * 1.08;
    s += `<rect x="${f1(px)}" y="${f1(y - size * 0.86)}" width="${f1(pw)}" height="${f1(ph)}" rx="${f1(o.square ? 3 : ph / 2)}" fill="${o.pill || Y}"/>`;
    s += txt(px + pw / 2, y - size * 0.05, "IA", { weight: o.weight, size: size * 0.78, fill: o.pillInk || I });
    if (o.lcl !== false) s += txt(120, y + size + 4, "LCL", { weight: 600, size: 11, fill: o.lcl || Y, ls: 6 });
    return s;
  }
  function motif(cx, cy, s, cc = Y, ic = W, sw) {
    const k = s / 40;
    return `<path d="M${f1(cx - 26 * k)} ${f1(cy - 19 * k)}L${f1(cx - 4 * k)} ${f1(cy)}L${f1(cx - 26 * k)} ${f1(cy + 19 * k)}" fill="none" stroke="${cc}" stroke-width="${f1(sw || 10 * k)}" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="${f1(cx + 18 * k)}" cy="${f1(cy - 22 * k)}" r="${f1(7 * k)}" fill="${ic}"/>` +
      `<rect x="${f1(cx + 11 * k)}" y="${f1(cy - 9 * k)}" width="${f1(14 * k)}" height="${f1(30 * k)}" rx="${f1(7 * k)}" fill="${ic}"/>`;
  }
  const sparkle = (cx, cy, r, fill) => {
    const k = r * 0.16;
    return `<path d="M${cx} ${cy - r}Q${cx + k} ${cy - k} ${cx + r} ${cy}Q${cx + k} ${cy + k} ${cx} ${cy + r}Q${cx - k} ${cy + k} ${cx - r} ${cy}Q${cx - k} ${cy - k} ${cx} ${cy - r}Z" fill="${fill}"/>`;
  };
  const star = (cx, cy, R, r, fill, n = 5) => {
    const p = [];
    for (let i = 0; i < n * 2; i++) {
      const a = (Math.PI / n) * i - Math.PI / 2, d = i % 2 ? r : R;
      p.push(`${f1(cx + d * Math.cos(a))},${f1(cy + d * Math.sin(a))}`);
    }
    return `<polygon points="${p.join(" ")}" fill="${fill}"/>`;
  };
  const frame = (fill) => `<rect width="240" height="240" rx="28" fill="${fill}"/>`;
  const clip = (id) => `<clipPath id="${id}"><rect width="240" height="240" rx="28"/></clipPath>`;

  const L = [];
  const add = (name, style, svg) => L.push({ id: 33 + L.length, name, style, svg, serie: L.length < 24 ? "Charte LCL" : "Héritage" });

  // 33 — Carré de marque
  add("Carré de marque", "Signature LCL", frame(I) + motif(124, 80, 46) + wm(150) +
    txt(120, 204, "Pour aller de l'avant avec l'IA", { weight: 500, size: 10.5, fill: W }));

  // 34 — Lettrage fin
  add("Lettrage fin", "Typographie légère", frame(I) +
    txt(120, 112, "CHAMPIONS", { weight: 300, size: 34, fill: Y, len: 196, ls: 1 }) +
    `<rect x="94" y="128" width="52" height="30" rx="4" fill="none" stroke="${W}" stroke-width="2"/>` + txt(120, 150, "IA", { weight: 300, size: 22, fill: W, ls: 3 }) +
    `<line x1="40" y1="186" x2="200" y2="186" stroke="${Y}" stroke-opacity=".5"/>` + txt(120, 208, "LCL", { weight: 500, size: 12, fill: Y, ls: 8 }));

  // 35 — Sceau rond
  add("Sceau rond", "Badge circulaire",
    `<defs><path id="L35t" d="M52 120A68 68 0 0 1 188 120"/><path id="L35b" d="M44 120A76 76 0 0 0 196 120"/></defs>` + frame(LB) +
    `<circle cx="120" cy="120" r="98" fill="${I}"/><circle cx="120" cy="120" r="90" fill="none" stroke="${Y}" stroke-width="3"/><circle cx="120" cy="120" r="58" fill="${B1}"/>` +
    `<text font-family="${M}" font-weight="800" font-size="15" fill="${W}" letter-spacing="2.5" text-anchor="middle"><textPath href="#L35t" startOffset="50%">CHAMPIONS IA</textPath></text>` +
    `<text font-family="${M}" font-weight="700" font-size="13" fill="${Y}" letter-spacing="6" text-anchor="middle"><textPath href="#L35b" startOffset="50%">LCL</textPath></text>` +
    motif(124, 122, 40) + star(46, 128, 5, 2, Y) + star(194, 128, 5, 2, Y));

  // 36 — Diagonale
  add("Diagonale", "Aplats tranchés", `<defs>${clip("L36c")}</defs><g clip-path="url(#L36c)">` +
    `<rect width="240" height="240" fill="${I}"/><polygon points="0,146 240,118 240,240 0,240" fill="${Y}"/></g>` +
    motif(92, 78, 44) + txt(24, 196, "CHAMPIONS", { anchor: "start", size: 24, fill: I, len: 150 }) +
    txt(24, 222, "IA · LCL", { anchor: "start", weight: 700, size: 13, fill: I, ls: 4 }));

  // 37 — Cube isométrique
  add("Cube isométrique", "Isométrie 3D", frame(I) +
    `<polygon points="120,30 172,60 120,90 68,60" fill="${Y}"/><polygon points="68,60 120,90 120,150 68,120" fill="${B2}"/><polygon points="172,60 120,90 120,150 172,120" fill="${B1}"/>` +
    `<g transform="matrix(.866 .5 0 1 68 60)">` + motif(30, 32, 26, W, W) + `</g>` +
    `<g transform="matrix(.866 -.5 0 1 120 90)">` + sparkle(30, 30, 14, Y) + `</g>` + wm(186));

  // 38 — Trait continu
  add("Trait continu", "Line art", frame(W) +
    `<path d="M58 54L98 90L58 126C82 146 124 146 144 126V84" fill="none" stroke="${I}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<circle cx="144" cy="60" r="8" fill="${Y}"/><circle cx="58" cy="54" r="5" fill="${Y}"/>` + wm(182, { fill: I, pill: Y, pillInk: I, lcl: I }));

  // 39 — Trame
  add("Trame", "Demi-teinte", frame(I) +
    (function () {
      let s = "";
      for (let y = 18; y < 140; y += 10) for (let x = 18; x < 230; x += 10) {
        const d = Math.hypot(x - 150, y - 70), r = Math.max(0, 4.4 - d / 22);
        if (r > 0.4) s += `<circle cx="${x}" cy="${y}" r="${f1(r)}" fill="${B3}"/>`;
      }
      return s;
    })() + `<circle cx="150" cy="70" r="26" fill="${Y}"/>` + motif(80, 88, 40, Y, W) + wm(182));

  // 40 — Ville
  add("Ma ville", "Skyline urbain", `<defs>${clip("L40c")}<linearGradient id="L40s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${B1}"/><stop offset="1" stop-color="${I}"/></linearGradient></defs>` +
    `<g clip-path="url(#L40c)"><rect width="240" height="240" fill="url(#L40s)"/><circle cx="168" cy="58" r="22" fill="${Y}"/>` +
    `<g fill="${B2}"><rect x="10" y="88" width="34" height="80"/><rect x="48" y="62" width="26" height="106"/><rect x="78" y="96" width="30" height="72"/><rect x="112" y="48" width="32" height="120"/><rect x="148" y="84" width="26" height="84"/><rect x="178" y="70" width="36" height="98"/><rect x="216" y="100" width="24" height="68"/></g>` +
    (function () {
      let s = "";
      const lit = [[54, 72], [60, 90], [118, 60], [130, 74], [118, 100], [184, 80], [196, 96], [20, 100], [154, 96], [88, 108], [130, 126]];
      lit.forEach(([x, y]) => (s += `<rect x="${x}" y="${y}" width="6" height="7" fill="${Y}"/>`));
      return s;
    })() + `<rect y="168" width="240" height="72" fill="${I}"/></g>` + motif(166, 58, 22, I, I) + wm(200, { size: 19, w: 124 }));

  // 41 — Bulle assistant
  add("Bulle assistant", "Conversationnel", frame(LB) +
    `<path d="M56 44H184A20 20 0 0 1 204 64V116A20 20 0 0 1 184 136H104L78 158V136H56A20 20 0 0 1 36 116V64A20 20 0 0 1 56 44Z" fill="${I}"/>` +
    motif(124, 90, 40) + `<g fill="${B3}"><circle cx="164" cy="120" r="4"/><circle cx="176" cy="120" r="4"/><circle cx="188" cy="120" r="4"/></g>` +
    wm(194, { fill: I, lcl: I }));

  // 42 — Trophée plat
  add("Trophée plat", "Pictogramme", frame(I) +
    `<path d="M86 40H154V72C154 94 139 108 120 108C101 108 86 94 86 72Z" fill="${Y}"/>` +
    `<path d="M86 50H68C66 72 76 84 92 86M154 50H172C174 72 164 84 148 86" fill="none" stroke="${Y}" stroke-width="6"/>` +
    `<rect x="113" y="108" width="14" height="16" fill="${Y}"/><rect x="96" y="124" width="48" height="10" rx="3" fill="${W}"/>` +
    motif(122, 72, 22, I, I) + wm(176));

  // 43 — Néon de marque
  add("Néon de marque", "Néon", `<defs><filter id="L43f" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>` +
    frame("#14184A") + `<g filter="url(#L43f)"><rect x="18" y="18" width="204" height="204" rx="22" fill="none" stroke="${B3}" stroke-width="2"/>` +
    `<path d="M88 60L112 80L88 100" fill="none" stroke="${Y}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<circle cx="138" cy="58" r="6" fill="none" stroke="${W}" stroke-width="4"/><rect x="131" y="72" width="14" height="30" rx="7" fill="none" stroke="${W}" stroke-width="4"/>` +
    txt(120, 154, "CHAMPIONS IA", { weight: 700, size: 20, fill: "#FFF6C2", len: 176 }) + txt(120, 184, "LCL", { weight: 600, size: 12, fill: B3, ls: 8 }) + `</g>`);

  // 44 — Pixel de marque
  add("Pixel de marque", "Pixel art", frame(I) +
    (function () {
      const rows = ["XX.......XX", ".XX........", "..XX.....XX", "...XX....XX", "..XX.....XX", ".XX......XX", "XX.......XX"];
      let s = "";
      rows.forEach((r, y) => [...r].forEach((c, x) => {
        if (c !== "X") return;
        const px = 65 + x * 10, py = 44 + y * 10;
        s += `<rect x="${px + 3}" y="${py + 3}" width="10" height="10" fill="${B1}"/><rect x="${px}" y="${py}" width="10" height="10" fill="${x < 6 ? Y : W}"/>`;
      }));
      return s;
    })() + wm(158, { square: true }) + `<g fill="${B3}"><rect x="30" y="30" width="5" height="5"/><rect x="200" y="40" width="5" height="5"/><rect x="190" y="200" width="5" height="5"/><rect x="40" y="206" width="5" height="5"/></g>`);

  // 45 — Empilé
  add("Empilé", "Typo éditoriale", frame(W) +
    `<rect x="24" y="24" width="18" height="18" fill="${Y}"/>` +
    txt(24, 92, "CHAM", { anchor: "start", size: 54, fill: I, len: 168 }) + txt(24, 144, "PIONS", { anchor: "start", size: 54, fill: I, len: 192 }) +
    `<rect x="24" y="160" width="62" height="36" rx="6" fill="${Y}"/>` + txt(55, 188, "IA", { size: 28, fill: I }) +
    txt(216, 190, "LCL", { anchor: "end", weight: 700, size: 13, fill: I, ls: 5 }) + motif(196, 40, 16, I, I));

  // 46 — En avant
  add("En avant", "Mouvement", `<defs><linearGradient id="L46g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${Y}" stop-opacity=".2"/><stop offset="1" stop-color="${Y}"/></linearGradient></defs>` +
    frame(I) +
    [[46, 0.25], [76, 0.5], [106, 1]].map(([x, o]) => `<path d="M${x} 52L${x + 34} 86L${x} 120" fill="none" stroke="${Y}" stroke-opacity="${o}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>`).join("") +
    `<circle cx="168" cy="58" r="8" fill="${W}"/><rect x="160" y="74" width="16" height="46" rx="8" fill="${W}"/>` +
    `<rect x="30" y="140" width="180" height="4" rx="2" fill="url(#L46g)"/>` + wm(178));

  // 47 — Réseau
  add("Réseau neuronal", "Data / réseau", frame(I) +
    (function () {
      const n = [[56, 60], [56, 100], [56, 140], [120, 48], [120, 92], [120, 136], [184, 76], [184, 118]];
      const e = [[0, 3], [0, 4], [1, 3], [1, 4], [1, 5], [2, 4], [2, 5], [3, 6], [4, 6], [4, 7], [5, 7], [3, 7]];
      let s = e.map(([a, b]) => `<line x1="${n[a][0]}" y1="${n[a][1]}" x2="${n[b][0]}" y2="${n[b][1]}" stroke="${B3}" stroke-width="2" stroke-opacity=".7"/>`).join("");
      n.forEach(([x, y], i) => (s += `<circle cx="${x}" cy="${y}" r="${i === 4 ? 13 : 7}" fill="${i === 4 || i > 5 ? Y : W}"/>`));
      return s;
    })() + motif(121, 92, 12, I, I) + wm(186));

  // 48 — Dégradé de marque
  add("Dégradé", "Gradient moderne", `<defs><linearGradient id="L48g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${B3}"/><stop offset=".45" stop-color="${B2}"/><stop offset="1" stop-color="${I}"/></linearGradient>` +
    `<radialGradient id="L48h" cx=".8" cy=".15" r=".6"><stop offset="0" stop-color="${Y}" stop-opacity=".55"/><stop offset="1" stop-color="${Y}" stop-opacity="0"/></radialGradient></defs>` +
    frame("url(#L48g)") + frame("url(#L48h)") +
    `<rect x="70" y="36" width="100" height="100" rx="30" fill="${W}" fill-opacity=".16" stroke="${W}" stroke-opacity=".5"/>` + motif(124, 88, 40) + wm(176));

  // 49 — Blason de marque
  add("Blason", "Écusson", frame(LB) +
    `<path d="M120 22L178 40V96C178 132 152 156 120 168C88 156 62 132 62 96V40Z" fill="${I}"/><path d="M62 40L120 22L178 40V62H62Z" fill="${Y}"/>` +
    txt(120, 56, "LCL", { weight: 800, size: 16, fill: I, ls: 6 }) + motif(124, 106, 38) +
    txt(120, 200, "CHAMPIONS", { size: 22, fill: I, len: 170 }) + `<rect x="98" y="208" width="44" height="18" rx="9" fill="${Y}"/>` + txt(120, 222, "IA", { size: 13, fill: I }));

  // 50 — Papier découpé
  add("Papier découpé", "Paper cut", `<defs><filter id="L50s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#0A0F3A" flood-opacity=".45"/></filter></defs>` +
    frame(I) +
    `<g filter="url(#L50s)"><circle cx="120" cy="92" r="74" fill="${B1}"/><circle cx="120" cy="92" r="58" fill="${B2}"/><circle cx="120" cy="92" r="42" fill="${B3}"/><circle cx="120" cy="92" r="27" fill="${Y}"/></g>` +
    motif(122, 93, 22, I, I) + wm(196));

  // 51 — Tampon
  add("Tampon", "Encre / tampon", `<defs><filter id="L51r"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3"/></filter>` +
    `<mask id="L51m"><rect width="240" height="240" fill="#fff"/><g fill="#000">${(function () {
      let s = "";
      let seed = 51;
      const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (let i = 0; i < 160; i++) s += `<circle cx="${f1(30 + r() * 180)}" cy="${f1(30 + r() * 180)}" r="${f1(0.5 + r() * 1.6)}"/>`;
      return s;
    })()}</g></mask></defs>` + frame("#F7F5EF") +
    `<g filter="url(#L51r)" mask="url(#L51m)" transform="rotate(-6 120 120)"><rect x="34" y="50" width="172" height="140" rx="10" fill="none" stroke="${I}" stroke-width="6"/><rect x="44" y="60" width="152" height="120" rx="6" fill="none" stroke="${I}" stroke-width="2"/>` +
    txt(120, 112, "CHAMPIONS", { size: 26, fill: I, len: 140 }) + txt(120, 146, "IA", { size: 30, fill: I }) + txt(120, 170, "★ LCL ★", { weight: 700, size: 11, fill: I, ls: 4 }) + `</g>` +
    `<circle cx="186" cy="62" r="16" fill="${Y}"/>`);

  // 52 — Étincelle
  add("Étincelle", "Minimal", frame(I) + sparkle(120, 84, 46, Y) + sparkle(160, 46, 12, W) + sparkle(78, 120, 7, B3) + wm(178));

  // 53 — Robot de marque
  add("Compagnon IA", "Mascotte", frame(LB) +
    `<line x1="120" y1="42" x2="120" y2="26" stroke="${I}" stroke-width="4" stroke-linecap="round"/><circle cx="120" cy="24" r="7" fill="${Y}"/>` +
    `<rect x="70" y="42" width="100" height="84" rx="30" fill="${I}"/><rect x="84" y="62" width="72" height="34" rx="17" fill="${Y}"/>` +
    `<circle cx="104" cy="79" r="7" fill="${I}"/><circle cx="136" cy="79" r="7" fill="${I}"/><path d="M108 108Q120 116 132 108" fill="none" stroke="${W}" stroke-width="4" stroke-linecap="round"/>` +
    `<rect x="60" y="70" width="10" height="26" rx="5" fill="${B2}"/><rect x="170" y="70" width="10" height="26" rx="5" fill="${B2}"/>` +
    wm(172, { fill: I, lcl: I }));

  // 54 — Bannière de marque
  add("Bannière", "Ruban", frame(I) +
    star(96, 62, 11, 4.5, Y) + star(120, 50, 15, 6, Y) + star(144, 62, 11, 4.5, Y) +
    `<polygon points="26,96 56,96 56,130 26,130 36,113" fill="${B1}"/><polygon points="214,96 184,96 184,130 214,130 204,113" fill="${B1}"/>` +
    `<rect x="42" y="86" width="156" height="40" fill="${Y}"/>` + txt(120, 113, "CHAMPIONS IA", { size: 17, fill: I, len: 136 }) +
    txt(120, 164, "LCL", { weight: 600, size: 14, fill: W, ls: 8 }) + txt(120, 196, "Pour aller de l'avant", { weight: 500, size: 10, fill: LB }));

  // 55 — Mosaïque
  add("Mosaïque", "Géométrique", frame(W) +
    (function () {
      const c = [I, Y, B2, B3, B1, LB];
      let s = "";
      for (let r = 0; r < 3; r++) for (let q = 0; q < 4; q++) {
        const x = 24 + q * 48, y = 20 + r * 44, k = (r * 4 + q) % 6, col = c[(r * 5 + q * 3) % 6];
        if (k % 3 === 0) s += `<rect x="${x}" y="${y}" width="44" height="40" fill="${col}"/>`;
        else if (k % 3 === 1) s += `<path d="M${x} ${y + 40}V${y}A44 40 0 0 1 ${x + 44} ${y + 40}Z" fill="${col}"/>`;
        else s += `<circle cx="${x + 22}" cy="${y + 20}" r="18" fill="${col}"/>`;
      }
      return s;
    })() + wm(184, { fill: I, lcl: I }));

  // 56 — Signature manuscrite
  add("Signature", "Manuscrit", frame(I) +
    txt(120, 116, "Champions", { font: "Pacifico, cursive", weight: 400, size: 44, fill: W, len: 190 }) +
    `<path d="M48 142C90 130 150 128 196 136" fill="none" stroke="${Y}" stroke-width="5" stroke-linecap="round"/>` +
    `<rect x="98" y="156" width="44" height="22" rx="11" fill="${Y}"/>` + txt(120, 172, "IA", { size: 14, fill: I }) +
    txt(120, 210, "LCL", { weight: 600, size: 12, fill: Y, ls: 8 }));

  // ---------- Série « Héritage » : clins d'œil aux anciens logos Crédit Lyonnais / LCL ----------
  // Inspirations (sans copie) : l'emblème carré jaune et bleu aux quatre flèches convergeant vers un cercle,
  // lu comme un soleil sur le Rhône (avant 2005) ; les doubles filets autour du nom ; le croissant argenté
  // et le lettrage aux angles arrondis du logo de 2005 ; Lyon, ville d'origine (1863).
  const SILVER = (id) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4F6FB"/><stop offset=".45" stop-color="#B9C0D3"/><stop offset=".55" stop-color="#8E97B0"/><stop offset="1" stop-color="#E3E7F1"/></linearGradient>`;
  // Emblème carré à quatre flèches (x, y = coin haut gauche, w = côté)
  function arrows(x, y, w, sq = Y, ar = I, core) {
    const k = w / 120, cx = x + w / 2, cy = y + w / 2, P = (a, b) => `${f1(x + a * k)},${f1(y + b * k)}`;
    return `<rect x="${x}" y="${y}" width="${w}" height="${w}" fill="${sq}"/>` +
      `<g fill="${ar}"><polygon points="${P(34, 8)} ${P(86, 8)} ${P(60, 42)}"/><polygon points="${P(112, 34)} ${P(112, 86)} ${P(78, 60)}"/>` +
      `<polygon points="${P(34, 112)} ${P(86, 112)} ${P(60, 78)}"/><polygon points="${P(8, 34)} ${P(8, 86)} ${P(42, 60)}"/></g>` +
      `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(13 * k)}" fill="${core || ar}"/>`;
  }

  // 57 — Quatre flèches
  add("Quatre flèches", "Héritage · emblème carré", frame(W) + arrows(60, 22, 120) + motif(121, 82, 13, Y, W) +
    `<line x1="32" y1="160" x2="208" y2="160" stroke="${I}" stroke-width="2"/><line x1="32" y1="194" x2="208" y2="194" stroke="${I}" stroke-width="2"/>` +
    txt(120, 184, "CHAMPIONS IA", { size: 19, fill: I, len: 170 }) + txt(120, 216, "LCL", { weight: 700, size: 12, fill: B1, ls: 8 }));

  // 58 — Soleil sur le Rhône
  add("Soleil sur le Rhône", "Héritage · paysage", `<defs>${clip("L58c")}<clipPath id="L58s"><rect x="0" y="0" width="240" height="106"/></clipPath></defs>` +
    `<g clip-path="url(#L58c)"><rect width="240" height="240" fill="${I}"/><g clip-path="url(#L58s)"><circle cx="120" cy="106" r="54" fill="${Y}"/></g>` +
    [[112, B2, 6], [124, B3, 4], [134, LB, 3], [143, B2, 2]].map(([y, c, w]) =>
      `<path d="M0 ${y}C30 ${y - 5} 50 ${y + 5} 80 ${y}S130 ${y - 5} 160 ${y}S210 ${y + 5} 240 ${y}" fill="none" stroke="${c}" stroke-width="${w}"/>`).join("") + `</g>` +
    motif(124, 80, 26, I, I) + wm(186));

  // 59 — Croissant argenté
  add("Croissant argenté", "Héritage 2005", `<defs>${SILVER("L59g")}</defs>` + frame("#161C63") +
    `<path d="M26 166C40 56 168 14 220 104C176 58 70 70 26 166Z" fill="url(#L59g)"/><path d="M26 166C46 92 120 60 180 70C118 78 62 112 26 166Z" fill="${B2}" fill-opacity=".55"/>` +
    txt(120, 146, "CHAMPIONS", { size: 28, fill: Y, len: 186 }) +
    `<rect x="96" y="160" width="48" height="24" rx="12" fill="none" stroke="${Y}" stroke-width="2.5"/>` + txt(120, 178, "IA", { size: 15, fill: Y }) +
    txt(120, 212, "LCL", { weight: 600, size: 12, fill: W, ls: 8 }));

  // 60 — Lettrage arrondi
  add("Lettrage arrondi", "Héritage · lettrage", frame(I) +
    `<path d="M62 36H90V128L78 140H76A14 14 0 0 1 62 126Z" fill="${Y}"/>` +
    `<path d="M104 140L132 36H156L184 140H158L152 118H136L130 140Z" fill="${Y}"/><path d="M140 100H148L144 82Z" fill="${I}"/>` +
    txt(120, 178, "CHAMPIONS", { size: 22, fill: W, len: 176 }) + txt(120, 206, "LCL", { weight: 600, size: 12, fill: Y, ls: 8 }));

  // 61 — Monogramme C·L
  add("Monogramme C·L", "Héritage · monogramme", frame(Y) +
    `<path d="M141.5 56.5A46 46 0 1 0 141.5 121.5" fill="none" stroke="${I}" stroke-width="20"/>` +
    `<path d="M128 58H148V112H184V132H128Z" fill="${W}" stroke="${I}" stroke-width="4" stroke-linejoin="round"/>` +
    sparkle(178, 56, 12, I) +
    `<line x1="36" y1="158" x2="204" y2="158" stroke="${I}" stroke-width="2"/>` + txt(120, 186, "CHAMPIONS IA", { size: 19, fill: I, len: 170 }) +
    txt(120, 212, "LCL", { weight: 700, size: 12, fill: I, ls: 8 }));

  // 62 — Double filet
  add("Double filet", "Héritage · corporate 80s", frame(W) + arrows(22, 86, 64) +
    `<line x1="98" y1="88" x2="218" y2="88" stroke="${B1}" stroke-width="2"/><line x1="98" y1="148" x2="218" y2="148" stroke="${B1}" stroke-width="2"/>` +
    txt(98, 114, "CHAMPIONS", { anchor: "start", weight: 700, size: 18, fill: B1, len: 120 }) +
    txt(98, 136, "IA · LCL", { anchor: "start", weight: 600, size: 13, fill: B1, ls: 3 }) +
    txt(120, 196, "L'intelligence artificielle, ensemble", { weight: 500, size: 9.5, fill: G }));

  // 63 — Héritage 1863
  add("Depuis 1863", "Héritage · médaille", `<defs><path id="L63t" d="M54 120A66 66 0 0 1 186 120"/><path id="L63b" d="M46 120A74 74 0 0 0 194 120"/></defs>` + frame("#F4EFE2") +
    `<circle cx="120" cy="120" r="98" fill="${I}"/><circle cx="120" cy="120" r="90" fill="none" stroke="${Y}" stroke-width="2"/><circle cx="120" cy="120" r="56" fill="none" stroke="${Y}" stroke-width="1.5"/>` +
    `<text font-family="${M}" font-weight="800" font-size="16" fill="${W}" letter-spacing="3" text-anchor="middle"><textPath href="#L63t" startOffset="50%">CHAMPIONS IA</textPath></text>` +
    `<text font-family="${M}" font-weight="700" font-size="11" fill="${Y}" letter-spacing="3" text-anchor="middle"><textPath href="#L63b" startOffset="50%">LCL · HÉRITAGE 1863</textPath></text>` +
    arrows(92, 92, 56) + star(46, 126, 5, 2, Y) + star(194, 126, 5, 2, Y));

  // 64 — Lion de Lyon
  add("Lion de Lyon", "Héritage · mascotte", frame(I) +
    star(120, 90, 66, 50, Y, 14) +
    `<circle cx="94" cy="62" r="10" fill="#E0B800"/><circle cx="146" cy="62" r="10" fill="#E0B800"/>` +
    `<polygon points="120,52 150,68 152,102 136,128 104,128 88,102 90,68" fill="#FFE680"/>` +
    `<path d="M100 88Q107 82 114 88M126 88Q133 82 140 88" fill="none" stroke="${I}" stroke-width="4" stroke-linecap="round"/>` +
    `<polygon points="111,102 129,102 120,113" fill="${I}"/><path d="M120 113V120M120 120Q112 126 106 121M120 120Q128 126 134 121" fill="none" stroke="${I}" stroke-width="3" stroke-linecap="round"/>` +
    wm(190));

  return L;
})();

// Étiquettes de style : servent à apprendre les goûts du joueur et à proposer des duels entre logos proches.
const TAG_LABELS = {
  "fond-indigo": "Fond indigo", "fond-clair": "Fond clair", "fond-jaune": "Fond jaune", "fond-sombre": "Fond sombre", "fond-degrade": "Dégradés",
  emblem: "Emblèmes et badges", typo: "Typographie", illus: "Illustrations", picto: "Pictogrammes", mascotte: "Mascottes", geo: "Formes géométriques",
  sobre: "Sobre", moderne: "Moderne", ludique: "Ludique", heritage: "Héritage LCL", motif: "Motif >i",
};
const LOGO_TAGS = {
  33: ["fond-indigo", "typo", "sobre", "motif"],
  34: ["fond-indigo", "typo", "sobre"],
  35: ["fond-clair", "emblem", "sobre", "motif"],
  36: ["fond-jaune", "geo", "moderne", "motif"],
  37: ["fond-indigo", "illus", "geo", "moderne", "motif"],
  38: ["fond-clair", "picto", "moderne", "motif"],
  39: ["fond-indigo", "geo", "moderne", "motif"],
  40: ["fond-indigo", "illus", "ludique", "motif"],
  41: ["fond-clair", "picto", "moderne", "motif"],
  42: ["fond-indigo", "picto", "ludique", "motif"],
  43: ["fond-sombre", "typo", "ludique", "motif"],
  44: ["fond-indigo", "picto", "ludique", "motif"],
  45: ["fond-clair", "typo", "moderne", "motif"],
  46: ["fond-indigo", "geo", "moderne", "motif"],
  47: ["fond-indigo", "illus", "moderne", "motif"],
  48: ["fond-degrade", "geo", "moderne", "motif"],
  49: ["fond-clair", "emblem", "sobre", "motif"],
  50: ["fond-indigo", "geo", "moderne", "motif"],
  51: ["fond-clair", "emblem", "ludique"],
  52: ["fond-indigo", "picto", "sobre"],
  53: ["fond-clair", "mascotte", "ludique"],
  54: ["fond-indigo", "emblem", "sobre"],
  55: ["fond-clair", "geo", "moderne"],
  56: ["fond-indigo", "typo", "ludique"],
  57: ["fond-clair", "emblem", "heritage", "sobre", "motif"],
  58: ["fond-indigo", "illus", "heritage", "motif"],
  59: ["fond-sombre", "typo", "heritage"],
  60: ["fond-indigo", "typo", "heritage", "sobre"],
  61: ["fond-jaune", "emblem", "heritage"],
  62: ["fond-clair", "emblem", "heritage", "sobre"],
  63: ["fond-clair", "emblem", "heritage"],
  64: ["fond-indigo", "mascotte", "heritage", "ludique"],
};
LOGOS_LCL.forEach((l) => (l.tags = LOGO_TAGS[l.id] || []));
