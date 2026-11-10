// Identités « Champions IA · LCL » — 32 propositions dans des styles très différents.
// Chaque entrée : id, name, style, svg (contenu interne, viewBox 0 0 240 240).
// Les identifiants sont stables : ils servent au décompte des votes.
const LOGOS = (function () {
  const N = "#0B1446", Y = "#FFC72C", W = "#FFFFFF";
  const FONT = {
    mont: "Montserrat, Arial, sans-serif",
    orb: "Orbitron, Montserrat, sans-serif",
    bebas: "'Bebas Neue', Impact, sans-serif",
    pixel: "'Press Start 2P', monospace",
    mono: "'Space Mono', Menlo, monospace",
    cinzel: "Cinzel, Georgia, serif",
    marker: "'Permanent Marker', 'Comic Sans MS', cursive",
    bungee: "Bungee, Impact, sans-serif",
    pacifico: "Pacifico, cursive",
    varsity: "Graduate, Georgia, serif",
    groovy: "Shrikhand, Georgia, serif",
    round: "Fredoka, Montserrat, sans-serif",
    play: "'Playfair Display', Georgia, serif",
  };

  // Générateur pseudo-aléatoire déterministe (même rendu à chaque chargement)
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const f1 = (v) => (Math.round(v * 10) / 10).toString();

  const txt = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" text-anchor="${o.anchor || "middle"}" font-family="${o.font || FONT.mont}" font-weight="${o.weight || 800}" font-size="${o.size || 20}" fill="${o.fill || W}"` +
    (o.ls ? ` letter-spacing="${o.ls}"` : "") + (o.len ? ` textLength="${o.len}" lengthAdjust="spacingAndGlyphs"` : "") +
    (o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}" paint-order="stroke" stroke-linejoin="round"` : "") +
    (o.style ? ` font-style="${o.style}"` : "") + (o.extra || "") + `>${s}</text>`;

  // Signature : CHAMPIONS [IA] + LCL
  function wm(y, o = {}) {
    const size = o.size || 20, w = o.w || 132, pw = o.pw || size * 1.6, gap = 6;
    const x0 = 120 - (w + gap + pw) / 2;
    let s = txt(x0, y, "CHAMPIONS", { anchor: "start", font: o.font, weight: o.weight, size, fill: o.fill || W, len: w, stroke: o.stroke, sw: o.sw });
    const px = x0 + w + gap, ph = size * 1.08;
    s += `<rect x="${f1(px)}" y="${f1(y - size * 0.86)}" width="${f1(pw)}" height="${f1(ph)}" rx="${f1(o.square ? 3 : ph / 2)}" fill="${o.pill || Y}"${o.pillStroke ? ` stroke="${o.pillStroke}" stroke-width="2"` : ""}/>`;
    s += txt(px + pw / 2, y - size * 0.05, "IA", { font: o.font, weight: o.weight, size: size * 0.78, fill: o.pillInk || N });
    if (o.lcl !== false) s += txt(120, y + size + 2, "LCL", { font: o.lclFont || FONT.mont, weight: 700, size: 10, fill: o.lcl || "#B9C2FF", ls: 5 });
    return s;
  }
  // Le motif « >i »
  function motif(cx, cy, s, cc = Y, ic = W, sw) {
    const k = s / 40;
    return `<path d="M${f1(cx - 26 * k)} ${f1(cy - 19 * k)}L${f1(cx - 4 * k)} ${f1(cy)}L${f1(cx - 26 * k)} ${f1(cy + 19 * k)}" fill="none" stroke="${cc}" stroke-width="${f1(sw || 10 * k)}" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="${f1(cx + 18 * k)}" cy="${f1(cy - 22 * k)}" r="${f1(7 * k)}" fill="${ic}"/>` +
      `<rect x="${f1(cx + 11 * k)}" y="${f1(cy - 9 * k)}" width="${f1(14 * k)}" height="${f1(30 * k)}" rx="${f1(7 * k)}" fill="${ic}"/>`;
  }
  const star = (cx, cy, R, r, fill, n = 5, extra = "") => {
    const p = [];
    for (let i = 0; i < n * 2; i++) {
      const a = (Math.PI / n) * i - Math.PI / 2, d = i % 2 ? r : R;
      p.push(`${f1(cx + d * Math.cos(a))},${f1(cy + d * Math.sin(a))}`);
    }
    return `<polygon points="${p.join(" ")}" fill="${fill}"${extra}/>`;
  };
  const sparkle = (cx, cy, r, fill) => {
    const k = r * 0.16;
    return `<path d="M${cx} ${cy - r}Q${cx + k} ${cy - k} ${cx + r} ${cy}Q${cx + k} ${cy + k} ${cx} ${cy + r}Q${cx - k} ${cy + k} ${cx - r} ${cy}Q${cx - k} ${cy - k} ${cx} ${cy - r}Z" fill="${fill}"/>`;
  };
  const stars = (seed, n, color, maxR = 1.6, box = [0, 0, 240, 240]) => {
    const r = rng(seed);
    let s = "";
    for (let i = 0; i < n; i++) s += `<circle cx="${f1(box[0] + r() * box[2])}" cy="${f1(box[1] + r() * box[3])}" r="${f1(0.4 + r() * maxR)}" fill="${color}" opacity="${f1(0.4 + r() * 0.6)}"/>`;
    return s;
  };
  const arcs = (id, rTop, rBot) =>
    `<path id="${id}t" d="M${120 - rTop} 120A${rTop} ${rTop} 0 0 1 ${120 + rTop} 120"/><path id="${id}b" d="M${120 - rBot} 120A${rBot} ${rBot} 0 0 0 ${120 + rBot} 120"/>`;
  const onArc = (id, s, o) =>
    `<text font-family="${o.font}" font-weight="${o.weight || 800}" font-size="${o.size}" fill="${o.fill}" letter-spacing="${o.ls || 2}" text-anchor="middle"><textPath href="#${id}" startOffset="50%">${s}</textPath></text>`;
  const frame = (fill) => `<rect width="240" height="240" rx="28" fill="${fill}"/>`;
  const clip = (id) => `<clipPath id="${id}"><rect width="240" height="240" rx="28"/></clipPath>`;

  const L = [];
  const add = (name, style, svg) => L.push({ id: L.length + 1, name, style, svg });

  // 1 — Signature (dans l'esprit de la référence)
  add("Signature", "Marque épurée",
    `<defs><radialGradient id="L1g" cx=".3" cy=".15" r="1"><stop offset="0" stop-color="#4E5FE6"/><stop offset="1" stop-color="#1B2272"/></radialGradient></defs>` +
    frame("url(#L1g)") + motif(124, 84, 44) + wm(150));

  // 2 — Néon
  add("Néon", "Néon lumineux",
    `<defs><filter id="L2f" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>` +
    frame("#0A0620") + `<g filter="url(#L2f)">` +
    `<rect x="16" y="16" width="208" height="208" rx="20" fill="none" stroke="#7B2CFF" stroke-width="2"/>` +
    `<path d="M92 62L116 82L92 102" fill="none" stroke="#FF3FD8" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<circle cx="141" cy="60" r="6" fill="none" stroke="#2EF2FF" stroke-width="4"/><rect x="134" y="74" width="14" height="30" rx="7" fill="none" stroke="#2EF2FF" stroke-width="4"/>` +
    txt(100, 156, "CHAMPIONS", { font: FONT.orb, weight: 900, size: 17, fill: "#C9FDFF", len: 128 }) +
    `<rect x="170" y="140" width="34" height="20" rx="4" fill="none" stroke="#FFE45C" stroke-width="2"/>` + txt(187, 155, "IA", { font: FONT.orb, weight: 900, size: 13, fill: "#FFE45C" }) +
    txt(120, 186, "LCL", { font: FONT.orb, weight: 700, size: 11, fill: "#FF3FD8", ls: 6 }) + `</g>`);

  // 3 — Synthwave
  add("Synthwave", "Rétro années 80",
    `<defs>${clip("L3c")}<linearGradient id="L3s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A0B3D"/><stop offset=".55" stop-color="#5B1A7A"/><stop offset="1" stop-color="#FF5E8A"/></linearGradient>` +
    `<linearGradient id="L3u" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE35A"/><stop offset="1" stop-color="#FF3F9A"/></linearGradient>` +
    `<linearGradient id="L3t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#9FE8FF"/><stop offset=".5" stop-color="#2B4BD8"/><stop offset="1" stop-color="#E0F6FF"/></linearGradient>` +
    `<clipPath id="L3k"><circle cx="120" cy="88" r="50"/></clipPath></defs>` +
    `<g clip-path="url(#L3c)"><rect width="240" height="240" fill="url(#L3s)"/>` +
    `<circle cx="120" cy="88" r="50" fill="url(#L3u)"/><g clip-path="url(#L3k)" fill="#4A1470">` +
    [[96, 3], [106, 4], [116, 5], [126, 6]].map(([y, h]) => `<rect x="60" y="${y}" width="120" height="${h}"/>`).join("") + `</g>` +
    `<rect y="138" width="240" height="102" fill="#160832"/><g stroke="#FF4FD8" stroke-width="1.2" opacity=".85">` +
    [144, 152, 163, 178, 198, 226].map((y) => `<line x1="0" y1="${y}" x2="240" y2="${y}"/>`).join("") +
    [-200, -120, -50, 20, 80, 120, 160, 220, 290, 360, 440].map((x) => `<line x1="120" y1="138" x2="${x}" y2="240"/>`).join("") + `</g></g>` +
    txt(120, 146, "CHAMPIONS", { font: FONT.bungee, weight: 400, size: 26, fill: "url(#L3t)", stroke: "#1A0B3D", sw: 3, len: 196 }) +
    `<g transform="rotate(-8 168 178)">` + txt(168, 186, "IA", { font: FONT.pacifico, weight: 400, size: 36, fill: "#FF4FD8", stroke: W, sw: 3 }) + `</g>` +
    txt(120, 222, "LCL", { weight: 700, size: 11, fill: W, ls: 6 }));

  // 4 — Écusson vintage
  add("Écusson vintage", "Badge rétro",
    `<defs>${arcs("L4", 68, 77)}</defs>` + frame("#F1E6CC") +
    `<circle cx="120" cy="120" r="100" fill="#1E2B5C"/><circle cx="120" cy="120" r="92" fill="none" stroke="#E8C66A" stroke-width="2"/>` +
    `<circle cx="120" cy="120" r="60" fill="none" stroke="#E8C66A" stroke-width="1.5"/>` +
    onArc("L4t", "CHAMPIONS", { font: FONT.cinzel, weight: 900, size: 22, fill: "#F1E6CC", ls: 5 }) +
    onArc("L4b", "★ LCL ★", { font: FONT.cinzel, weight: 700, size: 13, fill: "#E8C66A", ls: 4 }) +
    (function () {
      let s = "";
      for (let i = 0; i < 7; i++) {
        const deg = 248 - i * 16, a = (deg * Math.PI) / 180;
        const x = 120 + 46 * Math.cos(a), y = 116 - 46 * Math.sin(a), rot = -deg + 20;
        s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="4" ry="9" fill="#E8C66A" transform="rotate(${rot} ${f1(x)} ${f1(y)})"/>`;
        s += `<ellipse cx="${f1(240 - x)}" cy="${f1(y)}" rx="4" ry="9" fill="#E8C66A" transform="rotate(${-rot} ${f1(240 - x)} ${f1(y)})"/>`;
      }
      return s;
    })() +
    star(120, 96, 7, 3, "#E8C66A") + txt(120, 140, "IA", { font: FONT.cinzel, weight: 900, size: 40, fill: "#F1E6CC" }) +
    star(31, 124, 5, 2, "#E8C66A") + star(209, 124, 5, 2, "#E8C66A"));

  // 5 — Mascotte e-sport (hibou)
  add("Hibou e-sport", "Mascotte gaming",
    `<defs><radialGradient id="L5g" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="#2A2F7A"/><stop offset="1" stop-color="#080A22"/></radialGradient></defs>` +
    frame("url(#L5g)") +
    `<polygon points="70,40 94,62 120,56 146,62 170,40 166,96 150,126 120,140 90,126 74,96" fill="#2B3AB8" stroke="#080A22" stroke-width="4" stroke-linejoin="round"/>` +
    `<polygon points="86,74 120,68 154,74 152,104 120,124 88,104" fill="#E9EEFF"/>` +
    `<circle cx="104" cy="90" r="13" fill="${Y}" stroke="#080A22" stroke-width="3"/><circle cx="136" cy="90" r="13" fill="${Y}" stroke="#080A22" stroke-width="3"/>` +
    `<circle cx="106" cy="92" r="6" fill="#080A22"/><circle cx="134" cy="92" r="6" fill="#080A22"/><circle cx="108" cy="89" r="2" fill="${W}"/><circle cx="136" cy="89" r="2" fill="${W}"/>` +
    `<polygon points="84,72 118,80 118,74 90,64" fill="#080A22"/><polygon points="156,72 122,80 122,74 150,64" fill="#080A22"/>` +
    `<polygon points="113,102 127,102 120,118" fill="#FF9F1C" stroke="#080A22" stroke-width="2" stroke-linejoin="round"/>` +
    `<g transform="skewX(-10) translate(30 0)">` + txt(104, 182, "CHAMPIONS", { font: FONT.bebas, weight: 400, size: 38, fill: W, stroke: "#080A22", sw: 3, len: 132 }) +
    `<rect x="174" y="152" width="34" height="32" rx="4" fill="${Y}" stroke="#080A22" stroke-width="3"/>` + txt(191, 179, "IA", { font: FONT.bebas, weight: 400, size: 30, fill: "#080A22" }) + `</g>` +
    txt(120, 212, "LCL", { font: FONT.bebas, weight: 400, size: 16, fill: "#8C96E8", ls: 8 }));

  // 6 — Pop art
  add("Pop art", "BD pop art",
    `<defs><pattern id="L6p" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="2.2" fill="#F2A900"/></pattern></defs>` +
    frame("#FFD93B") + `<rect width="240" height="240" rx="28" fill="url(#L6p)"/>` +
    star(120, 90, 74, 52, "#E63946", 16, ` stroke="#111" stroke-width="4" stroke-linejoin="round"`) +
    txt(120, 110, "IA !", { font: FONT.bungee, weight: 400, size: 50, fill: W, stroke: "#111", sw: 5 }) +
    txt(120, 196, "CHAMPIONS", { font: FONT.bungee, weight: 400, size: 24, fill: "#1D4ED8", stroke: "#111", sw: 4, len: 192 }) +
    txt(120, 222, "LCL", { font: FONT.bungee, weight: 400, size: 12, fill: "#111", ls: 6 }));

  // 7 — Pixel art
  add("Pixel 8-bit", "Pixel art",
    frame("#14122B") + stars(7, 26, "#8E86FF", 0.8) +
    (function () {
      const rows = ["XX.......XX", ".XX........", "..XX.....XX", "...XX....XX", "..XX.....XX", ".XX......XX", "XX.......XX"];
      let sh = "", fg = "";
      rows.forEach((r, y) => [...r].forEach((c, x) => {
        if (c !== "X") return;
        const px = 65 + x * 10, py = 48 + y * 10, col = x < 6 ? Y : W;
        sh += `<rect x="${px + 4}" y="${py + 4}" width="10" height="10" fill="#5B4BFF"/>`;
        fg += `<rect x="${px}" y="${py}" width="10" height="10" fill="${col}"/>`;
      }));
      return sh + fg;
    })() +
    txt(104, 162, "CHAMPIONS", { font: FONT.pixel, weight: 400, size: 13, fill: W, len: 124 }) +
    `<rect x="172" y="147" width="30" height="20" fill="${Y}"/>` + txt(187, 162, "IA", { font: FONT.pixel, weight: 400, size: 10, fill: "#14122B" }) +
    txt(120, 192, "LCL", { font: FONT.pixel, weight: 400, size: 9, fill: "#8E86FF", ls: 4 }) +
    txt(120, 216, "PRESS START", { font: FONT.pixel, weight: 400, size: 7, fill: Y }));

  // 8 — Terminal
  add("Terminal", "Code / développeur",
    frame("#0D1117") +
    `<rect x="18" y="30" width="204" height="150" rx="10" fill="#161B22" stroke="#30363D"/><path d="M18 52V40a10 10 0 0 1 10-10h184a10 10 0 0 1 10 10v12Z" fill="#21262D"/>` +
    `<circle cx="34" cy="41" r="4" fill="#FF5F56"/><circle cx="48" cy="41" r="4" fill="#FFBD2E"/><circle cx="62" cy="41" r="4" fill="#27C93F"/>` +
    txt(140, 44, "champions-ia — zsh", { font: FONT.mono, weight: 400, size: 8, fill: "#8B949E" }) +
    txt(32, 80, "$ lcl run --ia", { anchor: "start", font: FONT.mono, weight: 400, size: 11, fill: "#8B949E" }) +
    txt(32, 112, "&gt; CHAMPIONS", { anchor: "start", font: FONT.mono, weight: 700, size: 21, fill: "#7EE787", len: 162 }) +
    txt(58, 146, "IA", { anchor: "start", font: FONT.mono, weight: 700, size: 21, fill: Y }) +
    `<rect x="90" y="130" width="12" height="20" fill="${Y}"/>` +
    txt(120, 212, "LCL", { font: FONT.mono, weight: 700, size: 12, fill: "#7EE787", ls: 8 }));

  // 9 — Verre dépoli
  add("Verre dépoli", "Glassmorphism",
    `<defs><filter id="L9b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>${clip("L9c")}</defs>` +
    `<g clip-path="url(#L9c)"><rect width="240" height="240" fill="#E9EBFF"/><g filter="url(#L9b)"><circle cx="64" cy="64" r="62" fill="#6C63FF"/><circle cx="186" cy="96" r="56" fill="#00C8FF"/><circle cx="110" cy="196" r="62" fill="#FF6FC2"/></g></g>` +
    `<rect x="36" y="40" width="168" height="160" rx="28" fill="#FFFFFF" fill-opacity=".22" stroke="#FFFFFF" stroke-opacity=".75" stroke-width="1.5"/>` +
    `<rect x="36" y="40" width="168" height="60" rx="28" fill="#FFFFFF" fill-opacity=".12"/>` +
    motif(124, 92, 40, W, W) + wm(156, { fill: N, pill: N, pillInk: W, lcl: N, size: 19, w: 126 }));

  // 10 — Relief 3D
  add("Relief 3D", "Typo en volume",
    `<defs><linearGradient id="L10b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3B4FD8"/><stop offset="1" stop-color="#141B66"/></linearGradient>` +
    `<linearGradient id="L10f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1A8"/><stop offset=".5" stop-color="#FFC72C"/><stop offset="1" stop-color="#F59E0B"/></linearGradient></defs>` +
    frame("url(#L10b)") +
    (function () {
      let s = "";
      for (let k = 12; k >= 1; k--) s += txt(116 + k, 128 + k, "IA", { size: 100, fill: k > 10 ? "#070B33" : "#0E1442", ls: -4 });
      return s;
    })() + txt(116, 128, "IA", { size: 100, fill: "url(#L10f)", ls: -4 }) +
    sparkle(184, 52, 12, W) + sparkle(54, 172, 6, Y) +
    txt(120, 186, "CHAMPIONS", { size: 22, fill: W, len: 170, ls: 2 }) + txt(120, 210, "LCL", { weight: 700, size: 11, fill: "#C6CDFF", ls: 6 }));

  // 11 — Art déco
  add("Art déco", "Années folles",
    frame("#0E0E10") +
    `<g stroke="#C9A24B" fill="none"><rect x="12" y="12" width="216" height="216" rx="4" stroke-width="2"/><rect x="19" y="19" width="202" height="202" rx="2" stroke-width=".8"/>` +
    [0, 1, 2, 3].map((i) => `<g transform="rotate(${i * 90} 120 120)"><path d="M12 40H24V24H40V12" stroke-width="2"/></g>`).join("") +
    (function () {
      let s = "";
      for (let i = 0; i <= 12; i++) {
        const a = Math.PI + (Math.PI * i) / 12;
        s += `<line x1="120" y1="112" x2="${f1(120 + 92 * Math.cos(a))}" y2="${f1(112 + 92 * Math.sin(a))}" stroke-width="${i % 2 ? 0.7 : 1.4}"/>`;
      }
      return s;
    })() + `<path d="M40 112A80 80 0 0 1 200 112" stroke-width="1.2"/><path d="M62 112A58 58 0 0 1 178 112" stroke-width="1.2"/></g>` +
    `<circle cx="120" cy="96" r="26" fill="#C9A24B"/><circle cx="120" cy="96" r="21" fill="none" stroke="#0E0E10" stroke-width="1.5"/>` +
    txt(120, 107, "IA", { font: FONT.cinzel, weight: 900, size: 26, fill: "#0E0E10" }) +
    `<line x1="40" y1="112" x2="200" y2="112" stroke="#C9A24B" stroke-width="2"/>` +
    txt(120, 160, "CHAMPIONS", { font: FONT.cinzel, weight: 700, size: 24, fill: "#E8CF8A", len: 176 }) +
    `<path d="M70 178H104L120 170L136 178H170" fill="none" stroke="#C9A24B" stroke-width="1.5"/><polygon points="120,165 126,172 120,179 114,172" fill="#C9A24B"/>` +
    txt(120, 202, "LCL", { font: FONT.cinzel, weight: 700, size: 12, fill: "#C9A24B", ls: 8 }));

  // 12 — Bauhaus
  add("Bauhaus", "Bauhaus géométrique",
    frame("#F2EDE4") +
    `<rect x="116" y="28" width="94" height="94" fill="#1F4FBF"/><circle cx="96" cy="82" r="50" fill="#E63B2E"/>` +
    `<polygon points="150,148 214,148 182,94" fill="#F2B705"/><path d="M30 148V122A26 26 0 0 1 56 148Z" fill="#111"/>` +
    `<rect x="30" y="154" width="180" height="5" fill="#111"/>` +
    txt(30, 188, "CHAMPIONS", { anchor: "start", size: 25, fill: "#111", len: 146 }) +
    `<circle cx="196" cy="180" r="17" fill="#111"/>` + txt(196, 186, "IA", { size: 15, fill: "#F2EDE4" }) +
    txt(30, 212, "LCL", { anchor: "start", weight: 600, size: 11, fill: "#111", ls: 7 }));

  // 13 — Plan technique
  add("Plan technique", "Blueprint",
    `<defs><pattern id="L13p" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0V12" fill="none" stroke="#FFFFFF" stroke-opacity=".12"/></pattern>` +
    `<pattern id="L13q" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#FFFFFF" stroke-opacity=".25"/></pattern>${clip("L13c")}</defs>` +
    `<g clip-path="url(#L13c)"><rect width="240" height="240" fill="#1C4E9C"/><rect width="240" height="240" fill="url(#L13p)"/><rect width="240" height="240" fill="url(#L13q)"/></g>` +
    `<g fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"><path d="M88 50H152V80A32 32 0 0 1 88 80Z"/><path d="M88 58H72A14 14 0 0 0 86 88"/><path d="M152 58H168A14 14 0 0 1 154 88"/>` +
    `<path d="M112 112H128V126H112Z"/><path d="M96 126H144V136H96Z"/></g>` +
    `<g stroke="#FFFFFF" stroke-width=".8" fill="none" opacity=".8"><path d="M88 40H152M88 36V44M152 36V44"/><path d="M182 50V136M178 50H186M178 136H186"/><path d="M140 70L170 30H200"/></g>` +
    txt(120, 34, "64", { font: FONT.mono, weight: 400, size: 8 }) + txt(194, 96, "86", { font: FONT.mono, weight: 400, size: 8 }) +
    txt(186, 26, "&gt;i v1.0", { font: FONT.mono, weight: 400, size: 8, fill: Y }) +
    motif(122, 72, 18, Y, Y) +
    txt(120, 168, "CHAMPIONS·IA", { font: FONT.mono, weight: 700, size: 17, len: 168 }) +
    `<rect x="120" y="184" width="92" height="34" fill="none" stroke="#FFFFFF" stroke-width="1"/><line x1="120" y1="200" x2="212" y2="200" stroke="#FFFFFF" stroke-width=".8"/>` +
    txt(166, 196, "LCL", { font: FONT.mono, weight: 700, size: 9, ls: 3 }) + txt(166, 212, "PLAN N° IA-01", { font: FONT.mono, weight: 400, size: 7 }) +
    txt(28, 212, "ÉCH. 1:1", { anchor: "start", font: FONT.mono, weight: 400, size: 7 }));

  // 14 — Patch brodé
  add("Patch brodé", "Écusson textile",
    `<defs><pattern id="L14w" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0L4 4" stroke="#000" stroke-opacity=".06"/></pattern>` +
    `<filter id="L14s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity=".35"/></filter>${arcs("L14", 62, 72)}</defs>` +
    frame("#E6E0D4") + `<rect width="240" height="240" rx="28" fill="url(#L14w)"/>` +
    `<g filter="url(#L14s)"><circle cx="120" cy="120" r="96" fill="#FFC72C"/><circle cx="120" cy="120" r="86" fill="#1E2A78"/></g>` +
    `<circle cx="120" cy="120" r="91" fill="none" stroke="#8A6500" stroke-width="1.2" stroke-dasharray="2 3"/>` +
    `<circle cx="120" cy="120" r="81" fill="none" stroke="#FFE08A" stroke-width="1.5" stroke-dasharray="3 3"/>` +
    `<circle cx="120" cy="120" r="86" fill="url(#L14w)"/>` +
    onArc("L14t", "CHAMPIONS", { font: FONT.mont, size: 19, fill: W, ls: 3 }) +
    onArc("L14b", "IA · LCL", { font: FONT.mont, size: 14, fill: Y, ls: 4 }) +
    motif(124, 122, 44, Y, W));

  // 15 — Sticker
  add("Sticker", "Autocollant",
    `<defs><pattern id="L15p" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="1.4" fill="#9FB0FF"/></pattern>` +
    `<filter id="L15s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="2" dy="5" stdDeviation="4" flood-color="#1B2272" flood-opacity=".35"/></filter></defs>` +
    frame("#DDE5FF") + `<rect width="240" height="240" rx="28" fill="url(#L15p)"/>` +
    (function () {
      const shape = (R, amp) => {
        const p = [];
        for (let i = 0; i < 96; i++) {
          const a = (Math.PI * 2 * i) / 96, r = R + amp * Math.cos(a * 12);
          p.push(`${f1(120 + r * Math.cos(a))},${f1(118 + r * Math.sin(a))}`);
        }
        return p.join(" ");
      };
      return `<g transform="rotate(-8 120 118)"><polygon points="${shape(98, 5)}" fill="#FFFFFF" filter="url(#L15s)"/><polygon points="${shape(88, 5)}" fill="#3B4FD8"/>` +
        motif(124, 92, 40, Y, W) + wm(152, { size: 17, w: 112, lcl: "#C6CDFF" }) + `</g>`;
    })() +
    `<g transform="rotate(14 200 46)"><circle cx="200" cy="46" r="20" fill="#FFFFFF" filter="url(#L15s)"/><circle cx="200" cy="46" r="16" fill="#FF5C93"/>${sparkle(200, 46, 10, W)}</g>`);

  // 16 — Tableau noir
  add("Tableau noir", "Craie dessinée",
    `<defs><filter id="L16r"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.2"/></filter>` +
    `<filter id="L16n"><feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="3"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .07 0"/></filter></defs>` +
    frame("#7A4A22") + `<rect x="10" y="10" width="220" height="220" rx="18" fill="#22382D"/><rect x="10" y="10" width="220" height="220" rx="18" filter="url(#L16n)"/>` +
    `<g filter="url(#L16r)" fill="none" stroke="#F4F1E8" stroke-width="2.5" stroke-linecap="round" opacity=".92">` +
    `<path d="M48 40C48 30 64 28 66 38C68 46 58 50 58 56M54 62H62"/><path d="M178 34L182 44L192 45L184 51L187 61L178 55L169 61L172 51L164 45L174 44Z"/>` +
    `<path d="M150 150C170 152 186 142 192 128M184 130L192 127L194 136" stroke="#FFC72C"/>` +
    `<ellipse cx="166" cy="172" rx="30" ry="18" stroke="#FFC72C" transform="rotate(-6 166 172)"/></g>` +
    `<g filter="url(#L16r)">` + `<g transform="rotate(-5 110 112)">` + txt(112, 116, "Champions", { font: FONT.marker, weight: 400, size: 38, fill: "#F4F1E8", len: 176 }) + `</g>` +
    txt(166, 182, "IA", { font: FONT.marker, weight: 400, size: 30, fill: "#FFC72C" }) +
    `<path d="M52 136C90 132 130 128 172 124" fill="none" stroke="#F4F1E8" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>` +
    txt(64, 206, "LCL", { font: FONT.marker, weight: 400, size: 16, fill: "#9FD6FF", ls: 4 }) + `</g>` +
    `<rect x="150" y="214" width="30" height="6" rx="2" fill="#F4F1E8" opacity=".85"/>`);

  // 17 — Gemme low-poly
  add("Gemme", "Low-poly facetté",
    `<defs>${clip("L17c")}</defs><g clip-path="url(#L17c)"><rect width="240" height="240" fill="#0F1A4A"/>` +
    [["0,0 120,0 40,90", "#13205A"], ["120,0 240,0 200,80", "#111C52"], ["0,240 0,120 70,200", "#13205A"], ["240,240 240,110 170,210", "#16246A"], ["0,0 40,90 0,120", "#0C1640"], ["240,0 200,80 240,110", "#0C1640"]]
      .map(([p, c]) => `<polygon points="${p}" fill="${c}"/>`).join("") + `</g>` +
    (function () {
      const P = { A: [92, 44], B: [148, 44], C: [178, 72], D: [62, 72], G: [96, 72], E: [120, 72], H: [144, 72], X: [120, 146] };
      const tri = (k, c) => `<polygon points="${k.split("").map((q) => P[q].join(",")).join(" ")}" fill="${c}" stroke="#0F1A4A" stroke-width=".6"/>`;
      return tri("DAG", "#7FD8FF") + tri("AEG", "#B9EBFF") + tri("ABE", "#E6F8FF") + tri("BHE", "#9FE1FF") + tri("BCH", "#5CC4F5") +
        tri("DGX", "#2E7BE6") + tri("GEX", "#4B98F2") + tri("EHX", "#1F5BD8") + tri("HCX", "#173FA8");
    })() +
    sparkle(160, 50, 9, W) + sparkle(70, 120, 5, Y) + wm(184));

  // 18 — Holographique
  add("Holographique", "Effet holo",
    `<defs><linearGradient id="L18g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFB3F0"/><stop offset=".25" stop-color="#B3E5FF"/><stop offset=".5" stop-color="#C8FFD9"/><stop offset=".75" stop-color="#FFF1B3"/><stop offset="1" stop-color="#D7B3FF"/></linearGradient>` +
    `<linearGradient id="L18c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".48" stop-color="#C9D1E6"/><stop offset=".52" stop-color="#6E7895"/><stop offset="1" stop-color="#E9EEF8"/></linearGradient>` +
    `<filter id="L18n"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .18 0"/></filter>${clip("L18k")}</defs>` +
    frame("url(#L18g)") + `<rect width="240" height="240" rx="28" filter="url(#L18n)"/>` +
    `<g clip-path="url(#L18k)" stroke="#FFFFFF" stroke-opacity=".5" stroke-width="18"><line x1="-20" y1="120" x2="120" y2="-20"/><line x1="40" y1="250" x2="250" y2="40"/></g>` +
    `<g transform="translate(2 3)" opacity=".35">` + motif(124, 90, 50, "#1B1F5E", "#1B1F5E") + `</g>` + motif(124, 90, 50, "url(#L18c)", "url(#L18c)") +
    wm(168, { fill: "#1B1F5E", pill: "#1B1F5E", pillInk: "#FFF1B3", lcl: "#1B1F5E" }));

  // 19 — Origami
  add("Avion en papier", "Origami",
    frame("#FCEFE6") +
    `<path d="M28 168C52 150 54 128 40 124C26 120 30 150 70 140C100 132 110 122 118 116" fill="none" stroke="#F29E4C" stroke-width="2.5" stroke-dasharray="6 6" stroke-linecap="round"/>` +
    `<polygon points="70,92 204,40 116,112" fill="#6C8CFF"/><polygon points="116,112 204,40 136,148" fill="#3550D6"/>` +
    `<polygon points="116,112 136,148 122,122" fill="#1E2E8A"/><polygon points="70,92 116,112 104,118" fill="#9DB2FF"/>` +
    `<line x1="116" y1="112" x2="204" y2="40" stroke="#FFFFFF" stroke-opacity=".6" stroke-width="1"/>` +
    wm(186, { fill: "#1E2E8A", pill: "#F29E4C", pillInk: W, lcl: "#B4683A" }));

  // 20 — Varsity
  add("Varsity", "Campus américain",
    `<defs><pattern id="L20p" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1" fill="#FFFFFF" opacity=".06"/></pattern></defs>` +
    frame("#0E1D4A") + `<rect width="240" height="240" rx="28" fill="url(#L20p)"/>` +
    `<rect x="14" y="14" width="212" height="212" rx="20" fill="none" stroke="${Y}" stroke-width="2" stroke-dasharray="5 4"/>` +
    txt(112, 140, "C", { font: FONT.varsity, weight: 400, size: 132, fill: Y, stroke: W, sw: 7 }) +
    `<circle cx="162" cy="102" r="21" fill="${W}" stroke="#0E1D4A" stroke-width="3"/>` + txt(162, 109, "IA", { font: FONT.varsity, weight: 400, size: 18, fill: "#0E1D4A" }) +
    txt(120, 184, "CHAMPIONS", { font: FONT.varsity, weight: 400, size: 24, fill: W, len: 180 }) +
    `<rect x="90" y="196" width="60" height="18" rx="3" fill="${Y}"/>` + txt(120, 210, "LCL", { font: FONT.varsity, weight: 400, size: 12, fill: "#0E1D4A", ls: 4 }));

  // 21 — Emblème héroïque
  add("Héroïque", "Comics super-héros",
    `<defs>${clip("L21c")}</defs><g clip-path="url(#L21c)"><rect width="240" height="240" fill="#B3121B"/>` +
    (function () {
      let s = "";
      for (let i = 0; i < 18; i++) {
        const a1 = (Math.PI * 2 * i) / 18, a2 = a1 + Math.PI / 18;
        s += `<polygon points="120,96 ${f1(120 + 260 * Math.cos(a1))},${f1(96 + 260 * Math.sin(a1))} ${f1(120 + 260 * Math.cos(a2))},${f1(96 + 260 * Math.sin(a2))}" fill="#E63946"/>`;
      }
      return s;
    })() + `</g>` +
    `<g fill="${W}" stroke="#111" stroke-width="3" stroke-linejoin="round"><polygon points="84,92 26,66 40,82 18,86 40,98 26,106 48,112 84,112"/><polygon points="156,92 214,66 200,82 222,86 200,98 214,106 192,112 156,112"/></g>` +
    `<polygon points="120,40 166,64 166,112 120,142 74,112 74,64" fill="${Y}" stroke="#111" stroke-width="4" stroke-linejoin="round"/>` +
    `<polygon points="120,50 156,69 156,108 120,131 84,108 84,69" fill="#1D3FBF"/>` +
    `<polygon points="126,58 102,96 118,96 110,124 140,84 124,84" fill="${Y}" stroke="#111" stroke-width="2" stroke-linejoin="round"/>` +
    txt(120, 182, "CHAMPIONS", { font: FONT.bungee, weight: 400, size: 24, fill: Y, stroke: "#111", sw: 5, len: 190 }) +
    `<rect x="98" y="192" width="44" height="22" rx="4" fill="${W}" stroke="#111" stroke-width="3"/>` + txt(120, 209, "IA", { font: FONT.bungee, weight: 400, size: 15, fill: "#111" }) +
    txt(120, 230, "LCL", { weight: 800, size: 9, fill: W, ls: 5 }));

  // 22 — Cosmos
  add("Cosmos", "Spatial",
    `<defs><radialGradient id="L22n" cx=".7" cy=".25" r=".7"><stop offset="0" stop-color="#5A2A9E" stop-opacity=".9"/><stop offset="1" stop-color="#070B2A" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="L22p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7C9BFF"/><stop offset="1" stop-color="#2A2F8F"/></linearGradient>${clip("L22c")}` +
    `<clipPath id="L22f"><rect x="0" y="88" width="240" height="60" transform="rotate(-14 120 88)"/></clipPath></defs>` +
    `<g clip-path="url(#L22c)"><rect width="240" height="240" fill="#070B2A"/><rect width="240" height="240" fill="url(#L22n)"/>${stars(22, 60, W, 1.2)}</g>` +
    `<ellipse cx="120" cy="88" rx="68" ry="16" fill="none" stroke="${Y}" stroke-width="4" transform="rotate(-14 120 88)" opacity=".5"/>` +
    `<circle cx="120" cy="88" r="40" fill="url(#L22p)"/><path d="M86 70C100 76 140 76 156 66" fill="none" stroke="#FFFFFF" stroke-opacity=".25" stroke-width="5"/>` +
    motif(124, 90, 26, Y, W) +
    `<g clip-path="url(#L22f)"><ellipse cx="120" cy="88" rx="68" ry="16" fill="none" stroke="${Y}" stroke-width="4" transform="rotate(-14 120 88)"/></g>` +
    `<g transform="translate(190 36) rotate(40)"><path d="M0 -12C5 -8 6 0 5 8H-5C-6 0 -5 -8 0 -12Z" fill="${W}"/><path d="M-3 9H3L0 17Z" fill="#FF8A3D"/></g>` +
    wm(172, { lcl: "#A9B4FF" }));

  // 23 — Affiche suisse
  add("Affiche suisse", "Style international",
    frame("#FFFFFF") +
    `<g stroke="#000" stroke-opacity=".08"><line x1="60" y1="0" x2="60" y2="240"/><line x1="120" y1="0" x2="120" y2="240"/><line x1="180" y1="0" x2="180" y2="240"/><line x1="0" y1="80" x2="240" y2="80"/><line x1="0" y1="160" x2="240" y2="160"/></g>` +
    `<rect x="176" y="24" width="40" height="40" fill="#E30613"/>` +
    txt(14, 150, "IA", { anchor: "start", size: 136, fill: "#111", ls: -8 }) +
    txt(22, 186, "Champions", { anchor: "start", weight: 700, size: 24, fill: "#111", len: 132 }) +
    txt(22, 214, "LCL — programme interne", { anchor: "start", weight: 500, size: 9, fill: "#111", ls: 1 }) +
    `<rect x="176" y="176" width="40" height="40" fill="none" stroke="#111" stroke-width="2"/>` + motif(198, 198, 16, "#E30613", "#111"));

  // 24 — Groovy 70s
  add("Groovy", "Années 70",
    frame("#F6E7C8") +
    [[92, "#E85D2A"], [76, "#F29E38"], [60, "#F6C744"], [44, "#8DB580"]].map(([r, c]) => `<path d="M${120 - r} 146A${r} ${r} 0 0 1 ${120 + r} 146" fill="none" stroke="${c}" stroke-width="16"/>`).join("") +
    txt(120, 140, "IA", { font: FONT.groovy, weight: 400, size: 34, fill: "#6E3B1F" }) +
    txt(120, 190, "Champions", { font: FONT.groovy, weight: 400, size: 34, fill: "#6E3B1F", stroke: "#F6E7C8", sw: 4, len: 186 }) +
    txt(120, 216, "LCL", { weight: 800, size: 11, fill: "#E85D2A", ls: 7 }) +
    star(36, 40, 8, 3, "#E85D2A", 4) + star(206, 46, 6, 2.4, "#6E3B1F", 4));

  // 25 — Robot kawaii
  add("Robot kawaii", "Mignon / kawaii",
    frame("#FFE3EC") +
    `<line x1="120" y1="44" x2="120" y2="28" stroke="#3B3B6D" stroke-width="4" stroke-linecap="round"/><circle cx="120" cy="25" r="7" fill="${Y}" stroke="#3B3B6D" stroke-width="3"/>` +
    `<rect x="72" y="44" width="96" height="82" rx="32" fill="${W}" stroke="#3B3B6D" stroke-width="4"/>` +
    `<rect x="64" y="72" width="10" height="24" rx="5" fill="#FF8FB1" stroke="#3B3B6D" stroke-width="3"/><rect x="166" y="72" width="10" height="24" rx="5" fill="#FF8FB1" stroke="#3B3B6D" stroke-width="3"/>` +
    `<rect x="86" y="58" width="68" height="46" rx="20" fill="#3B3B6D"/>` +
    `<path d="M98 84Q105 74 112 84M128 84Q135 74 142 84" fill="none" stroke="#7DF9FF" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M113 92Q120 98 127 92" fill="none" stroke="#7DF9FF" stroke-width="3" stroke-linecap="round"/>` +
    `<circle cx="90" cy="114" r="6" fill="#FF8FB1" opacity=".7"/><circle cx="150" cy="114" r="6" fill="#FF8FB1" opacity=".7"/>` +
    sparkle(186, 54, 9, "#FF5C93") + sparkle(52, 50, 6, Y) +
    `<path d="M196 112c-4-6-12-2-8 4l8 7l8-7c4-6-4-10-8-4z" fill="#FF5C93"/>` +
    wm(170, { font: FONT.round, weight: 700, size: 24, w: 132, fill: "#3B3B6D", pill: "#FF5C93", pillInk: W, lcl: "#B0587A", lclFont: FONT.round }));

  // 26 — Trophée doré
  add("Trophée doré", "Illustration réaliste",
    `<defs><radialGradient id="L26b" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#2E40B0"/><stop offset="1" stop-color="#0A1240"/></radialGradient>` +
    `<linearGradient id="L26g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A5A00"/><stop offset=".3" stop-color="#FFD54A"/><stop offset=".45" stop-color="#FFF6CC"/><stop offset=".6" stop-color="#F5B800"/><stop offset="1" stop-color="#7A4E00"/></linearGradient>${clip("L26c")}</defs>` +
    `<g clip-path="url(#L26c)"><rect width="240" height="240" fill="url(#L26b)"/><g fill="#FFFFFF" opacity=".05">` +
    [0, 1, 2, 3, 4, 5].map((i) => `<polygon points="120,80 ${-40 + i * 64},-10 ${-10 + i * 64},-10"/>`).join("") + `</g></g>` +
    `<g fill="none" stroke="url(#L26g)" stroke-width="7"><path d="M86 52H66C62 80 76 92 92 94"/><path d="M154 52H174C178 80 164 92 148 94"/></g>` +
    `<path d="M84 40H156V70C156 96 140 112 120 112C100 112 84 96 84 70Z" fill="url(#L26g)"/>` +
    `<ellipse cx="120" cy="40" rx="36" ry="5" fill="#FFF6CC"/><path d="M96 50C96 80 102 96 110 104" fill="none" stroke="#FFFFFF" stroke-opacity=".6" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M112 112H128L132 130H108Z" fill="url(#L26g)"/><rect x="94" y="130" width="52" height="22" rx="3" fill="#3A2416"/><rect x="104" y="135" width="32" height="12" rx="2" fill="url(#L26g)"/>` +
    txt(120, 145, "IA", { size: 9, fill: "#3A2416" }) + sparkle(160, 46, 9, W) + sparkle(72, 104, 5, "#FFF6CC") + wm(186));

  // 27 — Timbre
  add("Timbre", "Philatélie gravée",
    `<defs><pattern id="L27h" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" stroke="#FFFFFF" stroke-opacity=".16" stroke-width="1.2"/></pattern>` +
    `<filter id="L27s"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity=".25"/></filter></defs>` +
    frame("#E8E2D5") +
    `<g filter="url(#L27s)"><rect x="46" y="26" width="148" height="188" fill="#FFFDF7"/></g>` +
    (function () {
      let s = "";
      for (let x = 46; x <= 194.5; x += 12.3) s += `<circle cx="${f1(x)}" cy="26" r="4.5" fill="#E8E2D5"/><circle cx="${f1(x)}" cy="214" r="4.5" fill="#E8E2D5"/>`;
      for (let y = 26; y <= 214.5; y += 12.53) s += `<circle cx="46" cy="${f1(y)}" r="4.5" fill="#E8E2D5"/><circle cx="194" cy="${f1(y)}" r="4.5" fill="#E8E2D5"/>`;
      return s;
    })() +
    `<rect x="58" y="38" width="124" height="128" fill="#233A8B"/><rect x="58" y="38" width="124" height="128" fill="url(#L27h)"/>` +
    `<circle cx="120" cy="104" r="38" fill="none" stroke="#F3E6C4" stroke-width="1.5"/>` + motif(124, 104, 40, "#F3E6C4", "#F3E6C4") +
    txt(66, 54, "LCL", { anchor: "start", font: FONT.cinzel, weight: 700, size: 11, fill: "#F3E6C4", ls: 2 }) +
    txt(174, 158, "IA", { anchor: "end", font: FONT.cinzel, weight: 900, size: 16, fill: Y }) +
    txt(120, 186, "CHAMPIONS", { font: FONT.cinzel, weight: 900, size: 16, fill: "#233A8B", len: 116 }) +
    txt(120, 202, "INTELLIGENCE ARTIFICIELLE", { font: FONT.cinzel, weight: 700, size: 6, fill: "#233A8B", ls: 1 }) +
    `<g fill="none" stroke="#1B1B1B" stroke-opacity=".35" stroke-width="1.5"><circle cx="186" cy="150" r="24"/><path d="M150 176c10-6 20 6 30 0s20 6 30 0M150 186c10-6 20 6 30 0s20 6 30 0"/></g>`);

  // 28 — Graffiti
  add("Graffiti", "Street art",
    `<defs><pattern id="L28b" width="40" height="20" patternUnits="userSpaceOnUse"><rect width="40" height="20" fill="#9A4434"/><path d="M0 0H40M0 10H40M20 0V10M0 10V20M40 10V20" stroke="#6E2A20" stroke-width="2"/></pattern>` +
    `<filter id="L28g" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter></defs>` +
    frame("url(#L28b)") + `<rect width="240" height="240" rx="28" fill="#000" fill-opacity=".18"/>` +
    `<ellipse cx="120" cy="118" rx="96" ry="40" fill="#FF3FA4" opacity=".45" filter="url(#L28g)"/>` +
    `<g transform="rotate(-7 120 120)">` + txt(112, 134, "Champions", { font: FONT.marker, weight: 400, size: 40, fill: "#FFE14D", stroke: "#111", sw: 5, len: 184 }) + `</g>` +
    `<g transform="rotate(8 186 76)">` + txt(186, 88, "IA", { font: FONT.marker, weight: 400, size: 50, fill: "#2EE6FF", stroke: "#111", sw: 5 }) + `</g>` +
    `<g fill="#2EE6FF"><rect x="171" y="90" width="4" height="14" rx="2"/><rect x="190" y="92" width="3.5" height="22" rx="1.8"/><circle cx="191.7" cy="115" r="3"/></g>` +
    `<g fill="#FFE14D"><rect x="70" y="146" width="4" height="16" rx="2"/><circle cx="72" cy="163" r="3"/><rect x="128" y="138" width="3.5" height="12" rx="1.8"/></g>` +
    `<rect x="72" y="186" width="96" height="28" fill="#111" opacity=".85"/>` + txt(120, 207, "LCL", { font: FONT.bebas, weight: 400, size: 24, fill: W, ls: 10 }) +
    sparkle(48, 60, 10, W));

  // 29 — Circuit imprimé
  add("Circuit imprimé", "Électronique",
    frame("#0B5D3B") +
    `<g fill="none" stroke="#D4AF37" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".9">` +
    `<path d="M80 70H50V40H30"/><path d="M80 90H40V120"/><path d="M160 70H196V34"/><path d="M160 90H212"/><path d="M100 50V22"/><path d="M140 50V30H170"/><path d="M100 130V150H60"/><path d="M140 130V152H190"/></g>` +
    [[30, 40], [40, 120], [196, 34], [212, 90], [100, 22], [170, 30], [60, 150], [190, 152]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#D4AF37"/><circle cx="${x}" cy="${y}" r="2" fill="#0B5D3B"/>`).join("") +
    `<rect x="80" y="50" width="80" height="80" rx="6" fill="#111"/>` +
    [62, 76, 90, 104, 118].map((v) => `<rect x="74" y="${v - 2}" width="6" height="4" fill="#C0C0C0"/><rect x="160" y="${v - 2}" width="6" height="4" fill="#C0C0C0"/>`).join("") +
    motif(124, 92, 30, "#D4AF37", W) + `<circle cx="88" cy="58" r="2.5" fill="#555"/>` +
    wm(184, { font: FONT.mono, weight: 700, size: 18, w: 126, pill: "#D4AF37", pillInk: "#111", lcl: "#9AE6B4", lclFont: FONT.mono, square: true }));

  // 30 — Aquarelle
  add("Aquarelle", "Peinture à l'eau",
    `<defs><filter id="L30w" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="26"/><feGaussianBlur stdDeviation="2.5"/></filter>` +
    `<filter id="L30p"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .4  0 0 0 0 .3  0 0 0 .06 0"/></filter></defs>` +
    frame("#FFFDF7") + `<rect width="240" height="240" rx="28" filter="url(#L30p)"/>` +
    `<g filter="url(#L30w)"><circle cx="96" cy="100" r="56" fill="#5B8CFF" opacity=".5"/><circle cx="150" cy="90" r="46" fill="#FFC72C" opacity=".55"/><circle cx="124" cy="132" r="40" fill="#9B5BFF" opacity=".35"/></g>` +
    txt(120, 124, "Champions", { font: FONT.play, weight: 900, size: 40, fill: "#14205E", style: "italic", len: 196 }) +
    txt(120, 160, "— IA —", { font: FONT.play, weight: 700, size: 20, fill: "#B07A00", ls: 6 }) +
    txt(120, 206, "LCL", { weight: 700, size: 11, fill: "#14205E", ls: 7 }));

  // 31 — Lauriers d'or
  add("Lauriers d'or", "Éditorial prestige",
    `<defs><linearGradient id="L31g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF1B8"/><stop offset=".5" stop-color="#E2B33C"/><stop offset="1" stop-color="#A77812"/></linearGradient></defs>` +
    frame(N) +
    (function () {
      let s = "";
      for (let i = 0; i < 9; i++) {
        const deg = 262 - i * 15, a = (deg * Math.PI) / 180;
        const x = 120 + 66 * Math.cos(a), y = 104 - 66 * Math.sin(a), rot = -deg + 25;
        s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="5.5" ry="13" fill="url(#L31g)" transform="rotate(${rot} ${f1(x)} ${f1(y)})"/>`;
        s += `<ellipse cx="${f1(240 - x)}" cy="${f1(y)}" rx="5.5" ry="13" fill="url(#L31g)" transform="rotate(${-rot} ${f1(240 - x)} ${f1(y)})"/>`;
      }
      return s;
    })() +
        txt(120, 120, "IA", { font: FONT.play, weight: 900, size: 60, fill: "url(#L31g)" }) + star(120, 52, 7, 3, "#E2B33C") +
    txt(120, 196, "CHAMPIONS", { font: FONT.play, weight: 700, size: 20, fill: W, len: 168 }) +
    txt(120, 218, "LCL", { weight: 700, size: 10, fill: "#E2B33C", ls: 7 }));

  // 32 — Vitrail
  add("Vitrail", "Vitrail / mosaïque",
    frame("#141414") +
    (function () {
      const cols = ["#1F5BD8", "#FFC72C", "#00A3E0", "#C81D25", "#2E9E5B", "#7B2CFF"];
      const ring = (r1, r2, n, off, shift) => {
        let s = "";
        for (let i = 0; i < n; i++) {
          const a1 = (Math.PI * 2 * i) / n + off, a2 = (Math.PI * 2 * (i + 1)) / n + off;
          const p = (r, a) => `${f1(120 + r * Math.cos(a))} ${f1(96 + r * Math.sin(a))}`;
          s += `<path d="M${p(r1, a1)}L${p(r2, a1)}A${r2} ${r2} 0 0 1 ${p(r2, a2)}L${p(r1, a2)}A${r1} ${r1} 0 0 0 ${p(r1, a1)}Z" fill="${cols[(i + shift) % cols.length]}" fill-opacity=".9" stroke="#141414" stroke-width="3.5"/>`;
        }
        return s;
      };
      return ring(48, 74, 12, 0, 0) + ring(28, 48, 8, 0.2, 3);
    })() +
    `<circle cx="120" cy="96" r="28" fill="#F5F0E1" stroke="#141414" stroke-width="3.5"/>` + motif(122, 98, 26, "#C81D25", "#1F5BD8") +
    `<circle cx="120" cy="96" r="76" fill="none" stroke="#141414" stroke-width="4"/>` +
    wm(196, { size: 18, w: 120, lcl: "#FFC72C" }));

  return L;
})();
