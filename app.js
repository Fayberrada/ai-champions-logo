(function () {
  "use strict";

  const KEY = "aic-logo-votes-v1";
  const $ = (sel) => document.querySelector(sel);

  // ---------- Utilitaires ----------
  const svgOf = (logo) =>
    `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${logo.name}">${logo.svg}</svg>`;
  const byId = (id) => LOGOS.find((l) => l.id === id);
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Stockage local (par navigateur). Toujours protégé : l'interface marche sans.
  function loadStore() {
    try {
      const raw = localStorage.getItem(KEY);
      const data = raw ? JSON.parse(raw) : null;
      return data && Array.isArray(data.runs) ? data : { runs: [] };
    } catch (e) {
      return { runs: [] };
    }
  }
  function saveStore(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      /* stockage indisponible : on continue sans sauvegarde */
    }
  }
  let store = loadStore();

  // ---------- Onglets ----------
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      document.querySelectorAll(".tab").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      document.querySelectorAll(".view").forEach((v) => v.classList.toggle("is-active", v.id === target));
    });
  });

  // ---------- Catalogue ----------
  const filtersEl = $("#filters");
  const gridEl = $("#grid");
  let activeEsprit = "Tous";
  const esprits = ["Tous", ...new Set(LOGOS.map((l) => l.esprit))];

  function renderGrid() {
    gridEl.innerHTML = "";
    LOGOS.filter((l) => activeEsprit === "Tous" || l.esprit === activeEsprit).forEach((l) => {
      const card = document.createElement("article");
      card.className = "logo-card";
      card.innerHTML = `${svgOf(l)}<div class="name"><span class="num">#${l.id}</span> ${l.name}</div><div class="meta">${l.esprit} · ${l.style}</div>`;
      gridEl.appendChild(card);
    });
  }
  function renderFilters() {
    filtersEl.innerHTML = "";
    esprits.forEach((e) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (e === activeEsprit ? " is-active" : "");
      b.textContent = e;
      b.setAttribute("aria-pressed", String(e === activeEsprit));
      b.addEventListener("click", () => {
        activeEsprit = e;
        renderFilters();
        renderGrid();
      });
      filtersEl.appendChild(b);
    });
  }

  // ---------- Tournoi ----------
  // Règles : à chaque tour, les logos restants sont mélangés et regroupés par trois.
  // Le logo choisi passe au tour suivant, les deux autres sont éliminés.
  // Les restes (1 ou 2 logos) sont qualifiés d'office. Quand il reste 3 logos ou moins,
  // ils s'affrontent dans un dernier choix : le logo choisi est le gagnant.
  let run = null;
  let busy = false;

  function newRun() {
    return { pool: LOGOS.map((l) => l.id), round: 1, final: false, matches: [], mi: 0, next: [], picks: [], champion: null };
  }

  function buildRound() {
    run.final = run.pool.length <= 3;
    const items = run.final ? run.pool.slice() : shuffle(run.pool);
    run.matches = [];
    run.next = [];
    if (run.final) {
      run.matches.push(items);
    } else {
      let i = 0;
      while (items.length - i >= 3) {
        run.matches.push(items.slice(i, i + 3));
        i += 3;
      }
      run.next = items.slice(i);
    }
    run.mi = 0;
  }

  const panels = {
    intro: $("#intro-box"),
    round: $("#round-box"),
    winner: $("#winner-box"),
  };
  function showPanel(name) {
    Object.keys(panels).forEach((k) => (panels[k].hidden = k !== name));
  }

  function startRun() {
    run = newRun();
    buildRound();
    busy = false;
    showMatch();
  }

  function showMatch() {
    const match = run.matches[run.mi].map(byId);
    $("#round-label").textContent = run.final ? "Tour final" : `Tour ${run.round}`;
    $("#match-label").textContent = `Match ${run.mi + 1} sur ${run.matches.length} · ${run.pool.length} logos en lice`;
    const box = $("#options");
    box.innerHTML = "";
    box.className = "options " + (match.length === 2 ? "two" : "");
    match.forEach((logo, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "card";
      b.setAttribute("aria-label", `Choisir le logo ${logo.name} (touche ${i + 1})`);
      b.innerHTML = `${svgOf(logo)}<span class="label">${i + 1}. ${logo.name}</span><span class="sub">${logo.esprit} · ${logo.style}</span>`;
      b.addEventListener("click", () => pick(i));
      box.appendChild(b);
    });
    $("#status").textContent = "";
    showPanel("round");
  }

  function pick(index) {
    if (busy || !run || run.champion || run.matches.length === 0) return;
    const match = run.matches[run.mi];
    if (index < 0 || index >= match.length) return;
    busy = true;
    const winner = match[index];
    run.picks.push({ round: run.final ? "final" : run.round, options: match.slice(), winner });

    const cards = document.querySelectorAll("#options .card");
    cards.forEach((c, i) => {
      c.classList.toggle("is-picked", i === index);
      c.classList.toggle("is-out", i !== index);
      c.disabled = true;
    });

    setTimeout(() => {
      if (run.final) {
        run.champion = winner;
        finish();
        return;
      }
      run.next.push(winner);
      run.mi += 1;
      if (run.mi >= run.matches.length) {
        run.pool = run.next;
        run.round += 1;
        buildRound();
      }
      busy = false;
      showMatch();
    }, 280);
  }

  function finish() {
    const logo = byId(run.champion);
    $("#winner").innerHTML = svgOf(logo);
    $("#winner-meta").textContent = `${logo.name} · ${logo.esprit} · ${logo.style}. Choisi en ${run.picks.length} décisions.`;
    store.runs.push({
      date: new Date().toISOString(),
      champion: logo.id,
      picks: run.picks.map((p) => ({ round: p.round, options: p.options, winner: p.winner })),
    });
    saveStore(store);
    busy = false;
    showPanel("winner");
  }

  $("#start-btn").addEventListener("click", startRun);
  $("#restart-btn").addEventListener("click", () => {
    showPanel("intro");
    run = null;
  });

  $("#download-btn").addEventListener("click", () => {
    if (!run || !run.champion) return;
    const logo = byId(run.champion);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">${logo.svg}</svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-champions-logo-${logo.id}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  $("#export-btn").addEventListener("click", () => {
    const data = { exportedAt: new Date().toISOString(), logos: LOGOS.map((l) => ({ id: l.id, name: l.name })), runs: store.runs };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-champions-choix.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  // Raccourcis clavier 1, 2, 3 pendant un tour
  document.addEventListener("keydown", (e) => {
    if (panels.round.hidden || e.ctrlKey || e.metaKey || e.altKey) return;
    const n = Number(e.key);
    if (n >= 1 && n <= 3) pick(n - 1);
  });

  renderFilters();
  renderGrid();
})();
