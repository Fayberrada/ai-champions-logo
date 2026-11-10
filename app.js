(function () {
  "use strict";

  const API = "https://champions-ia-api.vercel.app/api";
  const SIZE = 16; // propositions par partie → 15 duels
  const PSEUDO_KEY = "champions-ia-pseudo";
  const STAGES = { 16: "Huitièmes de finale", 8: "Quarts de finale", 4: "Demi-finales", 2: "🏆 Finale" };

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
  const items = new Map(LOGOS.map((l) => [l.id, l]));
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

  const views = { home: $("#home"), propose: $("#propose"), arena: $("#arena"), results: $("#results") };
  const show = (name) => {
    Object.keys(views).forEach((k) => (views[k].hidden = k !== name));
    window.scrollTo({ top: 0 });
  };

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
  let g = null;
  let busy = false;

  // Les propositions les moins vues passent en priorité, et celles des joueurs encore plus,
  // pour que chacune soit jugée rapidement.
  function pickPool() {
    const all = [...items.keys()];
    const weight = (id) => (played[id] || 0) + Math.random() * 4 - (items.get(id).img ? 6 : 0);
    return shuffle(all.map((id) => [id, weight(id)]).sort((a, b) => a[1] - b[1]).slice(0, SIZE).map((x) => x[0]));
  }

  async function start() {
    const btn = $("#pseudo-form button");
    btn.disabled = true;
    await loadCatalog();
    btn.disabled = false;
    g = { pool: pickPool(), next: [], mi: 0, duels: [], done: 0, total: SIZE - 1 };
    g.pool.forEach((id) => { const it = items.get(id); if (it.img) new Image().src = it.img; });
    busy = false;
    show("arena");
    render();
  }

  function render() {
    const a = g.pool[g.mi * 2], b = g.pool[g.mi * 2 + 1];
    $("#stage").textContent = STAGES[g.pool.length] || `Tour de ${g.pool.length}`;
    $("#match").textContent = g.pool.length === 2 ? "Le dernier duel" : `Duel ${g.mi + 1} sur ${g.pool.length / 2}`;
    $("#prompt").textContent = g.pool.length === 2 ? "Quelle identité pour les Champions IA ?" : "Laquelle préférez-vous ?";
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
    const a = g.pool[g.mi * 2], b = g.pool[g.mi * 2 + 1];
    const w = i === 0 ? a : b;
    g.duels.push([a, b, w]);
    g.next.push(w);
    g.done += 1;
    document.querySelectorAll("#duel .card").forEach((c, k) => {
      c.classList.add(k === i ? "is-picked" : "is-out");
      c.disabled = true;
    });
    $("#bar").style.width = `${(g.done / g.total) * 100}%`;
    setTimeout(() => {
      g.mi += 1;
      if (g.mi * 2 >= g.pool.length) {
        g.pool = g.next;
        g.next = [];
        g.mi = 0;
      }
      busy = false;
      if (g.pool.length === 1) finish();
      else render();
    }, 450);
  }

  // ---------- Fin de partie ----------
  function finish() {
    g.champion = g.pool[0];
    $("#champion").innerHTML = art(items.get(g.champion));
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
})();
