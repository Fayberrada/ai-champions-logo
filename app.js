(function () {
  "use strict";

  const API = "https://champions-ia-api.vercel.app/api";
  const SIZE = 16; // logos par partie → 15 duels
  const PSEUDO_KEY = "champions-ia-pseudo";
  const STAGES = { 16: "Huitièmes de finale", 8: "Quarts de finale", 4: "Demi-finales", 2: "🏆 Finale" };

  const $ = (s) => document.querySelector(s);
  const byId = (id) => LOGOS.find((l) => l.id === id);
  const svgOf = (l) => `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${l.name}">${l.svg}</svg>`;
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

  const views = { home: $("#home"), arena: $("#arena"), results: $("#results") };
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

  $("#pseudo-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value.replace(/[<>]/g, "").trim();
    const hint = $("#pseudo-hint");
    if (v.length < 2 || v.length > 24) {
      hint.textContent = "Le pseudo doit faire entre 2 et 24 caractères.";
      hint.classList.add("error");
      input.focus();
      return;
    }
    hint.classList.remove("error");
    pseudo = v;
    store.set(PSEUDO_KEY, pseudo);
    setWho();
    start();
  });

  // ---------- Tournoi ----------
  let g = null;
  let busy = false;

  function start() {
    g = { pool: shuffle(LOGOS.map((l) => l.id)).slice(0, SIZE), next: [], mi: 0, duels: [], done: 0, total: SIZE - 1 };
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
      btn.innerHTML = svgOf(byId(id));
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
    $("#champion").innerHTML = svgOf(byId(g.champion));
    $("#top5").innerHTML = "";
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

  function renderTop(data) {
    const n = data.players;
    $("#stats").textContent = `${n} joueur${n > 1 ? "s" : ""} · ${data.duels} duels joués. Score = chances de gagner un duel face à une proposition moyenne.`;
    const medals = ["🥇", "🥈", "🥉", "4", "5"];
    $("#top5").innerHTML = data.top
      .map((row, k) => {
        const l = byId(row.id);
        if (!l) return "";
        const mine = row.id === g.champion ? " mine" : "";
        return `<li class="${mine.trim()}"><span class="rank">${medals[k]}</span><div class="thumb">${svgOf(l)}</div>` +
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
