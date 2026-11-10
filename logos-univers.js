// Série « Univers LCL » — 16 propositions (identifiants 65 à 80) qui changent de registre :
// des objets et des scènes tirés de l'univers LCL plutôt qu'un pictogramme + un nom.
// Sources d'inspiration : la banque urbaine (« Ma vie. Ma ville. Ma banque. »), l'identité sonore rock
// « City Energy », la signature « Pour aller de l'avant », la naissance à Lyon en 1863, l'agence,
// la carte, le billet, le coffre. Palette LCL : indigo #272E80, jaune #FFD300, bleus secondaires.
const LOGOS_UNIVERS = (function () {
  const I = "#272E80", Y = "#FFD300", W = "#FFFFFF", B1 = "#1F368B", B2 = "#3E61E1", B3 = "#727EFD", LB = "#D4DEFF";
  const M = "Montserrat, Arial, sans-serif", MONO = "'Space Mono', Menlo, monospace", BEB = "'Bebas Neue', Impact, sans-serif";
  const CIN = "Cinzel, Georgia, serif", MARK = "'Permanent Marker', cursive";
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const txt = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" text-anchor="${o.anchor || "middle"}" font-family="${o.font || M}" font-weight="${o.weight || 800}" font-size="${o.size || 20}" fill="${o.fill || W}"` +
    (o.ls ? ` letter-spacing="${o.ls}"` : "") + (o.len ? ` textLength="${o.len}" lengthAdjust="spacingAndGlyphs"` : "") +
    (o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}" paint-order="stroke" stroke-linejoin="round"` : "") +
    (o.style ? ` font-style="${o.style}"` : "") + (o.tr ? ` transform="${o.tr}"` : "") + `>${s}</text>`;
  function motif(cx, cy, s, cc = Y, ic = W) {
    const k = s / 40;
    return `<path d="M${f1(cx - 26 * k)} ${f1(cy - 19 * k)}L${f1(cx - 4 * k)} ${f1(cy)}L${f1(cx - 26 * k)} ${f1(cy + 19 * k)}" fill="none" stroke="${cc}" stroke-width="${f1(10 * k)}" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="${f1(cx + 18 * k)}" cy="${f1(cy - 22 * k)}" r="${f1(7 * k)}" fill="${ic}"/>` +
      `<rect x="${f1(cx + 11 * k)}" y="${f1(cy - 9 * k)}" width="${f1(14 * k)}" height="${f1(30 * k)}" rx="${f1(7 * k)}" fill="${ic}"/>`;
  }
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
  const add = (name, style, tags, svg) => L.push({ id: 65 + L.length, name, style, tags, svg, serie: "Univers LCL" });

  // 65 — Plaque de rue
  add("Plaque de rue", "Ma ville · plaque émaillée", ["urbain", "objet", "fond-clair", "sobre"],
    frame("#CDBFA8") +
    `<g stroke="#B9A98F" stroke-width="2"><line x1="0" y1="40" x2="240" y2="40"/><line x1="0" y1="200" x2="240" y2="200"/><line x1="80" y1="0" x2="80" y2="40"/><line x1="170" y1="200" x2="170" y2="240"/></g>` +
    `<circle cx="120" cy="44" r="22" fill="${I}" stroke="${W}" stroke-width="3"/>` + motif(122, 46, 18) +
    `<rect x="18" y="78" width="204" height="108" rx="16" fill="#2E7D4F"/><rect x="24" y="84" width="192" height="96" rx="11" fill="${I}" stroke="${W}" stroke-width="2.5"/>` +
    [[32, 92], [208, 92], [32, 172], [208, 172]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#C9CEDA"/>`).join("") +
    txt(120, 108, "RUE DES", { weight: 600, size: 12, ls: 4 }) + txt(120, 140, "CHAMPIONS IA", { size: 22, len: 168 }) +
    txt(120, 162, "LCL · Ma ville", { weight: 600, size: 10, fill: Y, ls: 2 }));

  // 66 — Ligne de métro
  add("Ligne IA", "Ma ville · plan de métro", ["urbain", "illus", "fond-clair", "moderne"],
    frame(W) +
    `<circle cx="46" cy="46" r="22" fill="${Y}"/>` + txt(46, 53, "IA", { size: 18, fill: I }) +
    txt(76, 42, "Ligne", { anchor: "start", weight: 700, size: 13, fill: I }) + txt(76, 58, "Direction : l'avant", { anchor: "start", weight: 500, size: 10, fill: B1 }) +
    `<path d="M24 146H88Q100 146 108 138L126 120Q134 112 146 112H216" fill="none" stroke="${Y}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>` +
    [[50, 146, "Idée"], [96, 143, "Atelier"]].map(([x, y, n]) => `<circle cx="${x}" cy="${y}" r="6" fill="${W}" stroke="${I}" stroke-width="3"/>` + txt(x, y + 22, n, { weight: 600, size: 10, fill: I })).join("") +
    `<circle cx="146" cy="112" r="6" fill="${W}" stroke="${I}" stroke-width="3"/>` + txt(146, 96, "Test", { weight: 600, size: 10, fill: I }) +
    `<rect x="182" y="100" width="34" height="24" rx="12" fill="${W}" stroke="${I}" stroke-width="4"/>` + txt(199, 90, "Champion", { weight: 700, size: 10, fill: I }) +
    txt(120, 202, "CHAMPIONS IA", { size: 21, fill: I, len: 176 }) + txt(120, 222, "LCL", { weight: 700, size: 11, fill: B2, ls: 7 }));

  // 67 — Ticket
  add("Ticket", "Ma ville · titre de transport", ["urbain", "objet", "fond-indigo", "ludique"],
    frame(I) + `<g transform="rotate(-8 120 120)">` +
    `<rect x="34" y="66" width="172" height="108" rx="6" fill="#F3E9C6"/><rect x="34" y="146" width="172" height="14" fill="#7A5A2E"/>` +
        txt(48, 94, "CHAMPIONS IA", { anchor: "start", size: 17, fill: I, len: 128 }) +
    txt(48, 112, "1 TRAJET · ZONES IDÉES 1 → ∞", { anchor: "start", weight: 600, size: 7.5, fill: I, ls: .5 }) +
    txt(48, 130, "Valable pour aller de l'avant", { anchor: "start", weight: 500, size: 8, fill: B1 }) +
    `<rect x="160" y="116" width="36" height="20" rx="3" fill="${Y}"/>` + txt(178, 131, "LCL", { size: 11, fill: I }) + `</g>` +
    txt(120, 214, "Ma vie · Ma ville · Mon IA", { weight: 600, size: 11, fill: LB }));

  // 68 — Carte bancaire
  add("Carte Champion", "Banque · carte", ["banque", "objet", "fond-clair", "moderne"],
    `<defs><linearGradient id="L68c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${B2}"/><stop offset="1" stop-color="${I}"/></linearGradient>` +
    `<linearGradient id="L68p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF0A0"/><stop offset="1" stop-color="#C9A300"/></linearGradient>` +
    `<filter id="L68s" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0B1446" flood-opacity=".35"/></filter></defs>` +
    frame("#E8ECF8") +
    `<g filter="url(#L68s)"><rect x="20" y="52" width="200" height="128" rx="14" fill="url(#L68c)"/></g>` +
    `<path d="M20 150C80 120 150 170 220 120V166A14 14 0 0 1 206 180H34A14 14 0 0 1 20 166Z" fill="${W}" fill-opacity=".08"/>` +
    txt(204, 80, "LCL", { anchor: "end", size: 18, fill: Y, ls: 2 }) +
    `<rect x="38" y="80" width="36" height="28" rx="5" fill="url(#L68p)"/><path d="M38 94H74M56 80V108M46 80V94M66 94V108" stroke="#A08000" stroke-width="1"/>` +
    `<g fill="none" stroke="${W}" stroke-width="2" stroke-linecap="round" opacity=".8"><path d="M86 86A10 10 0 0 1 86 102"/><path d="M92 82A16 16 0 0 1 92 106"/><path d="M98 78A22 22 0 0 1 98 110"/></g>` +
    txt(38, 134, "2026  0000  1863  0IA0", { anchor: "start", font: MONO, weight: 700, size: 11, fill: W, ls: .5 }) +
    txt(38, 160, "CHAMPION IA", { anchor: "start", weight: 700, size: 11, fill: W, ls: 2 }) +
    motif(196, 156, 16) + txt(120, 214, "CHAMPIONS IA", { size: 17, fill: I, len: 150 }));

  // 69 — Billet
  add("Billet", "Banque · gravure guillochée", ["banque", "objet", "heritage", "fond-clair"],
    frame("#EFE6CC") +
    `<rect x="14" y="48" width="212" height="144" rx="6" fill="#DCE3F5" stroke="${I}" stroke-width="2"/><rect x="20" y="54" width="200" height="132" rx="4" fill="none" stroke="${B2}" stroke-width=".8" stroke-dasharray="2 2"/>` +
    (function () {
      let g = "";
      for (let i = 0; i < 18; i++) g += `<ellipse cx="62" cy="120" rx="36" ry="13" fill="none" stroke="${B2}" stroke-width=".7" transform="rotate(${i * 10} 62 120)"/>`;
      for (let i = 0; i < 12; i++) g += `<ellipse cx="62" cy="120" rx="24" ry="8" fill="none" stroke="${I}" stroke-width=".5" transform="rotate(${i * 15 + 5} 62 120)"/>`;
      return g + `<circle cx="62" cy="120" r="14" fill="#DCE3F5"/>` + motif(64, 121, 14, I, I);
    })() +
    txt(204, 96, "IA", { anchor: "end", font: CIN, weight: 900, size: 38, fill: I }) +
    txt(204, 132, "CHAMPIONS", { anchor: "end", font: CIN, weight: 700, size: 15, fill: I, len: 100 }) +
    txt(204, 150, "LCL · DEPUIS 1863", { anchor: "end", font: CIN, weight: 700, size: 7, fill: B1, ls: 1 }) +
    txt(204, 176, "N° 2026 IA 0001", { anchor: "end", font: MONO, weight: 700, size: 8, fill: "#B3261E" }) +
    txt(28, 70, "100", { anchor: "start", font: CIN, weight: 900, size: 12, fill: I }));

  // 70 — Pièce frappée
  add("Pièce frappée", "Banque · médaille en relief", ["banque", "objet", "heritage", "fond-indigo"],
    `<defs><radialGradient id="L70g" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF4B0"/><stop offset=".55" stop-color="#E6BA1E"/><stop offset="1" stop-color="#9A7400"/></radialGradient>` +
    `<path id="L70t" d="M52 120A68 68 0 0 1 188 120"/><path id="L70b" d="M44 120A76 76 0 0 0 196 120"/></defs>` +
    frame(I) + `<circle cx="120" cy="124" r="92" fill="#1A1F5C"/><circle cx="120" cy="120" r="92" fill="url(#L70g)"/>` +
    `<circle cx="120" cy="120" r="84" fill="none" stroke="#9A7400" stroke-width="2" stroke-dasharray="1 3"/><circle cx="120" cy="120" r="56" fill="none" stroke="#B8900A" stroke-width="2"/>` +
    `<text font-family="${CIN}" font-weight="900" font-size="17" fill="#7A5A00" letter-spacing="3" text-anchor="middle"><textPath href="#L70t" startOffset="50%">CHAMPIONS IA</textPath></text>` +
    `<text font-family="${CIN}" font-weight="700" font-size="12" fill="#7A5A00" letter-spacing="4" text-anchor="middle"><textPath href="#L70b" startOffset="50%">LCL · 2026</textPath></text>` +
    `<g transform="translate(1.5 1.5)" opacity=".5">${motif(122, 122, 40, "#7A5A00", "#7A5A00")}</g>` + `<g transform="translate(-1 -1)">${motif(122, 122, 40, "#FFF6C8", "#FFF6C8")}</g>` + motif(122, 122, 40, "#D9AA10", "#D9AA10"));

  // 71 — Vinyle City Energy
  add("Vinyle City Energy", "Son · disque", ["musique", "objet", "fond-sombre", "ludique"],
    frame("#121318") +
    `<circle cx="120" cy="112" r="96" fill="#0B0B0E"/>` +
    (function () {
      let s = "";
      for (let r = 42; r <= 92; r += 3.2) s += `<circle cx="120" cy="112" r="${f1(r)}" fill="none" stroke="#24252C" stroke-width=".9"/>`;
      return s;
    })() +
    `<path d="M52 60A96 96 0 0 1 120 16" fill="none" stroke="#FFFFFF" stroke-opacity=".18" stroke-width="10"/><path d="M188 164A96 96 0 0 1 150 200" fill="none" stroke="#FFFFFF" stroke-opacity=".12" stroke-width="8"/>` +
    `<circle cx="120" cy="112" r="36" fill="${Y}"/>` + motif(121, 104, 20, I, I) +
    txt(120, 130, "CHAMPIONS IA", { weight: 800, size: 6.5, fill: I, ls: .5 }) + txt(120, 139, "City Energy", { weight: 600, size: 5.5, fill: I }) +
    `<circle cx="120" cy="112" r="3" fill="#121318"/>` +
    txt(22, 228, "LCL", { anchor: "start", size: 12, fill: Y, ls: 4 }) + txt(218, 228, "FACE A", { anchor: "end", font: MONO, weight: 700, size: 9, fill: "#8A8D99" }));

  // 72 — Cassette
  add("Cassette", "Son · mixtape", ["musique", "objet", "fond-jaune", "ludique"],
    frame(Y) +
    `<rect x="22" y="50" width="196" height="132" rx="12" fill="${I}"/><path d="M60 182L70 156H170L180 182Z" fill="${B1}"/>` +
    `<rect x="36" y="62" width="168" height="60" rx="4" fill="#F7F1E1"/><rect x="36" y="62" width="168" height="10" fill="${B2}"/>` +
    txt(120, 98, "Champions IA", { font: MARK, weight: 400, size: 20, fill: I, len: 140 }) +
    txt(120, 114, "Face A · Pour aller de l'avant", { weight: 600, size: 7.5, fill: B1 }) +
    `<rect x="74" y="128" width="92" height="24" rx="12" fill="#0E1238"/>` +
    [96, 144].map((x) => `<circle cx="${x}" cy="140" r="9" fill="${W}"/><circle cx="${x}" cy="140" r="4" fill="#0E1238"/>` +
      [0, 60, 120, 180, 240, 300].map((a) => `<rect x="${x - 1}" y="131" width="2" height="4" fill="#0E1238" transform="rotate(${a} ${x} 140)"/>`).join("")).join("") +
    [[30, 58], [210, 58], [30, 174], [210, 174]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="${B3}"/>`).join("") +
    txt(120, 214, "LCL · CITY ENERGY", { size: 11, fill: I, ls: 3 }));

  // 73 — Égaliseur
  add("Égaliseur", "Son · onde urbaine", ["musique", "urbain", "fond-indigo", "moderne"],
    `<defs><linearGradient id="L73g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${Y}"/><stop offset="1" stop-color="${B3}"/></linearGradient></defs>` +
    frame(I) +
    (function () {
      const h = [18, 30, 46, 38, 62, 80, 56, 92, 70, 44, 100, 84, 60, 74, 52, 88, 66, 40, 54, 34, 24, 14];
      let s = "";
      h.forEach((v, i) => {
        const x = 22 + i * 9;
        s += `<rect x="${x}" y="${132 - v}" width="6" height="${v}" rx="2" fill="url(#L73g)"/><rect x="${x}" y="136" width="6" height="${f1(v * 0.3)}" rx="2" fill="${B3}" opacity=".3"/>`;
      });
      return s;
    })() +
    txt(120, 186, "CHAMPIONS IA", { size: 22, fill: W, len: 180 }) + txt(120, 210, "LCL · City Energy", { weight: 600, size: 11, fill: Y, ls: 2 }));

  // 74 — Affiche de concert
  add("Affiche rock", "Son · affiche de tournée", ["musique", "typo", "fond-jaune", "ludique"],
    `<defs><pattern id="L74h" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.6" fill="${I}" opacity=".25"/></pattern>${clip("L74c")}</defs>` +
    frame(Y) + `<g clip-path="url(#L74c)"><polygon points="120,0 240,0 240,120" fill="url(#L74h)"/></g>` +
    txt(20, 36, "LCL PRÉSENTE", { anchor: "start", font: BEB, weight: 400, size: 16, fill: I, ls: 3 }) + star(212, 32, 12, 5, I) +
    txt(120, 108, "CHAMPIONS", { font: BEB, weight: 400, size: 70, fill: I, len: 204 }) +
    txt(104, 196, "IA", { font: BEB, weight: 400, size: 100, fill: I }) +
    `<polygon points="160,112 140,152 156,152 146,190 178,140 162,140 172,112" fill="${I}"/>` +
    `<rect x="20" y="206" width="200" height="2" fill="${I}"/>` +
    txt(120, 226, "TOURNÉE 2026 · POUR ALLER DE L'AVANT", { font: BEB, weight: 400, size: 14, fill: I, ls: 1.5 }));

  // 75 — Façade
  add("Façade", "Ma ville · immeuble haussmannien", ["urbain", "illus", "heritage", "fond-clair"],
    `<defs><linearGradient id="L75s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${LB}"/><stop offset="1" stop-color="#F4F6FF"/></linearGradient>${clip("L75c")}</defs>` +
    `<g clip-path="url(#L75c)"><rect width="240" height="240" fill="url(#L75s)"/>` +
    `<polygon points="34,62 58,30 182,30 206,62" fill="${I}"/>` + [76, 120, 164].map((x) => `<rect x="${x - 8}" y="38" width="16" height="16" rx="8" fill="${Y}"/>`).join("") +
    `<rect x="28" y="60" width="184" height="8" fill="#E2D6C0"/><rect x="36" y="68" width="168" height="172" fill="#F1E8D8"/>` +
    (function () {
      let s = "";
      [80, 124].forEach((y) => [48, 84, 120, 156, 192].forEach((x) => {
        s += `<rect x="${x - 10}" y="${y}" width="20" height="30" rx="2" fill="${y === 80 && x === 120 ? Y : B1}"/><rect x="${x - 13}" y="${y + 30}" width="26" height="4" fill="#CDBFA8"/>`;
      }));
      return s;
    })() +
    `<rect x="36" y="168" width="168" height="26" fill="${I}"/>` + txt(120, 187, "CHAMPIONS IA", { size: 15, fill: Y, len: 140 }) +
    `<path d="M104 240V214A16 16 0 0 1 136 214V240Z" fill="${B1}"/>` + txt(120, 226, "LCL", { weight: 800, size: 9, fill: Y, ls: 1 }) + `</g>`);

  // 76 — Confluence
  add("Confluence", "Lyon · le Rhône et la Saône", ["heritage", "illus", "fond-clair", "moderne"],
    frame("#F4F7FF") +
    `<path d="M14 34C66 54 84 104 120 128" fill="none" stroke="${B3}" stroke-width="12" stroke-linecap="round"/>` +
    `<path d="M226 22C186 64 162 104 120 128" fill="none" stroke="${B2}" stroke-width="12" stroke-linecap="round"/>` +
    `<path d="M120 128C142 142 168 152 198 156" fill="none" stroke="${Y}" stroke-width="16" stroke-linecap="round"/><polygon points="196,140 226,158 194,172" fill="${Y}"/>` +
    txt(44, 76, "Saône", { weight: 600, size: 10, fill: B1, style: "italic" }) + txt(150, 62, "Rhône", { weight: 600, size: 10, fill: B1, style: "italic" }) +
    `<circle cx="120" cy="128" r="20" fill="${I}"/>` + motif(122, 130, 18) +
    txt(120, 200, "CHAMPIONS IA", { size: 21, fill: I, len: 176 }) + txt(120, 220, "LCL · né à Lyon en 1863", { weight: 600, size: 10, fill: B1 }));

  // 77 — Enseigne d'agence
  add("Enseigne d'agence", "Ma ville · devanture", ["urbain", "illus", "fond-sombre", "ludique"],
    `<defs><filter id="L77g" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>${clip("L77c")}</defs>` +
    `<g clip-path="url(#L77c)"><rect width="240" height="240" fill="#23263A"/><rect x="18" y="20" width="204" height="196" fill="#3A3F58"/>` +
    `<rect x="26" y="28" width="188" height="34" rx="4" fill="${I}"/>` + `<g filter="url(#L77g)">` + txt(120, 52, "CHAMPIONS IA", { size: 19, fill: Y, len: 160 }) + `</g>` +
    (function () {
      let s = "";
      for (let i = 0; i < 8; i++) s += `<path d="M${22 + i * 24.5} 68H${46.5 + i * 24.5}V92A12.25 10 0 0 1 ${22 + i * 24.5} 92Z" fill="${i % 2 ? W : Y}"/>`;
      return s;
    })() +
    `<rect x="30" y="104" width="122" height="100" fill="#9DB0FF" opacity=".85"/><rect x="30" y="104" width="122" height="100" fill="none" stroke="${I}" stroke-width="4"/>` +
    `<rect x="64" y="122" width="54" height="64" rx="4" fill="${I}"/>` + motif(92, 150, 22) +
    `<rect x="160" y="104" width="50" height="112" fill="${I}"/><circle cx="200" cy="160" r="3.5" fill="${Y}"/>` + txt(185, 126, "LCL", { size: 11, fill: Y, ls: 1 }) +
    `<rect x="0" y="216" width="240" height="24" fill="#15172A"/></g>`);

  // 78 — Panneau
  add("Panneau", "Pour aller de l'avant · signalisation", ["urbain", "objet", "fond-clair", "sobre"],
    frame("#A9CCEB") +
    `<rect x="70" y="150" width="8" height="90" fill="#7D8597"/><rect x="162" y="150" width="8" height="90" fill="#7D8597"/>` +
    `<rect x="16" y="50" width="208" height="104" rx="10" fill="#1B4F9C"/><rect x="22" y="56" width="196" height="92" rx="7" fill="none" stroke="${W}" stroke-width="2.5"/>` +
    `<path d="M40 128L76 92M58 90H78V110" fill="none" stroke="${W}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<rect x="94" y="68" width="40" height="18" rx="3" fill="${Y}"/>` + txt(114, 82, "LCL", { size: 12, fill: I, ls: 1 }) +
    txt(94, 112, "CHAMPIONS IA", { anchor: "start", size: 15, fill: W, len: 116 }) +
    txt(94, 132, "Pour aller de l'avant", { anchor: "start", weight: 600, size: 10, fill: W }) +
    `<rect x="84" y="166" width="72" height="22" rx="4" fill="${W}" stroke="#1B4F9C" stroke-width="2"/>` + txt(120, 182, "IA  ↗  0 km", { weight: 700, size: 10, fill: "#1B4F9C" }));

  // 79 — Reçu
  add("Reçu", "Banque · ticket de caisse", ["banque", "objet", "typo", "fond-indigo"],
    frame(I) +
    (function () {
      let top = "M52 30", bot = "";
      for (let x = 52; x < 188; x += 8) top += `L${x + 4} 24L${x + 8} 30`;
      for (let x = 188; x > 52; x -= 8) bot += `L${x - 4} 216L${x - 8} 210`;
      return `<path d="${top}V210${bot}Z" fill="#FBF8F0"/>`;
    })() +
    motif(120, 52, 20, I, I) +
    [["LCL ★ AGENCE IA", 80, "middle", 700], ["--------------------", 92, "middle", 400], ["CHAMPIONS IA .... 1", 106, "middle", 700], ["IDÉES ........... ∞", 120, "middle", 400],
      ["AUDACE ...... 100 %", 134, "middle", 400], ["ENTRAIDE ....... OK", 148, "middle", 400], ["--------------------", 160, "middle", 400], ["TOTAL : CHAMPION", 174, "middle", 700]]
      .map(([s, y, a, w]) => txt(120, y, s, { anchor: a, font: MONO, weight: w, size: 9, fill: I })).join("") +
    (function () {
      let s = "", x = 70;
      [2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 1, 3, 1, 2].forEach((w, i) => { if (i % 2 === 0) s += `<rect x="${x}" y="184" width="${w * 1.6}" height="16" fill="${I}"/>`; x += w * 1.6 + 1; });
      return s;
    })());

  // 80 — Coffre-fort
  add("Coffre-fort", "Banque · confiance", ["banque", "objet", "fond-indigo", "sobre"],
    `<defs><radialGradient id="L80s" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#E4E8F2"/><stop offset="1" stop-color="#7C859C"/></radialGradient></defs>` +
    frame("#1A1F5C") +
    `<circle cx="120" cy="98" r="78" fill="url(#L80s)"/><circle cx="120" cy="98" r="62" fill="#9AA2B8"/><circle cx="120" cy="98" r="62" fill="none" stroke="#5E6780" stroke-width="2"/>` +
    (function () {
      let s = "";
      for (let i = 0; i < 12; i++) { const a = (Math.PI / 6) * i; s += `<circle cx="${f1(120 + 70 * Math.cos(a))}" cy="${f1(98 + 70 * Math.sin(a))}" r="3" fill="#5E6780"/>`; }
      [30, 150, 270].forEach((d) => { const a = (d * Math.PI) / 180; s += `<line x1="120" y1="98" x2="${f1(120 + 54 * Math.cos(a))}" y2="${f1(98 + 54 * Math.sin(a))}" stroke="#4A5168" stroke-width="7" stroke-linecap="round"/><circle cx="${f1(120 + 54 * Math.cos(a))}" cy="${f1(98 + 54 * Math.sin(a))}" r="7" fill="#4A5168"/>`; });
      return s;
    })() +
    `<circle cx="120" cy="98" r="30" fill="${I}" stroke="${Y}" stroke-width="3"/>` +
    (function () {
      let s = "";
      for (let i = 0; i < 24; i++) { const a = (Math.PI / 12) * i; s += `<line x1="${f1(120 + 25 * Math.cos(a))}" y1="${f1(98 + 25 * Math.sin(a))}" x2="${f1(120 + 28 * Math.cos(a))}" y2="${f1(98 + 28 * Math.sin(a))}" stroke="${Y}" stroke-width="1"/>`; }
      return s;
    })() + motif(122, 100, 22) +
    txt(120, 202, "CHAMPIONS IA", { size: 21, fill: W, len: 176 }) + txt(120, 222, "LCL", { weight: 700, size: 11, fill: Y, ls: 7 }));

  return L;
})();
if (typeof TAG_LABELS !== "undefined") Object.assign(TAG_LABELS, { urbain: "Univers urbain", objet: "Objets du quotidien", musique: "Musique / City Energy", banque: "Univers bancaire" });
