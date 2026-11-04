/* =========================================================================
   tools.js — speed chart & footstep tapper, timers, maps, practice quiz
   ========================================================================= */
(function (App) {
  "use strict";
  const { esc, icon } = App;

  /* ---------- SPEEDS ---------- */
  App.route(/^\/speeds$/, (m, q) => {
    const sort = q.get("sort") || "base";
    const list = PD.ghosts.slice().sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "max" ? b.speed.max - a.speed.max : b.speed.base - a.speed.base || b.speed.max - a.speed.max);
    const MAX = 4; const pos = v => (Math.min(v * App.speedPct() / 100, MAX) / MAX * 100).toFixed(1) + "%";
    return { title: "Speed chart", html: `
      <div class="page-head"><div><h1>Hunt speed comparison</h1><p>Bar = possible speed range · tick = base speed · <span class="amber">amber</span> = no line-of-sight speed-up. Scale 0–4 m/s; the faint line marks 1.7 m/s.</p></div>
        <div class="seg">${[["base","Base"],["max","Fastest"],["name","A–Z"]].map(([k, l]) => `<a class="btn small ghost ${sort === k ? "on" : ""}" ${sort === k ? 'aria-current="true"' : ""} style="border:0" href="#/speeds?sort=${k}"><span class="${sort === k ? "green" : "muted"}">${l}</span></a>`).join("")}</div></div>
      ${App.speedPct() !== 100 ? `<div class="notice" style="margin-bottom:10px">Speeds scaled to ${App.speedPct()}% (custom difficulty setting).</div>` : ""}
      <div class="card">${list.map(g => `<a class="speedrow" href="#/ghost/${g.id}" title="${esc(g.speed.text)}"><span class="nm">${esc(g.name)}</span>
        <span class="track ${g.speed.los === "no" ? "nolos" : ""}"><span class="ref" style="left:${pos(1.7)}"></span><span class="rng" style="left:${pos(g.speed.min)};width:calc(${pos(g.speed.max)} - ${pos(g.speed.min)} + 8px)"></span><span class="base" style="left:${pos(g.speed.base)}"></span></span>
        <span class="v">${(g.speed.base * App.speedPct() / 100).toFixed(2)}</span></a>`).join("")}</div>
      <p class="small faint" style="margin-top:6px">${esc(PD.LOS_NOTE)}</p>
      <h2 style="margin-top:18px">Footstep cadence tapper</h2>
      <div class="card"><p class="small muted">Tap along with the ghost's footsteps during a hunt. Cadence (steps per second) is <b>not</b> the same as exact speed — animations, audio and your timing all add error. Tap a hunt you know is ~1.7 m/s as a reference, then compare.</p>
        <button class="tapper" id="tap">TAP</button>
        <div class="row between" style="margin-top:10px"><div><div class="mono" id="cad" style="font-size:1.4rem;font-weight:800">— steps/s</div><div class="small muted" id="cadref"></div></div>
        <div class="row"><button class="btn small" id="setref">Save as 1.7 m/s reference</button><button class="btn small ghost" id="tclr">Clear</button></div></div></div>`,
      mount: el => {
        let taps = []; const out = App.$("#cad", el), refO = App.$("#cadref", el);
        const calc = () => { if (taps.length < 3) { out.textContent = (taps.length ? taps.length + " taps…" : "— steps/s"); return null; }
          const t = taps.slice(-10); const c = (t.length - 1) / ((t[t.length - 1] - t[0]) / 1000);
          out.textContent = c.toFixed(2) + " steps/s"; const ref = App.store.get("cadRef", null);
          refO.textContent = ref ? `≈ ${(c / ref * 1.7).toFixed(2)} m/s relative to your reference (${ref.toFixed(2)} steps/s = 1.7 m/s) — rough estimate only` : "No reference saved yet.";
          return c; };
        App.$("#tap", el).addEventListener("pointerdown", e => { e.preventDefault(); const now = performance.now(); if (taps.length && now - taps[taps.length - 1] > 2500) taps = []; taps.push(now); calc(); });
        App.$("#tclr", el).onclick = () => { taps = []; calc(); refO.textContent = ""; };
        App.$("#setref", el).onclick = () => { const c = calc(); if (c) { App.store.set("cadRef", c); App.toast("Reference saved"); calc(); } else App.toast("Tap at least 3 steps first"); };
      } };
  });

  /* ---------- TIMERS ---------- */
  const timerDefs = {
    hunt: { name: "Hunt timer", note: "Start when a hunt begins; stop when it ends. Cursed hunts run ~20 s longer.", marks: [] },
    incense: { name: "Incense timer", note: "Start right after a successful incense (not during a hunt). A hunt before a mark rules out or points to these ghosts.",
      marks: [[60, "Demon can hunt"], [90, "Most ghosts can hunt · Yurei free"], [180, "Spirit can hunt"]] },
    cooldown: { name: "Hunt cooldown", note: "Start when a hunt ends (or a crucifix burns).", marks: [[20, "Demon can hunt"], [25, "Others can hunt"]] }
  };
  App.timers = App.timers || {};
  App.route(/^\/timers$/, () => ({ title: "Timers", html: `
    <div class="page-head"><div><h1>Timers</h1><p>Large, glanceable timers for tests. They keep running if you switch pages.</p></div></div>
    <div class="grid c3">${Object.keys(timerDefs).map(k => `<div class="timer" id="tm-${k}"><b>${esc(timerDefs[k].name)}</b><div class="big" data-big>0:00</div><div class="bar"><i data-bar></i></div>
      <div class="marks">${timerDefs[k].marks.map(([s, l]) => `<span class="mk" data-mk="${s}">${s}s · ${esc(l)}</span>`).join("")}</div>
      <p class="small muted">${esc(timerDefs[k].note)}</p><div class="row"><button class="btn primary small" data-start="${k}">Start</button><button class="btn small" data-stop="${k}">Stop</button><button class="btn small ghost" data-zero="${k}">Reset</button></div></div>`).join("")}</div>
    <div class="card" style="margin-top:12px"><h3>Incense rules</h3><p class="small">During a hunt: blinds ~5 s (Moroi 7 s; Gallu 4 s enraged / 6 s weakened). Outside a hunt: 90 s without hunts (Demon 60 s, Spirit 180 s). Incensing a Gallu enrages it; a Yurei is trapped in its room for 90 s.</p></div>`,
    mount: el => {
      const fmt = s => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
      const tick = () => { if (!document.body.contains(el)) return; for (const k of Object.keys(timerDefs)) {
        const t = App.timers[k] || {}; const box = App.$("#tm-" + k, el); if (!box) continue;
        const s = t.start ? ((t.stop || Date.now()) - t.start) / 1000 : 0;
        App.$("[data-big]", box).textContent = fmt(s);
        const last = timerDefs[k].marks.length ? timerDefs[k].marks[timerDefs[k].marks.length - 1][0] : 120;
        App.$("[data-bar]", box).style.width = Math.min(100, s / last * 100) + "%";
        App.$$("[data-mk]", box).forEach(mk => mk.classList.toggle("past", s >= +mk.dataset.mk)); } requestAnimationFrame(tick); };
      tick();
      App.$$("[data-start]", el).forEach(b => b.onclick = () => { App.timers[b.dataset.start] = { start: Date.now() }; });
      App.$$("[data-stop]", el).forEach(b => b.onclick = () => { const t = App.timers[b.dataset.stop]; if (t && t.start && !t.stop) t.stop = Date.now(); });
      App.$$("[data-zero]", el).forEach(b => b.onclick = () => { App.timers[b.dataset.zero] = {}; });
    } }));

  /* ---------- MAPS ---------- */
  App.route(/^\/maps$/, () => {
    const groups = ["Small","Medium","Large"].map(s => [s, PD.maps.filter(m => m.size === s)]);
    return { title: "Maps", html: `
      <div class="page-head"><div><h1>Maps <span class="muted small">${PD.maps.length}</span></h1><p>13 locations + 4 Restricted variants. ${esc(PD.mapRules.sizes)}</p></div></div>
      ${groups.map(([s, list]) => `<h2 style="margin-top:14px">${s}</h2><div class="grid c3">${list.map(m => `<a class="gcard" href="#/map/${m.id}"><h3>${icon("map", 18)} ${esc(m.name)}</h3><div class="meta"><span>${esc(m.levels.length)} level${m.levels.length > 1 ? "s" : ""}</span><span>rooms: ${esc(m.rooms)}</span>${m.parent ? '<span class="amber">Restricted</span>' : ""}</div>${m.rework ? `<p class="small muted" style="margin:6px 0 0">${esc(m.rework)}</p>` : ""}</a>`).join("")}</div>`).join("")}` };
  });

  App.route(/^\/map\/([\w-]+)$/, (m) => {
    const mp = PD.maps.find(x => x.id === m[1]); if (!mp) return { html: '<div class="empty">Unknown map.</div>' };
    const layers = App.store.get("layers", { cursed: true, rooms: true, fuse: false, hide: false, exits: false });
    const rel = PD.maps.filter(x => x.parent === mp.id || x.id === mp.parent || (mp.parent && x.parent === mp.parent && x.id !== mp.id));
    // group possessions: level -> room -> items
    const byLevel = {};
    mp.levels.forEach(l => byLevel[l] = {});
    Object.entries(mp.cursed).forEach(([k, c]) => { (byLevel[c.floor] = byLevel[c.floor] || {}); (byLevel[c.floor][c.room] = byLevel[c.floor][c.room] || []).push(k); });
    const iconFor = k => (PD.cursed.find(c => c.id === k) || {}).icon;
    const board = mp.levels.map(l => `<section class="level"><h3>${esc(l)}</h3>${Object.entries(byLevel[l] || {}).map(([room, items]) => `<div class="room"><div class="rn"><span>${layers.rooms ? esc(room) : ""}</span></div>
      ${layers.cursed ? items.map(k => `<button class="marker" data-pos="${k}"><span class="dot">${icon(iconFor(k), 16)}</span>${esc(PD.cursedNames[k])}</button>`).join("") : ""}</div>`).join("") || '<p class="small faint">No verified markers on this level.</p>'}</section>`).join("");
    const unv = [["fuse","Fuse boxes"],["hide","Hiding spots"],["exits","Exit routes"]].filter(([k]) => layers[k]);
    return { title: mp.name, recent: mp.name, html: `
      <a class="small" href="#/maps">← All maps</a>
      <div class="page-head" style="margin-top:6px"><div><h1>${esc(mp.name)}</h1><p>${esc(mp.size)} map · ${mp.levels.length} level(s) · rooms: ${esc(mp.rooms)}${mp.rework ? " · " + esc(mp.rework) : ""}</p></div></div>
      ${rel.length ? `<div class="row" style="margin-bottom:10px">${rel.map(r => `<a class="chip ev" href="#/map/${r.id}">${esc(r.name)}</a>`).join("")}</div>` : ""}
      <div class="layers" role="toolbar" aria-label="Map layers">${[["cursed","Cursed possessions"],["rooms","Rooms"],["fuse","Fuse box"],["hide","Hiding spots"],["exits","Exit routes"]].map(([k, l]) => `<button class="fchip ${layers[k] ? "on" : ""}" data-layer="${k}">${l}</button>`).join("")}</div>
      ${unv.length ? `<div class="notice layer-note"><b>${unv.map(x => x[1]).join(", ")}: Unverified.</b> No reliable 2026 source for these on the current layout, so they are not marked rather than guessed.</div>` : ""}
      <div class="board-wrap" style="margin-top:10px" id="bw"><div class="board" id="board">${board}</div>
        <div class="zoombar"><button class="iconbtn" id="zin" aria-label="Zoom in">${icon("plus")}</button><button class="iconbtn" id="zout" aria-label="Zoom out">${icon("minus")}</button></div></div>
      <p class="small faint" style="margin-top:6px">On phones, pinch the page to zoom. Schematic board grouped by level and room — <b>not to scale and not a floor plan</b>. Accurate overhead plans aren't included because no licence-free 2026 source was available. Each possession has one fixed spot per map; only one possession spawns per contract.</p>
      <details class="sec" open><summary>All cursed possession spots</summary><div class="body"><div class="tablewrap"><table class="t"><tbody>${Object.entries(mp.cursed).map(([k, c]) => `<tr><th>${icon(iconFor(k), 16)} <a href="#/cursed/${k}">${esc(PD.cursedNames[k])}</a></th><td><b>${esc(c.room)}</b> <span class="faint small">(${esc(c.floor)})</span><br><span class="small">${esc(c.dir)}</span></td></tr>`).join("")}</tbody></table></div></div></details>
      <details class="sec" open><summary>Tips</summary><div class="body"><ul class="small">${mp.tips.map(t => `<li>${esc(t)}</li>`).join("")}<li>${esc(PD.mapRules.ghostRoom)}</li></ul></div></details>
      <details class="sec"><summary>Sources</summary><div class="body small">${App.srcLinks(mp.src)}</div></details>`,
      mount: el => {
        App.$$("[data-layer]", el).forEach(b => b.onclick = () => { layers[b.dataset.layer] = !layers[b.dataset.layer]; App.store.set("layers", layers); App._noScroll = true; App.render(); });
        App.$$("[data-pos]", el).forEach(b => b.onclick = () => { const k = b.dataset.pos, c = mp.cursed[k];
          App.openSheet(`<p><b>${esc(c.room)}</b> <span class="muted">· ${esc(c.floor)}</span></p><p><b>From the entrance:</b> ${esc(c.dir)}</p>
            <div class="notice small">Location photo not included (no licensed screenshot). Description paraphrased from: ${App.srcLinks(mp.src)}</div>
            <p style="margin-top:10px"><a class="btn small" href="#/cursed/${k}">How to use the ${esc(PD.cursedNames[k])}</a></p>`, PD.cursedNames[k] + " — " + mp.name);
          App.$$("#sheet a").forEach(a => a.addEventListener("click", App.closeSheet)); });
        // zoom: buttons + pinch (two-finger) + ctrl/trackpad wheel
        let z = 1; const small = () => window.innerWidth < 640; const board = App.$("#board", el), bw = App.$("#bw", el);
        const setZ = v => { if (small()) return; z = Math.max(.6, Math.min(2.2, v)); board.style.transform = `scale(${z})`; board.style.marginBottom = (board.offsetHeight * (z - 1)) + "px"; board.style.marginRight = (board.offsetWidth * (z - 1)) + "px"; };
        App.$("#zin", el).onclick = () => setZ(z + .2); App.$("#zout", el).onclick = () => setZ(z - .2);
        bw.addEventListener("wheel", e => { if (e.ctrlKey) { e.preventDefault(); setZ(z - e.deltaY * .01); } }, { passive: false });
        let d0 = 0, z0 = 1; const dist = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
        bw.addEventListener("touchstart", e => { if (e.touches.length === 2) { d0 = dist(e.touches); z0 = z; } }, { passive: true });
        bw.addEventListener("touchmove", e => { if (e.touches.length === 2 && d0 && !small()) { e.preventDefault(); setZ(z0 * dist(e.touches) / d0); } }, { passive: false });
        bw.addEventListener("touchend", () => { d0 = 0; });
      } };
  });

  /* ---------- PRACTICE QUIZ ---------- */
  function makeQuestion() {
    // Build a scenario from a defining (confirm) clue, or from evidence.
    const confirmObs = PD.observations.filter(o => (o.confirm || []).length);
    const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
    if (Math.random() < .6) {
      const o = confirmObs[Math.floor(Math.random() * confirmObs.length)];
      const ans = o.confirm[Math.floor(Math.random() * o.confirm.length)];
      const wrong = shuffle(PD.ghosts.filter(g => g.id !== ans && !(o.confirm || []).includes(g.id) && !(o.consistent || []).includes(g.id) && !g.fakeOrbs)).slice(0, 3).map(g => g.id);
      return { q: `During your investigation: “${o.label}.” Which ghost does this clue point to?`, ans, opts: shuffle([ans].concat(wrong)), explain: (o.why && o.why[ans]) || App.ghost(ans).strength };
    }
    const g = shuffle(PD.ghosts.filter(x => !x.fakeOrbs))[0];
    const wrong = shuffle(PD.ghosts.filter(x => x.id !== g.id && x.ev.filter(e => g.ev.includes(e)).length >= 1)).slice(0, 3).map(x => x.id);
    return { q: `Evidence found (Professional): ${g.ev.map(App.evName).join(", ")}. Which ghost is it? (assume Ghost Orbs ruled out unless listed)`, ans: g.id, opts: shuffle([g.id].concat(wrong)), explain: g.name + " is the only ghost with that evidence set." };
  }
  App.route(/^\/practice$/, () => ({ title: "Practice", html: `
    <div class="page-head"><div><h1>Practice mode</h1><p>Scenario questions generated from the same verified data as the guide.</p></div><div class="mono" id="score">0 / 0</div></div>
    <div class="card quiz" id="quiz"></div>`,
    mount: el => {
      let right = 0, total = 0;
      const next = () => { const Q = makeQuestion(); const box = App.$("#quiz", el);
        box.innerHTML = `<p><b>${esc(Q.q)}</b></p>${Q.opts.map(id => `<button class="btn opt" data-o="${id}">${esc(App.ghost(id).name)}</button>`).join("")}<div id="ex" style="margin-top:12px"></div>`;
        App.$$("[data-o]", box).forEach(b => b.onclick = () => { if (box.dataset.done === "1") return; box.dataset.done = "1"; total++;
          const ok = b.dataset.o === Q.ans; if (ok) right++; b.classList.add(ok ? "right" : "wrong"); App.$(`[data-o="${Q.ans}"]`, box).classList.add("right");
          App.$("#score", el).textContent = right + " / " + total;
          App.$("#ex", box).innerHTML = `<p class="small">${ok ? "✓ Correct. " : "✕ Not quite. "}${esc(Q.explain)}</p><button class="btn primary small" id="nx">Next question</button> <a class="btn small" href="#/ghost/${Q.ans}">Read about ${esc(App.ghost(Q.ans).name)}</a>`;
          App.$("#nx", box).onclick = () => { box.dataset.done = "0"; next(); }; }); };
      next();
    } }));
})(window.App);
