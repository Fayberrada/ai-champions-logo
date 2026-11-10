(function () {
  "use strict";

  const API = "https://champions-ia-api.vercel.app/api";
  const PSEUDO_KEY = "champions-ia-pseudo";

  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* ignoré */ } },
  };

  // ---------- Catalogue : identités du site + propositions des joueurs ----------
  // Identités en compétition : 20 propositions : 12 de la série « charte LCL » et 8 de la série « Héritage » (à garder alignée avec server/lib/shared.js).
  const ACTIVE = [33, 35, 36, 37, 40, 41, 42, 43, 45, 48, 50, 53, 57, 58, 59, 60, 61, 62, 63, 64];
  const items = new Map(LOGOS_LCL.filter((l) => ACTIVE.includes(l.id)).map((l) => [l.id, l]));
  let played = {};
  const asItem = (p) => ({ id: p.id, name: p.name, by: p.by, img: `${API}/img?id=${p.id}` });
  async function loadCatalog() {
    try {
      const r = await fetch(`${API}/logos`);
      if (!r.ok) throw new Error();
      const data = await r.json();
      data.proposals.forEach((p) => items.set(p.id, asItem(p)));
      played = data.played || {};
    } catch (e) { /* on joue avec les identités du site */ }
  }
  function art(it) {
    if (!it) return "";
    if (it.img) return `<div class="ugc"><img src="${esc(it.img)}" alt="${esc(it.name)}" draggable="false"><span class="by">par ${esc(it.by)}</span></div>`;
    // Identifiants internes (dégradés, filtres) rendus uniques : un même logo peut être affiché plusieurs fois.
    const u = "r" + ++renders;
    const svg = it.svg.replace(/(id="|#)L(\d+)/g, `$1${u}L$2`);
    return `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(it.name)}">${svg}</svg>`;
  }
  let renders = 0;

  const views = { home: $("#home"), propose: $("#propose"), arena: $("#arena"), results: $("#results"), ranking: $("#ranking") };
  const show = (name) => {
    Object.keys(views).forEach((k) => (views[k].hidden = k !== name));
    $("#podium-box").hidden = name !== "home" || !$("#podium").innerHTML;
    window.scrollTo({ top: 0 });
    if (name === "home") loadPodium();
  };

  // ---------- Classement général : podium de l'accueil et liste complète ----------
  const rankItem = (row) => (row.proposal ? asItem(row.proposal) : items.get(row.id));
  const statsLine = (d) => `${d.players} joueur${d.players > 1 ? "s" : ""} · ${d.duels} duels · ${d.ranked} logos classés`;
  async function fetchTop(all) {
    const r = await fetch(`${API}/top${all ? "?all=1" : ""}`);
    if (!r.ok) throw new Error();
    return r.json();
  }
  async function loadPodium() {
    try {
      const d = await fetchTop(false);
      const top = d.top.filter((row) => rankItem(row)).slice(0, 3);
      if (!top.length) { $("#podium").innerHTML = ""; $("#podium-box").hidden = true; return; }
      $("#podium-stats").textContent = statsLine(d);
      const cls = ["first", "second", "third"], medal = ["🥇", "🥈", "🥉"];
      // Ordre visuel du podium : 2e, 1er, 3e
      const order = top.length === 3 ? [1, 0, 2] : top.map((_, i) => i);
      $("#podium").innerHTML = order.map((i) => {
        const row = top[i];
        return `<li class="${cls[i]}"><div class="thumb">${art(rankItem(row))}</div><span class="score">${medal[i]} ${row.score} %</span><div class="step">${i + 1}</div></li>`;
      }).join("");
      $("#podium-box").hidden = views.home.hidden;
    } catch (e) {
      $("#podium-box").hidden = true;
    }
  }
  async function showRanking() {
    show("ranking");
    $("#ranking-stats").textContent = "Chargement…";
    $("#ranking-list").innerHTML = "";
    try {
      const d = await fetchTop(true);
      $("#ranking-stats").textContent = statsLine(d) + ". Score = chances de gagner un duel face à un logo moyen.";
      const ranked = new Set(d.all.map((r) => r.id));
      const medal = (n) => ["🥇", "🥈", "🥉"][n - 1] || n;
      let html = d.all.filter((row) => rankItem(row)).map((row) => {
        const it = rankItem(row);
        return `<li><span class="pos">${medal(row.rank)}</span><div class="thumb">${art(it)}</div>` +
          `<div><div class="name">${esc(it.name)}${it.by ? ` <span class="meta">par ${esc(it.by)}</span>` : ""}</div>` +
          `<div class="meta">${row.wins} victoire${row.wins > 1 ? "s" : ""} sur ${row.duels} duel${row.duels > 1 ? "s" : ""} · ${row.champion} sacre${row.champion > 1 ? "s" : ""}</div></div>` +
          `<span class="score">${row.score} %</span></li>`;
      }).join("");
      html += [...items.keys()].filter((id) => !ranked.has(id)).map((id) => {
        const it = items.get(id);
        return `<li class="unranked"><span class="pos">–</span><div class="thumb">${art(it)}</div><div><div class="name">${esc(it.name)}</div><div class="meta">Pas encore joué</div></div><span class="score"></span></li>`;
      }).join("");
      $("#ranking-list").innerHTML = html;
    } catch (e) {
      $("#ranking-stats").textContent = "Classement indisponible pour le moment.";
    }
  }
  let rankingBack = "home";
  $("#to-ranking").addEventListener("click", () => { rankingBack = "home"; showRanking(); });
  $("#results-ranking").addEventListener("click", () => { rankingBack = "results"; showRanking(); });
  $("#ranking-back").addEventListener("click", () => show(rankingBack));

  // ---------- Pseudo ----------
  let pseudo = store.get(PSEUDO_KEY) || "";
  const input = $("#pseudo");
  input.value = pseudo;
  function setWho() {
    $("#who").hidden = !pseudo;
    $("#who").textContent = pseudo ? `👤 ${pseudo}` : "";
  }
  setWho();
  function takePseudo() {
    const v = input.value.replace(/[<>]/g, "").trim();
    const hint = $("#pseudo-hint");
    if (v.length < 2 || v.length > 24) {
      hint.textContent = "Choisissez d'abord un pseudo de 2 à 24 caractères.";
      hint.classList.add("error");
      input.focus();
      return false;
    }
    hint.classList.remove("error");
    hint.textContent = "Seule votre dernière partie compte dans le classement commun.";
    pseudo = v;
    store.set(PSEUDO_KEY, pseudo);
    setWho();
    return true;
  }

  $("#pseudo-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (takePseudo()) start();
  });
  $("#to-propose").addEventListener("click", () => {
    if (takePseudo()) { backTo = "home"; show("propose"); }
  });

  // ---------- Proposer un logo ----------
  let prepared = null; // data URL prête à l'envoi
  const fileInput = $("#file"), drop = $("#drop"), preview = $("#preview"), status = $("#prop-status");
  const setStatus = (msg, kind) => {
    status.textContent = msg;
    status.className = "hint" + (kind ? " " + kind : "");
  };

  function prepare(file) {
    prepared = null;
    if (!file) return;
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(file.type)) return setStatus("Format non pris en charge : PNG, JPEG, WebP ou SVG.", "error");
    if (file.size > 8 * 1024 * 1024) return setStatus("Image trop lourde (8 Mo maximum).", "error");
    setStatus("Préparation de l'image…");
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const S = 512, c = document.createElement("canvas");
        c.width = c.height = S;
        const ctx = c.getContext("2d");
        const w = img.naturalWidth || S, h = img.naturalHeight || S, k = Math.min(S / w, S / h);
        const dw = w * k, dh = h * k;
        const encode = (opaque, type, q) => {
          ctx.clearRect(0, 0, S, S);
          if (opaque) { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, S, S); }
          ctx.drawImage(img, (S - dw) / 2, (S - dh) / 2, dw, dh);
          return c.toDataURL(type, q);
        };
        let out;
        try {
          out = encode(false, "image/webp", 0.86);
          if (!out.startsWith("data:image/webp")) out = encode(false, "image/png");
          if (out.length > 440000) out = encode(true, "image/jpeg", 0.85);
          if (out.length > 440000) out = encode(true, "image/jpeg", 0.65);
        } catch (e) {
          return setStatus("Impossible de lire cette image. Essayez un PNG ou un JPEG.", "error");
        }
        prepared = out;
        preview.src = out;
        preview.hidden = false;
        $("#drop-empty").hidden = true;
        setStatus("");
      };
      img.onerror = () => setStatus("Impossible de lire cette image. Essayez un PNG ou un JPEG.", "error");
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
  fileInput.addEventListener("change", () => prepare(fileInput.files[0]));
  ["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, () => drop.classList.remove("over")));
  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    prepare(e.dataTransfer.files[0]);
  });

  function resetProposal() {
    prepared = null;
    fileInput.value = "";
    preview.hidden = true;
    preview.removeAttribute("src");
    $("#drop-empty").hidden = false;
    $("#prop-name").value = "";
    $("#prop-ok").checked = false;
  }

  $("#propose-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!prepared) return setStatus("Choisissez d'abord une image.", "error");
    if (!$("#prop-ok").checked) return setStatus("Merci de cocher la confirmation.", "error");
    const btn = $("#prop-send");
    btn.disabled = true;
    setStatus("Envoi en cours…");
    try {
      const r = await fetch(`${API}/propose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, name: $("#prop-name").value, image: prepared }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Envoi impossible");
      items.set(data.proposal.id, asItem(data.proposal));
      resetProposal();
      setStatus(`✓ « ${data.proposal.name} » est dans le tournoi. ` +
        (data.remaining > 0 ? `Vous pouvez encore en proposer ${data.remaining}.` : "Vous avez atteint le maximum de 3 propositions."), "ok");
    } catch (err) {
      setStatus(err.message || "Envoi impossible pour le moment.", "error");
    } finally {
      btn.disabled = false;
    }
  });
  let backTo = "home";
  $("#prop-back").addEventListener("click", () => { setStatus(""); show(backTo); });
  $("#results-propose").addEventListener("click", () => { backTo = "results"; setStatus(""); show("propose"); });

  // ---------- Tournoi ----------
  // 1) Découverte : tous les logos en compétition passent une fois, par paires tirées au hasard.
  // 2) Affinage : les gagnants s'affrontent par paires de styles proches, pour départager vos préférences.
  //    Après la découverte, si le nombre de qualifiés est impair, le logo éliminé le plus proche de vos goûts est repêché.
  // Le goût du joueur est appris à chaque duel à partir des étiquettes de style des logos (LOGO_TAGS).
  let g = null;
  let busy = false;

  const tagsOf = (id) => (items.get(id) && items.get(id).tags) || [];
  function similarity(a, b) {
    const A = tagsOf(a), B = tagsOf(b);
    if (!A.length || !B.length) return 0;
    const inter = A.filter((t) => B.includes(t)).length;
    return inter / (A.length + B.length - inter);
  }
  function tasteScore(id) {
    const t = tagsOf(id);
    if (!t.length) return 0;
    return t.reduce((s, k) => s + (g.taste[k] || 0), 0) / Math.sqrt(t.length);
  }
  function learn(w, l) {
    tagsOf(w).forEach((k) => (g.taste[k] = (g.taste[k] || 0) + 1));
    tagsOf(l).forEach((k) => (g.taste[k] = (g.taste[k] || 0) - 0.5));
  }

  // Découverte : paires au hasard ; en cas de nombre impair, un logo tiré au sort passe directement au tour suivant.
  function discoveryPairs(ids) {
    const r = shuffle(ids), out = { pairs: [], bye: null };
    if (r.length % 2) out.bye = r.pop();
    for (let i = 0; i < r.length; i += 2) out.pairs.push([r[i], r[i + 1]]);
    return out;
  }
  // Paires de styles proches ; en cas de nombre impair, le favori du joueur est qualifié d'office.
  function similarPairs(ids) {
    const rest = ids.slice().sort((a, b) => tasteScore(b) - tasteScore(a) || Math.random() - 0.5);
    const out = { pairs: [], bye: null };
    if (rest.length % 2) out.bye = rest.shift();
    while (rest.length) {
      const a = rest.shift();
      let best = 0;
      rest.forEach((b, i) => { if (similarity(a, b) > similarity(a, rest[best])) best = i; });
      out.pairs.push(shuffle([a, rest.splice(best, 1)[0]]));
    }
    return out;
  }

  async function start() {
    const btn = $("#pseudo-form button");
    btn.disabled = true;
    await loadCatalog();
    btn.disabled = false;
    const all = [...items.keys()];
    const first = discoveryPairs(all);
    g = { round: 1, pairs: first.pairs, bye: first.bye, mi: 0, winners: [], rescued: null, duels: [], done: 0, total: all.length - 1, taste: {} };
    all.forEach((id) => { const it = items.get(id); if (it.img) new Image().src = it.img; });
    busy = false;
    show("arena");
    render();
  }

  function stageName() {
    const left = g.pairs.length * 2 + (g.bye ? 1 : 0);
    if (g.round === 1) return ["Tour de découverte", `Duel ${g.mi + 1} sur ${g.pairs.length} · chaque logo passe une fois`];
    if (left === 2) return ["🏆 Finale", "Le dernier duel"];
    if (left <= 4) return ["Demi-finales", `Duel ${g.mi + 1} sur ${g.pairs.length} · styles proches`];
    return [`Tour ${g.round} · affinage`, `Duel ${g.mi + 1} sur ${g.pairs.length} · styles proches de vos choix`];
  }

  function render() {
    const [a, b] = g.pairs[g.mi];
    const [stage, match] = stageName();
    $("#stage").textContent = stage;
    $("#match").textContent = match;
    const isFinal = g.round > 1 && g.pairs.length === 1 && !g.bye;
    let prompt = isFinal ? "Quelle identité pour les Champions IA ?" : "Laquelle préférez-vous ?";
    if (g.rescued && (a === g.rescued || b === g.rescued) && g.round === 2) prompt = "🔁 Un logo proche de vos goûts a été repêché. Laquelle préférez-vous ?";
    $("#prompt").textContent = prompt;
    $("#bar").style.width = `${(g.done / g.total) * 100}%`;
    const box = $("#duel");
    box.innerHTML = "";
    [a, b].forEach((id, i) => {
      if (i === 1) {
        const vs = document.createElement("div");
        vs.className = "vs";
        vs.textContent = "VS";
        vs.setAttribute("aria-hidden", "true");
        box.appendChild(vs);
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "card";
      btn.setAttribute("aria-label", `Proposition ${i === 0 ? "de gauche" : "de droite"}`);
      btn.innerHTML = art(items.get(id));
      btn.addEventListener("click", () => pick(i));
      box.appendChild(btn);
    });
  }

  function pick(i) {
    if (busy || !g || views.arena.hidden) return;
    busy = true;
    const [a, b] = g.pairs[g.mi];
    const w = i === 0 ? a : b, l = i === 0 ? b : a;
    g.duels.push([a, b, w]);
    learn(w, l);
    g.winners.push(w);
    g.done += 1;
    document.querySelectorAll("#duel .card").forEach((c, k) => {
      c.classList.add(k === i ? "is-picked" : "is-out");
      c.disabled = true;
    });
    $("#bar").style.width = `${(g.done / g.total) * 100}%`;
    setTimeout(() => {
      g.mi += 1;
      if (g.mi >= g.pairs.length) nextRound();
      busy = false;
      if (g.champion) finish();
      else render();
    }, 450);
  }

  function nextRound() {
    const pool = g.winners.slice();
    if (g.bye) pool.push(g.bye);
    // Après la découverte, si le nombre de qualifiés est impair, on repêche le logo éliminé le plus proche de vos goûts.
    if (g.round === 1 && pool.length % 2 && pool.length > 1) {
      const out = [...items.keys()].filter((id) => !pool.includes(id)).sort((x, y) => tasteScore(y) - tasteScore(x));
      g.rescued = out[0];
      pool.push(g.rescued);
      g.total += 1;
    }
    g.round += 1;
    g.mi = 0;
    g.winners = [];
    if (pool.length === 1) {
      g.champion = pool[0];
      return;
    }
    const next = similarPairs(pool);
    g.pairs = next.pairs;
    g.bye = next.bye;
  }

  // Logos les plus proches des goûts du joueur (hors champion)
  function suggestions(n) {
    return [...items.keys()].filter((id) => id !== g.champion && tagsOf(id).length)
      .sort((x, y) => tasteScore(y) - tasteScore(x)).slice(0, n);
  }
  function tasteLabels() {
    return Object.entries(g.taste).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 4)
      .map(([k]) => (typeof TAG_LABELS !== "undefined" && TAG_LABELS[k]) || k);
  }

  // ---------- Fin de partie ----------
  function finish() {
    $("#champion").innerHTML = art(items.get(g.champion));
    const labels = tasteLabels();
    $("#taste").innerHTML = labels.length ? `Vos goûts : ${labels.map((t) => `<span class="tag">${esc(t)}</span>`).join(" ")}` : "";
    $("#similar").innerHTML = suggestions(3).map((id) => `<li><div class="thumb">${art(items.get(id))}</div></li>`).join("");
    $("#similar-box").hidden = !$("#similar").innerHTML;
    $("#top5").innerHTML = "";
    $("#mine").innerHTML = "";
    $("#duel").innerHTML = "";
    show("results");
    confetti();
    send();
  }

  async function send() {
    $("#retry").hidden = true;
    $("#stats").textContent = "Envoi de votre vote et chargement du classement…";
    try {
      const r = await fetch(`${API}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, duels: g.duels, champion: g.champion }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Erreur");
      renderTop(data);
    } catch (e) {
      $("#stats").textContent = "Le classement commun est indisponible pour le moment. Votre vote n'a pas été enregistré.";
      $("#retry").hidden = false;
    }
  }

  function renderMine(data) {
    const chips = [];
    const chip = (row, label) => {
      const it = row.proposal ? asItem(row.proposal) : items.get(row.id);
      if (!it) return;
      const pos = row.rank ? `${row.rank}${row.rank === 1 ? "er" : "e"} sur ${data.ranked}` : "pas encore classé";
      chips.push(`<div class="chip"><div class="mini">${art(it)}</div><div><div class="lab">${label}</div><div class="pos">${pos}${row.rank ? ` · ${row.score} %` : ""}</div></div></div>`);
    };
    if (data.mine && data.mine.champion) chip(data.mine.champion, "Votre champion au classement général");
    if (data.mine && data.mine.proposals.length) {
      chip(data.mine.proposals[0], data.mine.proposals.length > 1 ? "Votre meilleure proposition" : "Votre proposition");
    }
    $("#mine").innerHTML = chips.join("");
  }

  function renderTop(data) {
    renderMine(data);
    const n = data.players;
    $("#stats").textContent = `${n} joueur${n > 1 ? "s" : ""} · ${data.duels} duels joués · ${data.ranked} logos classés. Score = chances de gagner un duel face à une proposition moyenne.`;
    const medals = ["🥇", "🥈", "🥉", "4", "5"];
    $("#top5").innerHTML = data.top
      .map((row, k) => {
        const it = row.proposal ? asItem(row.proposal) : items.get(row.id);
        if (!it) return "";
        return `<li class="${row.id === g.champion ? "mine" : ""}"><span class="rank">${medals[k]}</span><div class="thumb">${art(it)}</div>` +
          `<span class="score">${row.score} %</span><span class="meta">${row.wins} victoire${row.wins > 1 ? "s" : ""} · ${row.champion} sacre${row.champion > 1 ? "s" : ""}</span></li>`;
      })
      .join("");
  }

  function confetti() {
    const box = $("#confetti");
    box.innerHTML = "";
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cols = ["#FFC72C", "#4E5FE6", "#FFFFFF", "#FF5C93", "#2EF2FF"];
    for (let i = 0; i < 90; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = cols[i % cols.length];
      p.style.animationDuration = 2.2 + Math.random() * 2.2 + "s";
      p.style.animationDelay = Math.random() * 0.8 + "s";
      box.appendChild(p);
    }
    setTimeout(() => (box.innerHTML = ""), 6000);
  }

  $("#again").addEventListener("click", start);
  $("#retry").addEventListener("click", send);
  $("#quit").addEventListener("click", () => { g = null; show("home"); });
  document.addEventListener("keydown", (e) => {
    if (views.arena.hidden || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "ArrowLeft" || e.key === "1") pick(0);
    else if (e.key === "ArrowRight" || e.key === "2") pick(1);
  });

  // Au chargement : propositions des joueurs puis podium de l'accueil
  loadCatalog().then(loadPodium);
})();
