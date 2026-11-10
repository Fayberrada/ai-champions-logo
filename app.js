(function () {
  "use strict";

  const KEY = "aic-lcl-tournoi-v2";
  const POINTS = [10, 7, 5, 3, 1];
  const $ = (s) => document.querySelector(s);
  const byId = (id) => LOGOS.find((l) => l.id === id);
  const svgOf = (l) => `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${l.name}">${l.svg}</svg>`;
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // ---------- Stockage local (protégé : tout marche sans) ----------
  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY));
      return d && Array.isArray(d.games) ? d : { games: [] };
    } catch (e) { return { games: [] }; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* ignoré */ }
  }
  let store = load();

  // ---------- Onglets ----------
  function showTab(name) {
    document.querySelectorAll(".tab").forEach((b) => {
      const on = b.dataset.tab === name;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    document.querySelectorAll(".view").forEach((v) => v.classList.toggle("is-active", v.id === name));
    if (name === "classement") renderLeader();
  }
  document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => showTab(b.dataset.tab)));

  // ---------- Catalogue ----------
  let filter = "Tous";
  function renderCatalogue() {
    $("#count").textContent = LOGOS.length;
    const cats = ["Tous", ...new Set(LOGOS.map((l) => l.esprit))];
    const f = $("#filters");
    f.innerHTML = "";
    cats.forEach((c) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (c === filter ? " is-active" : "");
      b.setAttribute("aria-pressed", String(c === filter));
      b.textContent = c;
      b.addEventListener("click", () => { filter = c; renderCatalogue(); });
      f.appendChild(b);
    });
    $("#grid").innerHTML = LOGOS.filter((l) => filter === "Tous" || l.esprit === filter)
      .map((l) => `<article class="logo-card">${svgOf(l)}<div class="name">${l.name}</div><div class="meta">${l.esprit} · ${l.style}</div></article>`)
      .join("");
  }

  // ---------- Tournoi ----------
  // Élimination directe en duels. Après les demi-finales :
  // match pour la 5e place (les 4 perdants des quarts), petite finale, puis finale.
  const STAGES = { 32: "Seizièmes de finale", 16: "Huitièmes de finale", 8: "Quarts de finale", 4: "Demi-finales" };
  let g = null;
  let busy = false;
  const panels = { intro: $("#intro-box"), round: $("#round-box"), winner: $("#winner-box") };
  const show = (k) => Object.keys(panels).forEach((p) => (panels[p].hidden = p !== k));

  function start(size) {
    const ids = shuffle(LOGOS.map((l) => l.id)).slice(0, Math.min(size, LOGOS.length));
    g = { size: ids.length, pool: ids, winners: [], mi: 0, phase: "bracket", qfLosers: [], sfLosers: [], finalists: [], rank: [], done: 0, total: ids.length + 1, history: [] };
    busy = false;
    show("round");
    render();
  }

  function current() {
    if (g.phase === "bracket") return g.pool.slice(g.mi * 2, g.mi * 2 + 2);
    if (g.phase === "fifth") return g.qfLosers;
    if (g.phase === "third") return g.sfLosers;
    return g.finalists;
  }

  function render() {
    const ids = current();
    let stage, match, prompt;
    if (g.phase === "bracket") {
      stage = STAGES[g.pool.length] || `Tour de ${g.pool.length}`;
      match = `Duel ${g.mi + 1} sur ${g.pool.length / 2}`;
      prompt = "Lequel passe au tour suivant ?";
    } else if (g.phase === "fifth") {
      stage = "Match pour la 5e place";
      match = "Les quarts de finalistes éliminés";
      prompt = "Lequel mérite la 5e place ?";
    } else if (g.phase === "third") {
      stage = "Petite finale";
      match = "Pour la 3e place";
      prompt = "Lequel monte sur le podium ?";
    } else {
      stage = "🏆 Grande finale";
      match = "Le dernier duel";
      prompt = "Quel est le logo des AI Champions LCL ?";
    }
    $("#stage").textContent = stage;
    $("#match-label").textContent = `${match} · décision ${g.done + 1}/${g.total}`;
    $("#prompt").textContent = prompt;
    $("#bar").style.width = `${(g.done / g.total) * 100}%`;

    const box = $("#options");
    box.className = "options " + (ids.length === 2 ? "duel" : "multi");
    box.innerHTML = "";
    ids.forEach((id, i) => {
      const l = byId(id);
      if (i === 1 && ids.length === 2) {
        const vs = document.createElement("div");
        vs.className = "vs";
        vs.textContent = "VS";
        vs.setAttribute("aria-hidden", "true");
        box.appendChild(vs);
      }
      const b = document.createElement("button");
      b.type = "button";
      b.className = "card";
      b.setAttribute("aria-label", `Choisir ${l.name}`);
      b.innerHTML = `${svgOf(l)}<span class="label">${l.name}</span><span class="sub">${l.esprit} · ${l.style}</span>`;
      b.addEventListener("click", () => pick(i));
      box.appendChild(b);
    });
  }

  function pick(i) {
    if (busy || !g || panels.round.hidden) return;
    const ids = current();
    if (i < 0 || i >= ids.length) return;
    busy = true;
    const win = ids[i];
    const lost = ids.filter((x) => x !== win);
    g.history.push({ phase: g.phase, size: g.phase === "bracket" ? g.pool.length : null, options: ids.slice(), winner: win });
    g.done += 1;
    document.querySelectorAll("#options .card").forEach((c, k) => {
      c.classList.add(k === i ? "is-picked" : "is-out");
      c.disabled = true;
    });
    $("#bar").style.width = `${(g.done / g.total) * 100}%`;
    setTimeout(() => advance(win, lost), 480);
  }

  function advance(win, lost) {
    if (g.phase === "bracket") {
      if (g.pool.length === 8) g.qfLosers.push(...lost);
      if (g.pool.length === 4) g.sfLosers.push(...lost);
      g.winners.push(win);
      g.mi += 1;
      if (g.mi * 2 >= g.pool.length) {
        if (g.pool.length === 4) {
          g.finalists = g.winners;
          g.phase = "fifth";
        } else {
          g.pool = g.winners;
          g.winners = [];
          g.mi = 0;
        }
      }
    } else if (g.phase === "fifth") {
      g.fifth = win;
      g.phase = "third";
    } else if (g.phase === "third") {
      g.third = win;
      g.fourth = lost[0];
      g.phase = "final";
    } else {
      g.rank = [win, lost[0], g.third, g.fourth, g.fifth];
      busy = false;
      return finish();
    }
    busy = false;
    render();
  }

  function finish() {
    const champ = byId(g.rank[0]);
    $("#champion").innerHTML = svgOf(champ);
    $("#champion-name").textContent = champ.name;
    const medals = ["🥇", "🥈", "🥉", "4", "5"];
    $("#top5").innerHTML = g.rank
      .map((id, k) => `<li><span class="rank">${medals[k]}</span>${svgOf(byId(id))}<span class="nm">${byId(id).name}</span></li>`)
      .join("");
    $("#status").textContent = "";
    store.games.push({ date: new Date().toISOString(), size: g.size, top5: g.rank, duels: g.history });
    save();
    show("winner");
    confetti();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function confetti() {
    const box = $("#confetti");
    box.innerHTML = "";
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cols = ["#FFC72C", "#00A3E0", "#1F5BD8", "#0B1F4B", "#FFFFFF"];
    for (let i = 0; i < 90; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = cols[i % cols.length];
      p.style.animationDuration = 2.2 + Math.random() * 2.2 + "s";
      p.style.animationDelay = Math.random() * 0.8 + "s";
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      box.appendChild(p);
    }
    setTimeout(() => (box.innerHTML = ""), 6000);
  }

  // ---------- Classement cumulé ----------
  function renderLeader() {
    const score = {};
    const wins = {};
    store.games.forEach((gm) => gm.top5.forEach((id, k) => {
      score[id] = (score[id] || 0) + POINTS[k];
      if (k === 0) wins[id] = (wins[id] || 0) + 1;
    }));
    const n = store.games.length;
    $("#games-count").textContent = n ? `${n} partie${n > 1 ? "s" : ""} jouée${n > 1 ? "s" : ""} sur ce navigateur.` : "";
    const rows = Object.keys(score).map(Number).sort((a, b) => score[b] - score[a] || (wins[b] || 0) - (wins[a] || 0)).slice(0, 5);
    const el = $("#leader");
    if (!rows.length) {
      el.innerHTML = `<li class="empty" style="display:block">Aucune partie pour l'instant. Lancez un tournoi !</li>`;
      return;
    }
    el.innerHTML = rows.map((id, k) => {
      const l = byId(id);
      const w = wins[id] || 0;
      return `<li><span class="pos">${["🥇", "🥈", "🥉", "4", "5"][k]}</span>${svgOf(l)}<div><strong>${l.name}</strong><div class="sub">${w} victoire${w > 1 ? "s" : ""}</div></div><span class="pts">${score[id]} pts</span></li>`;
    }).join("");
  }

  // ---------- Actions ----------
  document.querySelectorAll(".mode").forEach((b) => b.addEventListener("click", () => start(Number(b.dataset.size))));
  $("#again-btn").addEventListener("click", () => show("intro"));
  $("#quit-btn").addEventListener("click", () => { g = null; show("intro"); });

  $("#copy-btn").addEventListener("click", () => {
    const txt = "Mon top 5 des logos AI Champions LCL :\n" + g.rank.map((id, k) => `${k + 1}. ${byId(id).name}`).join("\n");
    const done = () => ($("#status").textContent = "Top 5 copié, vous pouvez le coller dans Teams ou un e-mail.");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done, () => ($("#status").textContent = txt));
    } else {
      $("#status").textContent = txt;
    }
  });

  function download(name, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  $("#download-btn").addEventListener("click", () => {
    const l = byId(g.rank[0]);
    download(`ai-champions-lcl-${l.id}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="960" height="960">${l.svg}</svg>`, "image/svg+xml");
  });
  $("#export-btn").addEventListener("click", () => {
    download("ai-champions-lcl-resultats.json", JSON.stringify({ exportedAt: new Date().toISOString(), logos: LOGOS.map((l) => ({ id: l.id, name: l.name })), games: store.games }, null, 2), "application/json");
  });
  $("#reset-btn").addEventListener("click", () => {
    store = { games: [] };
    save();
    renderLeader();
  });

  document.addEventListener("keydown", (e) => {
    if (panels.round.hidden || !document.getElementById("jeu").classList.contains("is-active") || e.ctrlKey || e.metaKey || e.altKey) return;
    const n = current().length;
    if (e.key === "ArrowLeft" && n === 2) pick(0);
    else if (e.key === "ArrowRight" && n === 2) pick(1);
    else if (/^[1-4]$/.test(e.key)) pick(Number(e.key) - 1);
  });

  renderCatalogue();
})();
