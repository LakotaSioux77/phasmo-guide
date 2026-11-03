/* =========================================================================
   pages.js — encyclopedia pages (home, ghosts, cursed, equipment,
   mechanics, guides, models, compare, settings, about, search)
   ========================================================================= */
(function (App) {
  "use strict";
  const { esc, icon, evChips, badge, srcLinks, sp } = App;

  /* ---------- HOME ---------- */
  App.route(/^\/$/, () => {
    const a = App.analysis();
    const active = Object.keys(App.inv.ev).length + Object.keys(App.inv.obs).length;
    const favs = App.favs().map(App.ghost).filter(Boolean);
    const recent = App.store.get("recent", []);
    const diff = PD.difficulties.find(d => d.id === App.inv.difficulty);
    return { title: "Home", html: `
      <div class="page-head"><div><h1>Field Guide</h1><p>Phasmophobia ${esc(PD.meta.gameVersion)} · checked ${esc(PD.meta.lastVerified)}</p></div></div>
      <a href="#/quick" class="verdict" style="display:block;text-decoration:none;color:inherit">
        <div class="row between"><div><b>${icon("bolt", 18)} Quick Hunt</b><div class="muted small">Tap what you see and hear — get the ghosts that fit, why, and the next test.</div></div><span class="btn primary">Open</span></div>
      </a>
      <div class="grid c2" style="margin-top:12px">
        <div class="card"><h2>Current investigation</h2>
          <p class="muted small">${esc(diff ? diff.name : "")} · ${active ? active + " marks/clues" : "nothing marked yet"}</p>
          <p><b>${a.most.length || a.alive.length}</b> ghost${(a.most.length || a.alive.length) === 1 ? "" : "s"} ${a.most.length ? "fit your clues" : "still possible"}${a.verdict ? " — <span class='green'>" + esc(a.verdict.text) + "</span>" : ""}</p>
          <div class="row"><a class="btn small" href="#/tracker">Evidence tracker</a><a class="btn small" href="#/quick">Quick Hunt</a></div></div>
        <div class="card"><h2>Jump to</h2><div class="row">
          <a class="btn small" href="#/maps">${icon("map", 16)} Maps</a><a class="btn small" href="#/cursed">${icon("cards", 16)} Cursed</a>
          <a class="btn small" href="#/speeds">${icon("chart", 16)} Speeds</a><a class="btn small" href="#/timers">${icon("timer", 16)} Timers</a>
          <a class="btn small" href="#/mechanics">${icon("skull", 16)} Mechanics</a><a class="btn small" href="#/practice">${icon("quiz", 16)} Practice</a></div></div>
      </div>
      ${favs.length ? `<h2 style="margin-top:18px">Favourites</h2><div class="mini-list">${favs.map(g => `<a class="chip ev" href="#/ghost/${g.id}">${esc(g.name)}</a>`).join("")}</div>` : ""}
      ${recent.length ? `<h2 style="margin-top:18px">Recently viewed</h2><div class="mini-list">${recent.map(r => `<a class="chip" href="${esc(r.route)}">${esc(r.title)}</a>`).join("")}</div>` : ""}
      <div class="card" style="margin-top:18px"><h2>What changed recently</h2>
        <ul class="small"><li>v0.19.1.0 (Oct 7, 2026): Crimson Eye seasonal event + event-map toggle. No ghost mechanic changes listed.</li>
        <li>v0.19.0.0 (Aug 25, 2026): Restricted Prison, Brownstone and Point Hope; duplicate-media indicators; choose ghost type in custom difficulty.</li>
        <li>Jul 21, 2026: Deildegast added; 13 Willow Street reworked. May 2026: Aswang and Kormos added.</li></ul>
        <a class="small" href="#/about">Sources & changelog</a></div>` };
  });

  /* ---------- GHOST LIST ---------- */
  const filters = [
    ["all", "All"], ["fav", "★ Favourites"], ["fast", "Can be very fast"], ["early", "Hunts above 50%"], ["late", "Hunts below 50%"],
    ["nolos", "No LOS speed-up"], ["forced", "Has forced evidence"], ["new", "Added 2025–26"]
  ];
  function matchFilter(g, f) {
    if (f === "fav") return App.favs().includes(g.id);
    if (f === "fast") return g.speed.max >= 2.5 && (g.speed.los !== "yes" || g.speed.base >= 2 || ["jinn","raiju","dayan","kormos","aswang","moroi"].includes(g.id));
    if (f === "early") return g.thrMax == null || g.thrMax > 50;
    if (f === "late") return g.thrMax != null && g.thrMax < 50 || ["obambo","thaye","mare","gallu"].includes(g.id);
    if (f === "nolos") return g.speed.los === "no";
    if (f === "forced") return !!g.forced || g.fakeOrbs;
    if (f === "new") return /2025|2026/.test(g.added);
    return true;
  }
  App.ghostCard = g => `
    <a class="gcard" href="#/ghost/${g.id}">
      <h3>${esc(g.name)}${App.favs().includes(g.id) ? `<span class="amber">${icon("star", 14)}</span>` : ""}</h3>
      <div class="evs">${evChips(g.ev, g.forced)}${g.fakeOrbs ? '<span class="chip forced">+ fake Orbs</span>' : ""}</div>
      <div class="meta"><span>⟶ ${sp(g.speed.base)}${g.speed.min !== g.speed.max ? " (" + sp(g.speed.min).replace(" m/s", "") + "–" + sp(g.speed.max) + ")" : ""}</span><span>☾ ${esc(g.huntThr.split(" (")[0])}</span>${g.speed.los === "no" ? '<span class="amber">no LOS</span>' : ""}</div>
    </a>`;
  App.route(/^\/ghosts$/, (m, q) => {
    const f = q.get("f") || "all", ev = q.get("ev") || "";
    const list = PD.ghosts.filter(g => matchFilter(g, f) && (!ev || ev.split(",").every(e => g.ev.includes(e) || (e === "orbs" && g.fakeOrbs))));
    const evSel = ev ? ev.split(",") : [];
    const toggleEv = e => { const s = new Set(evSel); s.has(e) ? s.delete(e) : s.add(e); return [...s].join(","); };
    return { title: "Ghosts", html: `
      <div class="page-head"><div><h1>Ghosts <span class="muted small">${list.length}/30</span></h1><p>Every ghost in ${esc(PD.meta.gameVersion)}. Tap for full details.</p></div><a class="btn small" href="#/compare">${icon("compare", 16)} Compare</a></div>
      <div class="filters" role="toolbar" aria-label="Filters">${filters.map(([k, l]) => `<a class="fchip ${f === k ? "on" : ""}" href="#/ghosts?f=${k}${ev ? "&ev=" + ev : ""}">${l}</a>`).join("")}</div>
      <div class="filters" role="toolbar" aria-label="Evidence filter">${PD.evidence.map(e => `<a class="fchip ${evSel.includes(e.id) ? "on" : ""}" href="#/ghosts?f=${f}&ev=${toggleEv(e.id)}">${icon(e.id, 14)} ${esc(e.short)}</a>`).join("")}</div>
      <div class="grid c3" style="margin-top:8px">${list.map(App.ghostCard).join("") || '<div class="empty">No ghosts match these filters.</div>'}</div>` };
  });

  /* ---------- GHOST DETAIL ---------- */
  App.route(/^\/ghost\/([\w-]+)$/, m => {
    const g = App.ghost(m[1]); if (!g) return { html: '<div class="empty">Unknown ghost. <a href="#/ghosts">All ghosts</a></div>' };
    const fav = App.favs().includes(g.id);
    const obsC = PD.observations.filter(o => (o.confirm || []).includes(g.id));
    const obsX = PD.observations.filter(o => o.exclude && o.exclude[g.id]);
    return { title: g.name, recent: g.name, html: `
      <a class="small" href="#/ghosts">← All ghosts</a>
      <div class="page-head" style="margin-top:6px"><div><h1>${esc(g.name)}</h1><p>${esc(g.desc)}</p></div>
        <div class="row"><button class="btn small" id="favbtn">${icon("star", 16)} ${fav ? "Favourited" : "Favourite"}</button><a class="btn small" href="#/compare?ids=${g.id}">${icon("compare", 16)} Compare</a></div></div>
      <div class="card"><div class="row" style="margin-bottom:10px">${evChips(g.ev, g.forced)}${g.fakeOrbs ? '<span class="chip forced">+ fake Ghost Orbs (always)</span>' : ""}</div>
        <dl class="kv">
          <dt>Hunt sanity</dt><dd><b>${esc(g.huntThr)}</b>${g.thrNote ? `<div class="muted small">${esc(g.thrNote)}</div>` : ""}</dd>
          <dt>Speed</dt><dd><b>${sp(g.speed.base)}</b> base · range ${sp(g.speed.min)} – ${sp(g.speed.max)}<div class="muted small">${esc(g.speed.text)}</div></dd>
          <dt>Line of sight</dt><dd>${g.speed.los === "yes" ? "Normal speed-up while it sees you" : g.speed.los === "no" ? '<span class="amber">Never speeds up from line of sight</span>' : "Only in some conditions (see speed)"}</dd>
          ${g.forced ? `<dt>Forced evidence</dt><dd><span class="amber">${esc(App.evName(g.forced))}</span> is never the hidden evidence on Nightmare/Insanity.</dd>` : ""}
          <dt>Strength</dt><dd>${esc(g.strength)}</dd><dt>Weakness</dt><dd>${esc(g.weakness)}</dd>
          <dt>Added</dt><dd>${esc(g.added)}</dd>
        </dl></div>
      <details class="sec" open><summary>Identifying traits & hidden mechanics</summary><div class="body"><ul>${g.traits.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div></details>
      <details class="sec" open><summary>How to identify it</summary><div class="body"><dl class="kv">
        <dt class="green">Fastest</dt><dd>${esc(g.tests.fastest)}</dd>
        <dt class="green">Safe</dt><dd>${esc(g.tests.safe)}</dd>
        <dt class="red">Risky</dt><dd>${esc(g.tests.risky)}</dd>
        <dt>Zero evidence</dt><dd>${esc(g.tests.zero)}</dd>
        <dt>1–2 evidence</dt><dd>${g.forced ? "Its " + esc(App.evName(g.forced)) + " always shows — missing it rules this ghost out. " : ""}Use the evidence you have to narrow the list, then the behaviour test above to split the rest.</dd></dl></div></details>
      <div class="grid c2" style="margin-top:10px">
        <div class="card"><h3 class="green">Confirms it</h3>${g.confirm.length ? `<ul>${g.confirm.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : '<p class="muted small">No single behaviour confirms it — combine evidence and rule-outs.</p>'}</div>
        <div class="card"><h3 class="red">Rules it out</h3>${g.exclude.length ? `<ul>${g.exclude.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : '<p class="muted small">No behaviour rules it out by itself.</p>'}</div>
      </div>
      ${g.confused.length ? `<details class="sec" open><summary>Often confused with</summary><div class="body"><ul>${g.confused.map(([id, t]) => `<li><a href="#/ghost/${id}">${esc(App.ghost(id).name)}</a> — ${esc(t)} <a class="small" href="#/compare?ids=${g.id},${id}">compare</a></li>`).join("")}</ul></div></details>` : ""}
      <details class="sec"><summary>Quick Hunt clues linked to this ghost</summary><div class="body small">
        ${obsC.length ? `<p><b class="green">Defining:</b> ${obsC.map(o => esc(o.label)).join(" · ")}</p>` : ""}
        ${obsX.length ? `<p><b class="red">Would rule it out:</b> ${obsX.map(o => esc(o.label)).join(" · ")}</p>` : ""}</div></details>
      <details class="sec"><summary>Sources</summary><div class="body small">${srcLinks(g.src)}<p class="faint" style="margin-top:8px">${esc(PD.LOS_NOTE)}</p></div></details>`,
      mount: el => { App.$("#favbtn", el).onclick = () => { const on = App.toggleFav(g.id); App.toast(on ? "Added to favourites" : "Removed from favourites"); App._noScroll = true; App.render(); }; } };
  });

  /* ---------- COMPARE ---------- */
  App.compareTable = (ids, highlight) => {
    const gs = ids.map(App.ghost).filter(Boolean); if (gs.length < 2) return "";
    const row = (label, fn, diff) => { const vals = gs.map(fn); const differs = new Set(vals.map(v => v.replace(/<[^>]+>/g, ""))).size > 1;
      return `<tr${diff && differs && highlight ? ' style="background:var(--green-bg)"' : ""}><th>${label}</th>${vals.map(v => `<td>${v}</td>`).join("")}</tr>`; };
    return `<div class="tablewrap"><table class="t"><thead><tr><th>Feature</th>${gs.map(g => `<th><a href="#/ghost/${g.id}">${esc(g.name)}</a></th>`).join("")}</tr></thead><tbody>
      ${row("Evidence", g => g.ev.map(App.evShort).join(", ") + (g.fakeOrbs ? " + fake Orbs" : ""), true)}
      ${row("Base speed", g => sp(g.speed.base), true)}
      ${row("Speed range", g => sp(g.speed.min) + " – " + sp(g.speed.max), true)}
      ${row("LOS speed-up", g => g.speed.los === "yes" ? "Yes" : g.speed.los === "no" ? "No" : "Partial", true)}
      ${row("Hunt threshold", g => esc(g.huntThr), true)}
      ${row("Unique ability", g => esc(g.strength), false)}
      ${row("Weakness", g => esc(g.weakness), false)}
      ${row("Best distinguishing test", g => esc(g.tests.fastest), false)}
      ${row("Rules it out", g => esc(g.exclude[0] || "—"), false)}
    </tbody></table></div>`;
  };
  App.route(/^\/compare$/, (m, q) => {
    let ids = (q.get("ids") || "").split(",").filter(id => App.ghost(id)).slice(0, 4);
    return { title: "Compare", html: `
      <div class="page-head"><div><h1>Compare ghosts</h1><p>Pick 2–4 ghosts. Rows that differ are highlighted.</p></div></div>
      <div class="filters" style="flex-wrap:wrap">${PD.ghosts.map(g => { const on = ids.includes(g.id); const next = on ? ids.filter(i => i !== g.id) : ids.concat(g.id).slice(-4); return `<a class="fchip ${on ? "on" : ""}" href="#/compare?ids=${next.join(",")}">${esc(g.name)}</a>`; }).join("")}</div>
      <div style="margin-top:12px">${ids.length >= 2 ? App.compareTable(ids, true) : '<div class="empty">Select at least two ghosts.</div>'}</div>` };
  });

  /* ---------- CURSED POSSESSIONS ---------- */
  App.route(/^\/cursed$/, () => ({ title: "Cursed possessions", html: `
    <div class="page-head"><div><h1>Cursed possessions</h1><p>${esc(PD.cursedGeneral.spawn)}</p></div></div>
    <div class="notice" style="margin-bottom:12px"><b>Cursed hunts:</b> ${esc(PD.cursedGeneral.cursedHunt)} ${badge(PD.cursedGeneral.status)}</div>
    <div class="grid c3">${PD.cursed.map(c => `<a class="gcard" href="#/cursed/${c.id}"><h3>${icon(c.icon, 20)} ${esc(c.name)}</h3><p class="muted small" style="margin:0">${esc(c.purpose)}</p><div class="meta">${badge(c.status)}</div></a>`).join("")}</div>
    <h2 style="margin-top:20px">Where each one spawns</h2>
    <div class="tablewrap"><table class="t"><thead><tr><th>Map</th>${Object.values(PD.cursedNames).map(n => `<th>${esc(n)}</th>`).join("")}</tr></thead><tbody>
      ${PD.maps.map(mp => `<tr><th><a href="#/map/${mp.id}">${esc(mp.name)}</a></th>${Object.keys(PD.cursedNames).map(k => `<td class="small">${esc(mp.cursed[k] ? mp.cursed[k].room : "Unverified")}</td>`).join("")}</tr>`).join("")}
    </tbody></table></div>` }));

  App.route(/^\/cursed\/([\w-]+)$/, m => {
    const c = PD.cursed.find(x => x.id === m[1]); if (!c) return { html: '<div class="empty">Unknown item.</div>' };
    const list = (arr) => `<ul>${arr.map(t => `<li>${esc(t)}</li>`).join("")}</ul>`;
    return { title: c.name, recent: c.name, html: `
      <a class="small" href="#/cursed">← Cursed possessions</a>
      <div class="page-head" style="margin-top:6px"><div><h1>${icon(c.icon, 26)} ${esc(c.name)}</h1><p>${esc(c.purpose)}</p></div>${badge(c.status)}</div>
      ${c.note ? `<div class="notice" style="margin-bottom:10px">${esc(c.note)}</div>` : ""}
      <div class="card"><dl class="kv"><dt>Looks like</dt><dd>${esc(c.look)}</dd><dt>Activation</dt><dd>${esc(c.activation)}</dd><dt>Sanity cost</dt><dd>${esc(c.sanity)}</dd><dt>If it breaks / is misused</dt><dd>${esc(c.broken)}</dd><dt>Availability</dt><dd>${esc(PD.cursedGeneral.availability)}</dd></dl></div>
      <details class="sec" open><summary>How to use it</summary><div class="body">${list(c.use)}</div></details>
      <details class="sec" open><summary class="red">How it can trigger a hunt</summary><div class="body">${list(c.hunt)}<p class="muted small">${esc(PD.cursedGeneral.cursedHunt)}</p></div></details>
      ${c.questions ? `<details class="sec" open><summary>Ouija Board questions</summary><div class="body"><div class="tablewrap"><table class="t"><thead><tr><th>Type</th><th>Say</th><th>Answer</th><th>Cost</th></tr></thead><tbody>${c.questions.map(q => `<tr><td>${esc(q.cat)}</td><td>${esc(q.examples)}</td><td>${esc(q.answer)}</td><td>${esc(q.cost)} ${q.status === "unverified" ? '<span class="badge unverified">sources differ</span>' : ""}</td></tr>`).join("")}</tbody></table></div><p class="faint small" style="margin-top:8px">Cost ranges show where 2024–2026 guides disagree. Ask expensive questions while your sanity is high.</p></div></details>` : ""}
      ${c.cards ? `<details class="sec" open><summary>Tarot card gallery</summary><div class="body"><div class="tarot">${c.cards.map(t => `<div class="tcard"><div class="art">${icon("tarot", 30)}</div><b>${esc(t.name)}</b><span class="pc">${esc(t.chance)}</span><span class="small muted">${esc(t.effect)}</span></div>`).join("")}</div><p class="faint small" style="margin-top:8px">Card illustrations are original placeholders, not game artwork.</p></div></details>` : ""}
      ${c.wishes ? `<details class="sec" open><summary>Monkey Paw wishes</summary><div class="body"><div class="tablewrap"><table class="t"><thead><tr><th>Wish</th><th>Effect</th><th>Downside</th></tr></thead><tbody>${c.wishes.map(w => `<tr><td>“${esc(w.wish)}”</td><td>${esc(w.effect)}</td><td>${esc(w.downside)} ${badge(w.status)}</td></tr>`).join("")}</tbody></table></div></div></details>` : ""}
      <div class="grid c2" style="margin-top:10px"><div class="card"><h3 class="green">Safe usage</h3>${list(c.safe)}</div><div class="card"><h3>Advanced uses</h3>${list(c.advanced)}</div></div>
      ${c.ghostNotes.length ? `<details class="sec" open><summary>Ghost-specific interactions</summary><div class="body"><ul>${c.ghostNotes.map(([id, t]) => `<li><a href="#/ghost/${id}">${esc(App.ghost(id).name)}</a>: ${esc(t)}</li>`).join("")}</ul></div></details>` : ""}
      <details class="sec"><summary>Location on every map</summary><div class="body"><ul class="small">${PD.maps.map(mp => mp.cursed[c.id] ? `<li><a href="#/map/${mp.id}">${esc(mp.name)}</a> — <b>${esc(mp.cursed[c.id].room)}</b>: ${esc(mp.cursed[c.id].dir)}</li>` : "").join("")}</ul></div></details>
      <details class="sec"><summary>Sources</summary><div class="body small">${srcLinks(c.src)}</div></details>` };
  });

  /* ---------- EQUIPMENT ---------- */
  App.route(/^\/equipment$/, () => ({ title: "Equipment", html: `
    <div class="page-head"><div><h1>Equipment</h1><p>${esc(PD.mediaNote)}</p></div></div>
    ${PD.equipment.map(e => `<details class="sec" id="eq-${e.id}"><summary><span>${e.evidence ? icon(e.evidence, 18) : icon("wrench", 18)} ${esc(e.name)} <span class="faint small">· ${esc(e.kind)}</span></span>${badge(e.status)}</summary><div class="body"><dl class="kv">
      <dt>What it does</dt><dd>${esc(e.what)}</dd><dt>How to use</dt><dd>${esc(e.use)}</dd><dt>Tiers</dt><dd>${esc(e.tiers)}</dd>
      <dt>Strengths</dt><dd>${esc(e.strengths)}</dd><dt>Weaknesses</dt><dd>${esc(e.weaknesses)}</dd>
      ${e.ghosts.length ? `<dt>Ghost-specific</dt><dd>${e.ghosts.map(esc).join("<br>")}</dd>` : ""}
      <dt>Common mistakes</dt><dd>${esc(e.mistakes)}</dd><dt>During hunts</dt><dd>${esc(e.hunts)}</dd></dl>
      ${e.src ? `<p class="small" style="margin-top:8px">${srcLinks(e.src)}</p>` : ""}</div></details>`).join("")}` }));

  /* ---------- MECHANICS ---------- */
  App.route(/^\/mechanics$/, () => ({ title: "Hunt mechanics", html: `
    <div class="page-head"><div><h1>Sanity & hunt mechanics</h1><p>Core rules, protections and difficulty effects.</p></div><a class="btn small" href="#/timers">${icon("timer", 16)} Timers</a></div>
    <div class="card"><h2>Who can hunt right now?</h2><p class="muted small">Enter the team's average sanity. Shows which ghosts can start a <b>normal</b> hunt at that sanity (best case for each ghost's conditions).</p>
      <div class="sanity-in"><input type="range" min="0" max="100" value="60" id="calcS" aria-label="Average sanity"><b id="calcV" class="mono">60%</b></div><div id="calcOut" class="small" style="margin-top:10px"></div></div>
    ${PD.mechanics.map(s => `<details class="sec" open><summary><span>${esc(s.title)}</span>${badge(s.status)}</summary><div class="body"><dl class="kv">${s.items.map(([h, t]) => `<dt>${esc(h)}</dt><dd>${esc(t)}</dd>`).join("")}</dl><p class="small faint" style="margin-top:8px">${srcLinks(s.src)}</p></div></details>`).join("")}`,
    mount: el => {
      const r = App.$("#calcS", el), v = App.$("#calcV", el), o = App.$("#calcOut", el);
      const upd = () => { const s = +r.value; v.textContent = s + "%";
        const can = PD.ghosts.filter(g => g.thrMax == null || s <= g.thrMax);
        const cant = PD.ghosts.filter(g => !(g.thrMax == null || s <= g.thrMax));
        o.innerHTML = `<p><b class="red">Can hunt (${can.length}):</b> ${can.map(g => esc(g.name) + (g.thrMax == null ? "*" : "")).join(", ")}</p><p><b class="green">Cannot normally hunt (${cant.length}):</b> ${cant.map(g => esc(g.name)).join(", ") || "—"}</p><p class="faint">* Banshee uses its target's sanity; Mimic copies another ghost. Cursed possessions can force a hunt at any sanity.</p>`; };
      r.oninput = upd; upd();
    } }));

  /* ---------- GUIDES ---------- */
  function groupList(title, items) { return `<div class="card"><h3>${esc(title)}</h3><ul class="small">${items.map(([id, t]) => `<li><a href="#/ghost/${id}">${esc(App.ghost(id).name)}</a> — ${esc(t)}</li>`).join("")}</ul></div>`; }
  App.route(/^\/guides$/, () => {
    const early = PD.ghosts.filter(g => g.thrMax == null || g.thrMax > 50).map(g => [g.id, g.huntThr]);
    const faster = PD.ghosts.filter(g => g.speed.min !== g.speed.max && g.speed.los !== "yes" || ["jinn","raiju","dayan","kormos","aswang","moroi","gallu","obambo","twins"].includes(g.id)).map(g => [g.id, g.speed.text]);
    return { title: "Advanced guides", html: `
      <div class="page-head"><div><h1>Advanced guides</h1><p>No-evidence masterclass, investigation, survival and comparisons.</p></div><a class="btn small" href="#/models">${icon("eye", 16)} Ghost models</a></div>
      <details class="sec" open><summary>No-evidence masterclass</summary><div class="body"><dl class="kv">${PD.masterclass.map(([h, t]) => `<dt>${esc(h)}</dt><dd>${esc(t)}</dd>`).join("")}</dl>
        <p style="margin-top:10px"><a class="btn small primary" href="#/quick?mode=guided">Open the interactive decision tree</a> <a class="btn small" href="#/speeds">Speed chart</a></p></div></details>
      ${PD.expert.map(s => `<details class="sec"><summary><span>${esc(s.title)}</span>${badge(s.status)}</summary><div class="body"><dl class="kv">${s.items.map(([h, t]) => `<dt>${esc(h)}</dt><dd>${esc(t)}</dd>`).join("")}</dl></div></details>`).join("")}
      <h2 style="margin-top:18px">Advanced comparisons</h2>
      <div class="grid c2">
        ${groupList("Can hunt unusually early (above 50%)", early)}
        ${groupList("Speed changes under conditions", faster)}
        ${groupList("Unique audio cues", [["banshee","Unique scream on Parabolic Mic / Recorder"],["myling","Quiet hunts; frequent paranormal sounds"],["deogen","Heavy-breathing Spirit Box reply"]])}
        ${groupList("Unusual UV behaviour", [["obake","6-finger handprints, double switch prints, skipped steps"],["wraith","No salt footprints — it never steps in salt"],["gallu","No salt prints while Enraged"]])}
        ${groupList("Electronics interactions", [["raiju","Faster near electronics; 15 m interference"],["jinn","Needs the breaker on; never turns it off"],["hantu","Never turns the breaker on"],["yokai","Barely hears electronics in hunts"],["mare","Never turns lights/TVs on"]])}
        ${groupList("Special visibility / blinking", [["oni","More visible"],["deogen","More visible"],["phantom","Nearly invisible; vanishes in photos"],["obake","Shapeshifts for one blink"]])}
        ${groupList("Reacts to nearby players", [["dayan","Your movement sets its speed"],["kormos","Hears your movement"],["yokai","Talking makes it hunt early"],["shade","Shy near players"],["thaye","Ages near players"],["banshee","Targets one player"]])}
      </div>` };
  });

  /* ---------- MODELS ---------- */
  const fig = cls => `<svg viewBox="0 0 60 90" width="70" height="100" class="${cls}"><path d="M30 6c9 0 14 7 14 15s-4 12-4 12l8 10c3 4 2 9-1 12l-4 30H17l-4-30c-3-3-4-8-1-12l8-10s-4-4-4-12 5-15 14-15Z" fill="currentColor" opacity=".85"/></svg>`;
  App.route(/^\/models$/, () => ({ title: "Ghost models", html: `
    <div class="page-head"><div><h1>Ghost appearances & models</h1><p>What a ghost looks like versus what type it is.</p></div></div>
    <div class="notice green"><b>Key rule:</b> the ghost's model is random for its gender and does <b>not</b> tell you the ghost type. The only link: <a href="#/ghost/banshee">Banshee</a> and <a href="#/ghost/dayan">Dayan</a> are always female — a male model or name rules both out. ${badge("verified")}</div>
    <div class="card" style="margin-top:12px"><h2>Blink visibility during hunts</h2><p class="muted small">Original illustration of relative visibility — not real timings.</p>
      <div class="ghostfig"><figure><div class="green">${fig("blink-normal")}</div><figcaption>Most ghosts</figcaption></figure><figure><div class="green">${fig("blink-oni")}</div><figcaption>Oni / Deogen — more visible</figcaption></figure><figure><div class="green">${fig("blink-phantom")}</div><figcaption>Phantom — barely visible</figcaption></figure></div>
      <p class="small" style="margin-top:10px"><a href="#/ghost/obake">Obake</a> swaps to a different model of the same gender for a single blink.</p></div>
    <details class="sec" open><summary>Appearance types</summary><div class="body"><dl class="kv">
      <dt>Full model</dt><dd>Seen in many ghost events and in hunts (flickering).</dd>
      <dt>Shadow</dt><dd>A dark silhouette in events. Shade prefers it and is the only ghost that appears as a shadow in Summoning Circle, Music Box and Monkey Paw events.</dd>
      <dt>Translucent</dt><dd>Dark see-through form in some events.</dd>
      <dt>D.O.T.S. silhouette</dt><dd>Green outline in the projector field (Goryo: camera only).</dd>
      <dt>Hunting</dt><dd>Blinks in and out; electronics flicker within 10 m (Raiju 15 m).</dd></dl></div></details>
    <div class="notice" style="margin-top:12px"><b>Model image gallery not included.</b> The game's character models are copyrighted art and no licence-free screenshot set was available, so this guide does not reproduce them. The data structure is ready for licensed or original images if you add them later (see README). ${badge("unverified")}</div>` }));

  /* ---------- SETTINGS ---------- */
  App.route(/^\/settings$/, () => ({ title: "Settings", html: `
    <div class="page-head"><div><h1>Settings</h1><p>Saved on this device only.</p></div></div>
    <div class="card stack">
      <div><b>Theme</b><div class="seg" style="margin-top:6px" data-set="theme"><button data-v="dark">Dark</button><button data-v="light">Light</button></div></div>
      <div><b>High contrast</b><div class="seg" style="margin-top:6px" data-set="contrast"><button data-v="normal">Off</button><button data-v="high">On</button></div></div>
      <div><b>Text size</b><div class="seg" style="margin-top:6px" data-set="size"><button data-v="normal">Normal</button><button data-v="large">Large</button></div></div>
      <div><b>Custom ghost speed</b> <span class="muted small">(custom difficulty — scales every speed shown in the app)</span>
        <div class="sanity-in" style="margin-top:6px"><input type="range" min="50" max="150" step="5" id="spd" value="${App.speedPct()}" aria-label="Ghost speed percent"><b class="mono" id="spdv">${App.speedPct()}%</b></div></div>
    </div>
    <div class="card"><h2>Data</h2><div class="row"><button class="btn danger" id="clr">Clear favourites, recent & investigation</button></div></div>
    <div class="card"><h2>Install as an app</h2><p class="small">iPhone: open in Safari → Share → <b>Add to Home Screen</b>. Android: Chrome menu → <b>Install app</b> / Add to Home screen. Windows/Mac: Chrome or Edge → install icon in the address bar. Works offline after the first visit.</p></div>`,
    mount: el => {
      App.$$("[data-set]", el).forEach(seg => { const k = seg.dataset.set; const cur = App.store.get(k, k === "theme" ? "dark" : "normal");
        App.$$("button", seg).forEach(b => { b.classList.toggle("on", b.dataset.v === cur); b.onclick = () => { App.store.set(k, b.dataset.v); App.applyPrefs(); App._noScroll = true; App.render(); }; }); });
      const s = App.$("#spd", el); s.oninput = () => { App.store.set("speedPct", +s.value); App.$("#spdv", el).textContent = s.value + "%"; };
      App.$("#clr", el).onclick = () => App.confirm("Clear saved favourites, recent pages and the current investigation?", "Clear", () => { ["favs","recent","inv"].forEach(App.store.del); App.resetInv(); App.render(); });
    } }));

  /* ---------- ABOUT / SOURCES ---------- */
  App.route(/^\/about$/, () => {
    const unv = [];
    PD.cursed.forEach(c => { if (c.status === "unverified") unv.push(c.name + ": " + (c.note || "details not re-verified")); (c.wishes || []).forEach(w => w.status === "unverified" && unv.push("Monkey Paw — '" + w.wish + "' penalty")); (c.questions || []).forEach(q => q.status === "unverified" && unv.push("Ouija — " + q.cat + " cost (" + q.cost + ")")); });
    unv.push("Fuse box locations and hiding spots on all 17 maps (2026 layouts)", "Accurate overhead floor plans for all maps (no licensed source)", "Ghost model images (copyrighted art not reproduced)", "Room counts after the 13 Willow Street rework", "Exact equipment tier ranges", "Time for line-of-sight speed to reach its maximum (13 s vs 26 s in sources)", "Progression numbers (XP, unlock levels, badges)");
    return { title: "About & sources", html: `
      <div class="page-head"><div><h1>About, sources & changelog</h1><p>${esc(PD.meta.note)}</p></div>${window.PFG_ARTIFACT ? "" : `<button class="btn small no-print" onclick="window.print()">${icon("print", 16)} Print</button>`}</div>
      <div class="card"><dl class="kv"><dt>Game version</dt><dd>${esc(PD.meta.gameVersion)} (${esc(PD.meta.gameVersionDate)})</dd><dt>Last checked</dt><dd>${esc(PD.meta.lastVerified)}</dd><dt>App version</dt><dd>${esc(PD.meta.appVersion)}</dd></dl>
        <p class="small" style="margin-top:8px">Labels: ${badge("verified")} checked against a 2026 source · ${badge("likely")} long-standing mechanic not re-checked line by line · ${badge("unverified")} conflicting or unconfirmed.</p></div>
      <details class="sec" open><summary>Still needs verification (${unv.length})</summary><div class="body"><ul class="small">${unv.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div></details>
      <details class="sec"><summary>Changelog</summary><div class="body">${PD.changelog.map(c => `<p><b>${esc(c.version)}</b> · ${esc(c.date)} · game ${esc(c.game)}</p><ul class="small">${c.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>`).join("")}</div></details>
      <details class="sec"><summary>All sources (${Object.keys(PD.sources).length})</summary><div class="body small">${srcLinks(Object.keys(PD.sources))}</div></details>
      <details class="sec"><summary>How to share & install</summary><div class="body small"><ol>
        <li><b>iPhone:</b> open the site link in Safari.</li><li><b>Home Screen:</b> tap Share (square with arrow) → Add to Home Screen → Add.</li>
        <li><b>Android:</b> open in Chrome → ⋮ menu → Install app (or Add to Home screen).</li><li><b>Windows/Mac:</b> open in Chrome/Edge; click the install icon in the address bar, or just bookmark it.</li>
        <li><b>Offline:</b> after one online visit, the installed app works offline. The standalone HTML file works offline anywhere.</li><li><b>Share:</b> send the website link to friends.</li></ol></div></details>` };
  });

  /* ---------- SEARCH ---------- */
  App.searchIndex = () => {
    if (App._idx) return App._idx;
    const idx = [];
    PD.ghosts.forEach(g => idx.push({ k: "Ghost", t: g.name, s: [g.desc, g.strength, g.weakness, g.traits.join(" ")].join(" "), r: "#/ghost/" + g.id }));
    PD.maps.forEach(m => idx.push({ k: "Map", t: m.name, s: Object.values(m.cursed).map(c => c.room).join(" "), r: "#/map/" + m.id }));
    PD.cursed.forEach(c => idx.push({ k: "Cursed", t: c.name, s: c.purpose + " " + c.use.join(" "), r: "#/cursed/" + c.id }));
    PD.equipment.forEach(e => idx.push({ k: "Equipment", t: e.name, s: e.what + " " + e.use, r: "#/equipment" }));
    PD.mechanics.forEach(s => s.items.forEach(([h, t]) => idx.push({ k: "Mechanic", t: h, s: t, r: "#/mechanics" })));
    PD.observations.forEach(o => idx.push({ k: "Clue", t: o.label, s: o.detail || "", r: "#/quick" }));
    PD.evidence.forEach(e => idx.push({ k: "Evidence", t: e.name, s: e.how, r: "#/ghosts?ev=" + e.id }));
    [["Speed chart","#/speeds"],["Timers","#/timers"],["Practice quiz","#/practice"],["Settings","#/settings"],["Sources & changelog","#/about"],["Ghost models","#/models"]].forEach(([t, r]) => idx.push({ k: "Page", t, s: "", r }));
    return (App._idx = idx);
  };
  App.openSearch = () => {
    const s = App.openSheet(`<input class="input" id="sq" type="search" placeholder="Search ghosts, maps, items, clues…" autocomplete="off" aria-label="Search"><div class="sresults" id="sr" style="margin-top:8px"></div>`, "Search");
    const q = App.$("#sq", s), out = App.$("#sr", s);
    const run = () => { const t = q.value.trim().toLowerCase(); if (!t) { out.innerHTML = '<p class="muted small">Try "salt", "fast", "Tanglewood" or "incense".</p>'; return; }
      const res = App.searchIndex().map(x => ({ x, sc: (x.t.toLowerCase().includes(t) ? 3 : 0) + (x.t.toLowerCase().startsWith(t) ? 2 : 0) + (x.s.toLowerCase().includes(t) ? 1 : 0) })).filter(r => r.sc).sort((a, b) => b.sc - a.sc).slice(0, 25);
      out.innerHTML = res.map(({ x }) => `<a href="${x.r}"><span class="k">${esc(x.k)}</span>${esc(x.t)}</a>`).join("") || '<p class="muted small">No results.</p>';
      App.$$("a", out).forEach(a => a.onclick = App.closeSheet); };
    q.oninput = run; run(); setTimeout(() => q.focus(), 60);
  };
})(window.App);
