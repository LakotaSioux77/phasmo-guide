/* =========================================================================
   quickhunt.js — Quick Hunt Mode, guided decision tree, evidence tracker,
   desktop side dock. All share App.inv (saved locally).
   ========================================================================= */
(function (App) {
  "use strict";
  const { esc, icon, evChips, sp } = App;

  /* ---------- shared pieces ---------- */
  function difficultySelect(id) {
    return `<select class="input" id="${id}" aria-label="Difficulty" style="min-height:40px;width:auto;padding:6px 10px">${PD.difficulties.map(d => `<option value="${d.id}" ${d.id === App.inv.difficulty ? "selected" : ""}>${esc(d.name)} (${d.evidence} ev)</option>`).join("")}</select>`;
  }
  function bindDifficulty(el, id) {
    const s = App.$("#" + id, el); if (!s) return;
    s.onchange = () => { App.snapshot(); App.inv.difficulty = s.value; App.saveInv(); const d = PD.difficulties.find(x => x.id === s.value); App.toast(d.name + ": " + d.evidence + " evidence"); };
  }
  function statusChips() {
    const evs = Object.keys(App.inv.ev);
    const obs = Object.keys(App.inv.obs);
    const parts = evs.map(e => `<span class="chip ${App.inv.ev[e] === "yes" ? "ev" : "red"}">${icon(e, 13)}${App.inv.ev[e] === "yes" ? "" : "✕ "}${esc(App.evShort(e))}</span>`);
    if (App.inv.huntSanity != null) parts.push(`<span class="chip">Hunt at ${App.inv.huntSanity}%</span>`);
    obs.forEach(id => { const o = PE.obsById(id); if (o) parts.push(`<span class="chip ${App.inv.obs[id] === "unsure" ? "forced" : "ev"}">${App.inv.obs[id] === "unsure" ? "? " : ""}${esc(o.label.length > 34 ? o.label.slice(0, 32) + "…" : o.label)}</span>`); });
    return parts.join("") || '<span class="chip">No evidence or clues yet</span>';
  }

  /* One ghost result card */
  function resultCard(r, opts) {
    const g = r.ghost; const open = opts.open ? "open" : "";
    const spdTxt = g.speed.min === g.speed.max ? sp(g.speed.base) : sp(g.speed.min).replace(" m/s", "") + "–" + sp(g.speed.max);
    if (opts.out) return `<details class="rcard out"><summary><span class="nm">${esc(g.name)}</span><span class="spd red">ruled out</span></summary><div class="body"><ul class="exc">${r.excludedBy.map(x => `<li>${esc(x.text)}</li>`).join("")}</ul></div></details>`;
    const why = r.confirms.map(c => `<li><b class="green">Defining:</b> ${esc(PE.obsById(c.id) ? PE.obsById(c.id).label : "")} — ${esc(c.text)}</li>`)
      .concat(r.matches.map(c => `<li>${c.id === "huntSanity" ? "Hunt sanity: " : esc(PE.obsById(c.id) ? PE.obsById(c.id).label : "") + " — "}${esc(c.text)}</li>`))
      .concat(r.unsure.map(c => `<li class="amber">${esc(c.text)}</li>`)).join("");
    const best = g.tests.fastest;
    return `<details class="rcard ${opts.top ? "top" : ""}" ${open}><summary><span class="nm">${esc(g.name)}${r.confirms.length ? ' <span class="green small">● defining trait</span>' : ""}</span><span class="spd">${spdTxt} · ☾${esc(g.thrMax == null ? "var." : g.huntThr.split(" ")[0])}</span></summary>
      <div class="body">
        <div class="row" style="margin-bottom:8px">${evChips(g.ev, g.forced)}${g.fakeOrbs ? '<span class="chip forced">+ fake Orbs</span>' : ""}</div>
        <dl class="kv small"><dt>Base speed</dt><dd>${sp(g.speed.base)}</dd><dt>Special speed</dt><dd class="expl">${esc(g.speed.text)}</dd><dt>Hunt sanity</dt><dd>${esc(g.huntThr)}</dd><dt>Key trait</dt><dd>${esc(g.strength)}</dd></dl>
        ${why ? `<p class="small" style="margin:10px 0 4px"><b>Why it matches</b></p><ul class="why small">${why}</ul>` : ""}
        <p class="small" style="margin:10px 0 4px"><b class="red">What would rule it out</b></p><ul class="exc small">${(g.exclude.length ? g.exclude : ["No single behaviour rules it out — use evidence."]).map(t => `<li>${esc(t)}</li>`).join("")}</ul>
        <p class="small expl"><b class="green">Best next test:</b> ${esc(best)}</p>
        <a class="small" href="#/ghost/${g.id}">Full ${esc(g.name)} page →</a>
      </div></details>`;
  }

  function testCard(t) {
    const names = ids => (ids || []).map(i => App.ghost(i).name).join(", ");
    const dist = t.kind === "evidence"
      ? `<b>Yes</b> → ${esc(names(t.yesKeeps)) || "—"}${t.noKeeps ? ` · <b>No</b> → ${esc(names(t.noKeeps)) || "—"}` : ""}`
      : `${t.yesPoints && t.yesPoints.length ? `<b>Yes</b> points to ${esc(names(t.yesPoints))}. ` : ""}${t.ruledOutIfYes && t.ruledOutIfYes.length ? `<b>Yes</b> rules out ${esc(names(t.ruledOutIfYes))}.` : ""}`;
    return `<div class="testcard"><h3>${icon(t.kind === "evidence" ? t.id : "bolt", 18)} ${esc(t.title)}
      <span class="badge safety-${t.safety}" style="border-color:currentColor">${t.safety}</span><span class="badge" style="border-color:var(--line2);color:var(--muted)">${t.hunt ? "needs a hunt" : "no hunt needed"}</span></h3>
      <p class="small how"><b>How:</b> ${esc(t.how)}</p><p class="small"><b>Watch for:</b> ${esc(t.watch)}</p><p class="small muted">${dist}</p>
      ${t.kind === "obs" ? `<button class="btn small" data-mark="${t.id}">${icon("check", 16)} I saw this</button>` : `<button class="btn small" data-ev="${t.id}" data-v="yes">${icon("check", 16)} Found it</button> <button class="btn small ghost" data-ev="${t.id}" data-v="no">Not there</button>`}</div>`;
  }

  /* The results block (used by Quick Hunt, tracker and dock) */
  App.resultsHTML = function (opts) {
    opts = opts || {};
    const a = App.analysis();
    let tests = PE.nextTests(App.inv, a, 8);
    // always try to show at least one behaviour test alongside evidence tests
    const shown = tests.slice(0, opts.tests || 2);
    const firstObs = tests.find(t => t.kind === "obs");
    if (firstObs && !shown.includes(firstObs)) shown.push(firstObs);
    const top = a.most.slice(0, 3).map(r => r.ghost.id);
    const cmpIds = (top.length >= 2 ? top : a.most.concat(a.still).slice(0, 3).map(r => r.ghost.id));
    return `<div class="results" aria-live="polite">
      ${a.verdict ? `<div class="verdict" style="margin-top:12px"><b>${esc(a.verdict.text)}</b></div>` : ""}
      ${a.conflicts.map(c => `<div class="notice red" style="margin-top:10px"><b>Conflict:</b> ${esc(c)}</div>`).join("")}
      ${a.most.length ? `<h2>Most consistent <span class="n">${a.most.length}</span></h2>${a.most.map((r, i) => resultCard(r, { top: i === 0, open: i === 0 && !opts.closed })).join("")}` : ""}
      ${shown.length ? `<h2>Best next test</h2>${shown.map(testCard).join("")}` : ""}
      ${cmpIds.length >= 2 && a.alive.length > 1 && !opts.noCompare ? `<h2>Quick compare</h2>${App.compareTable(cmpIds, true)}` : ""}
      <h2>${a.most.length ? "Still possible" : "Possible"} <span class="n">${a.still.length}</span></h2>
      ${a.still.length > 8 && a.most.length ? `<details class="rcard"><summary><span class="nm">${a.still.length} other ghosts not ruled out</span><span class="spd">show</span></summary><div class="body">${a.still.map(r => resultCard(r, {})).join("")}</div></details>` : a.still.map(r => resultCard(r, {})).join("")}
      ${a.still.some(r => r.ghost.fakeOrbs) ? '<p class="small faint">The Mimic stays possible until Ghost Orbs are ruled out — it can copy any behaviour.</p>' : ""}
      <h2>Ruled out <span class="n">${a.out.length}</span></h2>
      ${a.out.length ? `<details class="rcard"><summary><span class="nm">${a.out.length} ghost${a.out.length === 1 ? "" : "s"} eliminated — tap for reasons</span><span class="spd">show</span></summary><div class="body">${a.out.map(r => resultCard(r, { out: true })).join("")}</div></details>` : '<p class="small muted">Nothing ruled out yet. Ghosts are only ruled out by a clue that is logically impossible for them — never because they "haven\'t done" something.</p>'}
    </div>`;
  };
  App.bindResults = function (el) {
    App.$$("[data-mark]", el).forEach(b => b.onclick = () => { App.snapshot(); App.inv.obs[b.dataset.mark] = "yes"; App.saveInv(); App.toast("Clue added"); });
    App.$$("[data-ev]", el).forEach(b => b.onclick = () => { App.snapshot(); App.inv.ev[b.dataset.ev] = b.dataset.v; App.saveInv(); App.toast(App.evName(b.dataset.ev) + (b.dataset.v === "yes" ? " confirmed" : " ruled out")); });
  };

  /* ---------- clue picker ---------- */
  function obsButton(o) {
    const st = App.inv.obs[o.id];
    return `<button class="obs ${st || ""}" data-obs="${o.id}" aria-pressed="${st ? "true" : "false"}" title="Tap: seen → unsure → clear">${esc(o.label)}${o.weak ? '<span class="weak">weak</span>' : ""}${o.detail ? `<span class="sub">${esc(o.detail)}</span>` : ""}<span class="st">${st === "yes" ? "✓" : st === "unsure" ? "?" : ""}</span></button>`;
  }
  function cluePicker(compact) {
    const hs = App.inv.huntSanity;
    return PD.observationCategories.map(c => {
      const list = PD.observations.filter(o => o.cat === c.id);
      const n = list.filter(o => App.inv.obs[o.id]).length;
      const extra = c.id === "hunt" ? `<div class="card" style="margin-top:8px;padding:10px 12px"><div class="row between"><b class="small">Highest average sanity a normal hunt started at</b><button class="btn small ghost" id="hsclear">${hs == null ? "not set" : "clear"}</button></div>
        <div class="sanity-in"><input type="range" min="0" max="100" step="1" id="hs" value="${hs == null ? 50 : hs}" aria-label="Hunt sanity"><b class="mono" id="hsv">${hs == null ? "—" : hs + "%"}</b></div><div class="tiny faint">${esc(PD.huntSanityNote)}</div></div>` : "";
      return `<details class="cat" ${compact ? "" : "open"}><summary>${icon(c.icon, 16)} ${esc(c.name)} ${n ? `<span class="cnt">${n}</span>` : ""}</summary><div class="obsgrid">${list.map(obsButton).join("")}</div>${extra}</details>`;
    }).join("");
  }
  function bindPicker(el) {
    App.$$("[data-obs]", el).forEach(b => b.onclick = () => {
      const id = b.dataset.obs; const cur = App.inv.obs[id];
      App.snapshot();
      if (!cur) App.inv.obs[id] = "yes"; else if (cur === "yes") App.inv.obs[id] = "unsure"; else delete App.inv.obs[id];
      App.saveInv();
    });
    const hs = App.$("#hs", el);
    if (hs) {
      hs.oninput = () => { App.$("#hsv", el).textContent = hs.value + "%"; };
      hs.onchange = () => { App.snapshot(); App.inv.huntSanity = +hs.value; App.saveInv(); };
      App.$("#hsclear", el).onclick = () => { App.snapshot(); App.inv.huntSanity = null; App.saveInv(); };
    }
  }

  /* ---------- guided decision tree ---------- */
  function guidedHTML() {
    const a = App.analysis();
    const q = PE.nextQuestion(App.inv, a);
    const log = App.inv.guidedLog || [];
    const pool = a.most.length ? a.most : a.alive;
    let body;
    if (a.verdict && a.verdict.kind === "only") body = `<div class="verdict"><b>${esc(a.verdict.text)}</b><p class="small" style="margin:6px 0 0">Double-check with its evidence, and rule out The Mimic by checking for orbs.</p></div>`;
    else if (!q) body = `<div class="notice">No further behaviour question can split the remaining ghosts (${pool.length}). Use evidence tests, or wait for another hunt. Remaining: ${pool.map(r => esc(r.ghost.name)).join(", ")}.</div>`;
    else body = `<div class="guided"><div class="tiny faint mono">QUESTION ${log.length + 1} · ${pool.length} ghosts in focus</div>
      <div class="q">${esc(q.title)}?</div><p class="small muted" style="margin:0">${esc(q.watch)}</p>
      <p class="small" style="margin:8px 0 0"><b>How to check:</b> ${esc(q.how)} <span class="safety-${q.safety}">(${q.safety}${q.hunt ? ", needs a hunt" : ""})</span></p>
      <div class="ans"><button class="btn primary" data-ga="yes">Yes</button><button class="btn" data-ga="no">No</button><button class="btn ghost" data-ga="skip">Not sure</button></div></div>`;
    return `${body}
      ${log.length ? `<details class="sec" open><summary>Your answers (${log.length})</summary><div class="body"><ol class="history">${log.map(l => `<li>${esc(l.q)} — <b>${esc(l.a)}</b></li>`).join("")}</ol></div></details>` : ""}
      <p class="small faint" style="margin-top:8px">Questions are chosen to split the ghosts that fit best so far, preferring safe tests. "No" only rules things out when the opposite is a hard rule (e.g. salt, line of sight).</p>`;
  }
  function bindGuided(el) {
    App.$$("[data-ga]", el).forEach(b => b.onclick = () => {
      const a = App.analysis(); const q = PE.nextQuestion(App.inv, a); if (!q) return;
      App.snapshot();
      const ans = b.dataset.ga; App.inv.guidedLog = (App.inv.guidedLog || []).concat({ q: q.title, a: ans === "yes" ? "Yes" : ans === "no" ? "No" : "Not sure" });
      if (ans === "yes") App.inv.obs[q.id] = "yes";
      else if (ans === "no") { const opp = PD.obsOpposites[q.id]; if (opp) App.inv.obs[opp] = "yes"; }
      App.inv.asked = (App.inv.asked || []).concat(q.id);
      App.saveInv();
    });
  }
  // inv.asked keeps a question from being asked again; it has no effect on which ghosts fit.

  /* ---------- QUICK HUNT PAGE ---------- */
  App.route(/^\/quick$/, (m, qp) => {
    const mode = qp.get("mode") || App.store.get("qhMode", "clues");
    App.store.set("qhMode", mode);
    const compact = App.store.get("qhCompact", false);
    return { title: "Quick Hunt", html: `<div id="qh" class="${compact ? "compact" : ""}"></div>`,
      mount: el => {
        const root = App.$("#qh", el);
        const draw = () => {
          const compactNow = App.store.get("qhCompact", false);
          root.className = compactNow ? "compact" : "";
          root.innerHTML = `
          <div class="qh-head"><h1><span class="pulse"></span>Quick Hunt</h1>
            <div class="qh-tools"><button class="iconbtn" id="qundo" aria-label="Undo" title="Undo">${icon("undo")}</button><button class="iconbtn" id="qreset" aria-label="New investigation" title="New investigation">${icon("reset")}</button><button class="iconbtn ${compactNow ? "on" : ""}" id="qcompact" aria-label="Compact mode" title="Compact mode">${icon("list")}</button></div></div>
          <div class="row" style="margin-bottom:10px">${difficultySelect("qdiff")}<div class="seg"><a class="btn small ghost ${mode === "clues" ? "" : ""}" style="border:0" href="#/quick?mode=clues"><span class="${mode === "clues" ? "green" : "muted"}">Clues</span></a><a class="btn small ghost" style="border:0" href="#/quick?mode=guided"><span class="${mode === "guided" ? "green" : "muted"}">Guided</span></a></div><a class="btn small" href="#/tracker">${icon("list", 16)} Evidence</a></div>
          <div class="qh-status">${statusChips()}</div>
          ${mode === "guided" ? guidedHTML() : `<p class="small muted" style="margin:0">Tap once = seen, twice = unsure, three times = clear. Unsure clues never rule a ghost out.</p>${cluePicker(compactNow)}`}
          ${App.resultsHTML({ closed: compactNow })}
          <details class="sec"><summary>Quick notes</summary><div class="body"><textarea class="notes" id="qnotes" placeholder="e.g. hunted right after lights went off in kitchen">${esc(App.inv.notes || "")}</textarea></div></details>`;
          bindDifficulty(root, "qdiff"); bindPicker(root); bindGuided(root); App.bindResults(root);
          App.$("#qundo", root).onclick = App.undo;
          App.$("#qreset", root).onclick = () => App.confirm("Start a new investigation? This clears evidence, clues and notes.", "Start new", App.resetInv);
          App.$("#qcompact", root).onclick = () => { App.store.set("qhCompact", !App.store.get("qhCompact", false)); draw(); };
          const n = App.$("#qnotes", root); n.oninput = () => { App.inv.notes = n.value; App.store.set("inv", App.inv); };
        };
        draw();
        App._qhDraw = () => { if (document.body.contains(root)) { const y = window.scrollY; draw(); window.scrollTo(0, y); } };
      } };
  });

  /* ---------- EVIDENCE TRACKER ---------- */
  App.route(/^\/tracker$/, () => ({ title: "Evidence tracker", html: `<div id="trk"></div>`,
    mount: el => {
      const root = App.$("#trk", el);
      const draw = () => {
        const n = PE.difficultyEvidence(App.inv.difficulty);
        const yesN = Object.values(App.inv.ev).filter(v => v === "yes").length;
        const a = App.analysis();
        const possibleEv = new Set(); a.alive.forEach(r => { r.ghost.ev.forEach(e => possibleEv.add(e)); if (r.ghost.fakeOrbs) possibleEv.add("orbs"); });
        root.innerHTML = `
        <div class="page-head"><div><h1>Evidence tracker</h1><p>Mark each evidence ✓ found, ✕ ruled out, or leave it unknown.</p></div>
          <div class="row"><button class="iconbtn" id="tundo" aria-label="Undo">${icon("undo")}</button><button class="btn small danger" id="treset">${icon("reset", 16)} Reset</button></div></div>
        <div class="row" style="margin-bottom:10px">${difficultySelect("tdiff")}<span class="small muted">${esc(PD.difficulties.find(d => d.id === App.inv.difficulty).note)}</span></div>
        ${n === 0 ? '<div class="notice" style="margin-bottom:10px">Zero-evidence mode: only The Mimic\'s Ghost Orbs can appear. Use <a href="#/quick">Quick Hunt</a> clues.</div>' : ""}
        <div class="evgrid">${PD.evidence.map(e => { const v = App.inv.ev[e.id]; const implied = !v && !possibleEv.has(e.id);
          return `<div class="evrow ${v || ""} ${implied ? "implied" : ""}"><span class="nm">${icon(e.id, 22)}<span>${esc(e.name)}${implied ? '<span class="tiny faint" style="display:block">no remaining ghost has it</span>' : ""}</span></span>
            <span class="tri" role="group" aria-label="${esc(e.name)}"><button class="y ${v === "yes" ? "on" : ""}" data-t="${e.id}" data-v="yes" aria-label="Found">✓</button><button class="u ${!v ? "on" : ""}" data-t="${e.id}" data-v="" aria-label="Unknown">?</button><button class="n ${v === "no" ? "on" : ""}" data-t="${e.id}" data-v="no" aria-label="Ruled out">✕</button></span></div>`; }).join("")}</div>
        <p class="small muted" style="margin-top:8px">${yesN}/${n} evidence found${yesN > n ? ' — <span class="red">more than this difficulty shows</span>' : ""}. Behaviour clues from Quick Hunt are included: <a href="#/quick">${Object.keys(App.inv.obs).length} clue(s)</a>.</p>
        ${App.resultsHTML({ tests: 3 })}`;
        bindDifficulty(root, "tdiff"); App.bindResults(root);
        App.$$("[data-t]", root).forEach(b => b.onclick = () => { App.snapshot(); if (b.dataset.v) App.inv.ev[b.dataset.t] = b.dataset.v; else delete App.inv.ev[b.dataset.t]; App.saveInv(); });
        App.$("#tundo", root).onclick = App.undo;
        App.$("#treset", root).onclick = () => App.confirm("Reset evidence, clues and notes?", "Reset", App.resetInv);
      };
      draw();
      App._trkDraw = () => { if (document.body.contains(root)) { const y = window.scrollY; draw(); window.scrollTo(0, y); } };
    } }));

  /* ---------- DESKTOP DOCK (compact Quick Hunt beside any page) ---------- */
  App.drawDock = function () {
    const d = App.$("#dock"); if (!d || !App.$(".layout").classList.contains("docked")) return;
    const y = d.scrollTop;
    d.innerHTML = `<div class="row between" style="margin-bottom:8px"><b>${icon("bolt", 16)} Quick Hunt</b><span class="row"><button class="iconbtn" id="dundo" aria-label="Undo">${icon("undo", 18)}</button><button class="iconbtn" id="dreset" aria-label="Reset">${icon("reset", 18)}</button><button class="iconbtn" id="dclose" aria-label="Close panel">${icon("x", 18)}</button></span></div>
      ${difficultySelect("ddiff")}<div class="qh-status" style="margin-top:8px">${statusChips()}</div>
      <div class="compact">${cluePicker(true)}${App.resultsHTML({ closed: true, noCompare: true, tests: 1 })}</div>`;
    bindDifficulty(d, "ddiff"); bindPicker(d); App.bindResults(d);
    App.$("#dundo", d).onclick = App.undo;
    App.$("#dreset", d).onclick = () => App.confirm("Start a new investigation?", "Start new", App.resetInv);
    App.$("#dclose", d).onclick = () => App.toggleDock(false);
    d.scrollTop = y;
  };
  App.toggleDock = function (force) {
    const l = App.$(".layout"); const on = force != null ? force : !l.classList.contains("docked");
    l.classList.toggle("docked", on); App.store.set("dock", on);
    App.$$("[data-dockbtn]").forEach(b => b.classList.toggle("on", on));
    if (on) App.drawDock();
  };

  App.on("inv", () => { App._qhDraw && App._qhDraw(); App._trkDraw && App._trkDraw(); App.drawDock(); });
})(window.App);
