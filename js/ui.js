/* =========================================================================
   ui.js — helpers, icons, storage, investigation state, router
   ========================================================================= */
window.App = window.App || {};
(function (App) {
  "use strict";

  /* ---------- helpers ---------- */
  App.esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  App.$ = (sel, el) => (el || document).querySelector(sel);
  App.$$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));
  App.ghost = id => PD.ghosts.find(g => g.id === id);
  App.evName = id => (PD.evidence.find(e => e.id === id) || {}).name || id;
  App.evShort = id => (PD.evidence.find(e => e.id === id) || {}).short || id;

  /* ---------- storage (never throws) ---------- */
  App.store = {
    get(k, d) { try { const v = localStorage.getItem("pfg." + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("pfg." + k, JSON.stringify(v)); } catch { /* private mode */ } },
    del(k) { try { localStorage.removeItem("pfg." + k); } catch { /* private mode */ } }
  };

  /* ---------- icons (original line icons) ---------- */
  const P = {
    ghost: '<path d="M6 20V10a6 6 0 0 1 12 0v10l-2-1.5L14 20l-2-1.5L10 20l-2-1.5Z"/><circle cx="10" cy="10" r="1" fill="currentColor"/><circle cx="14" cy="10" r="1" fill="currentColor"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7Z"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    map: '<path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2Z"/><path d="M9 4v14M15 6v14"/>',
    more: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>',
    home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
    book: '<path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4Z"/><path d="M20 4h-4a2 2 0 0 0-2 2"/><path d="M20 4v14h-6"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4Z"/>',
    skull: '<path d="M12 3a8 8 0 0 0-5 14v3h10v-3a8 8 0 0 0-5-14Z"/><circle cx="9" cy="11" r="1.6"/><circle cx="15" cy="11" r="1.6"/><path d="M10 20v-2M14 20v-2"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
    chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-3"/>',
    cards: '<rect x="3" y="6" width="11" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v13"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    steps: '<ellipse cx="8" cy="7" rx="2.5" ry="4"/><ellipse cx="16" cy="13" rx="2.5" ry="4"/><path d="M7 14v3M15 20v1"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    ear: '<path d="M7 9a5 5 0 1 1 10 0c0 4-4 4-4 8a3 3 0 0 1-6 0"/><path d="M10 9a2 2 0 1 1 4 0"/>',
    hand: '<path d="M7 11V5a1.5 1.5 0 0 1 3 0v5M10 10V4a1.5 1.5 0 0 1 3 0v6M13 10V5a1.5 1.5 0 0 1 3 0v6M16 11V8a1.5 1.5 0 0 1 3 0v6a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-3l-2.5-4a1.5 1.5 0 0 1 2.5-1.6L7 14"/>',
    therm: '<path d="M10 4a2 2 0 0 1 4 0v10a4 4 0 1 1-4 0Z"/><path d="M12 9v7"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    dock: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>',
    compare: '<path d="M8 3v18M16 3v18M3 8h5M16 16h5"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14M12 17.5v.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
    flame: '<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7 1 1 2 2 3 2 0-2 0-3 0-5Z"/>',
    door: '<path d="M5 21V4h11v17M3 21h18"/><circle cx="13" cy="12" r=".8" fill="currentColor"/>',
    print: '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6Z"/>',
    /* evidence */
    emf: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M9.5 7h1M11.5 7h1M13.5 7h1M10 15h4"/>',
    sb: '<rect x="4" y="7" width="16" height="12" rx="2"/><path d="M8 7 15 3M8 13h.01M12 11v4M15 12v2"/>',
    uv: '<path d="M8 3h8l-2 7h-4Z"/><path d="M10 10v4M14 10v4"/><path d="M6 18l2-2M12 21v-3M18 18l-2-2"/>',
    gw: '<path d="M4 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4Z"/><path d="M13 7a2 2 0 0 1 2-2h5v12h-5a2 2 0 0 0-2 2"/><path d="m16 9 2 2-2 2"/>',
    dots: '<circle cx="6" cy="6" r="1.2"/><circle cx="12" cy="6" r="1.2"/><circle cx="18" cy="6" r="1.2"/><circle cx="6" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18" cy="12" r="1.2"/><circle cx="6" cy="18" r="1.2"/><circle cx="12" cy="18" r="1.2"/><circle cx="18" cy="18" r="1.2"/>',
    orbs: '<circle cx="8" cy="9" r="2.5"/><circle cx="16" cy="7" r="1.5"/><circle cx="15" cy="16" r="3"/>',
    frz: '<path d="M12 2v20M4 6l16 12M20 6 4 18"/><path d="m9 3 3 3 3-3M9 21l3-3 3 3"/>',
    /* possessions */
    ouija: '<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M7 10h.01M10 10h.01M13 10h.01M16 10h.01"/><path d="m11 13 2 0 1 2h-4Z"/>',
    mirror: '<ellipse cx="12" cy="9" rx="5" ry="6"/><path d="M12 15v6M9 21h6"/>',
    music: '<rect x="4" y="9" width="16" height="10" rx="2"/><path d="M4 9l3-4h10l3 4M12 12v4"/>',
    circle: '<circle cx="12" cy="12" r="8"/><path d="m12 4 4.7 14.5L4.4 9.5h15.2L7.3 18.5Z"/>',
    doll: '<circle cx="12" cy="6" r="3"/><path d="M12 9v7M7 12h10M9 21l3-5 3 5"/><path d="M15 4l3-2"/>',
    tarot: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="m12 8 1.5 3L12 14l-1.5-3Z"/>',
    paw: '<path d="M8 21c-1-4 0-7 2-9l1-6a1 1 0 0 1 2 0l-.5 5 1.5-4a1 1 0 0 1 2 .5L15 12l2-3a1 1 0 0 1 1.8.8L16 15c-1 3-2 4-2 6"/>'
  };
  App.icon = (name, size) => `<svg width="${size || 20}" height="${size || 20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || P.ghost}</svg>`;

  App.logo = () => `<svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#101412" stroke="#3f8f63"/><path d="M9 25V14a7 7 0 0 1 14 0v11l-2.3-1.7L18.3 25 16 23.3 13.7 25l-2.4-1.7Z" fill="none" stroke="#7fe0a3" stroke-width="2"/><circle cx="13.5" cy="14" r="1.4" fill="#7fe0a3"/><circle cx="18.5" cy="14" r="1.4" fill="#7fe0a3"/></svg>`;

  App.evChips = (ids, forced) => ids.map(e => `<span class="chip ${e === forced ? "forced" : "ev"}" title="${App.esc(App.evName(e))}${e === forced ? " (forced on reduced evidence)" : ""}">${App.icon(e, 14)}${App.esc(App.evShort(e))}</span>`).join("");
  App.badge = st => st ? `<span class="badge ${st}">${st === "verified" ? "Verified" : st === "likely" ? "Likely current" : "Unverified"}</span>` : "";
  App.srcLinks = ids => (ids || []).map(id => PD.sources[id]).filter(Boolean).map(s => `<a href="${App.esc(s.url)}" target="_blank" rel="noopener noreferrer">${App.esc(s.title)}</a> <span class="faint tiny">(checked ${App.esc(s.checked)})</span>`).join("<br>");

  /* Speed scaling for custom difficulty ghost-speed % (display only). */
  App.speedPct = () => Number(App.store.get("speedPct", 100)) || 100;
  App.sp = v => { const r = v * App.speedPct() / 100; return (Math.round(r * 100) / 100).toFixed(2).replace(/0$/, "") + " m/s"; };

  App.toast = msg => {
    let t = App.$(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 1800);
  };

  /* ---------- favourites / recent ---------- */
  App.favs = () => App.store.get("favs", []);
  App.toggleFav = id => { const f = App.favs(); const i = f.indexOf(id); i >= 0 ? f.splice(i, 1) : f.push(id); App.store.set("favs", f); return i < 0; };
  App.pushRecent = (route, title) => { let r = App.store.get("recent", []).filter(x => x.route !== route); r.unshift({ route, title }); App.store.set("recent", r.slice(0, 8)); };

  /* ---------- shared investigation state ---------- */
  const blank = () => ({ difficulty: "professional", ev: {}, obs: {}, huntSanity: null, notes: "", history: [], guidedLog: [], asked: [] });
  App.inv = Object.assign(blank(), App.store.get("inv", {}));
  App.saveInv = () => { App.store.set("inv", App.inv); App.emit("inv"); };
  App.snapshot = () => { App.inv.history.push(JSON.stringify({ ev: App.inv.ev, obs: App.inv.obs, huntSanity: App.inv.huntSanity, guidedLog: App.inv.guidedLog, asked: App.inv.asked })); if (App.inv.history.length > 50) App.inv.history.shift(); };
  App.undo = () => { const s = App.inv.history.pop(); if (!s) { App.toast("Nothing to undo"); return; } Object.assign(App.inv, JSON.parse(s)); App.saveInv(); App.toast("Undone"); };
  App.resetInv = () => { const d = App.inv.difficulty; App.inv = blank(); App.inv.difficulty = d; App.saveInv(); App.toast("New investigation"); };
  App.analysis = () => PE.analyse(App.inv);

  /* tiny event bus */
  const subs = {};
  App.on = (ev, fn) => (subs[ev] = subs[ev] || []).push(fn);
  App.emit = ev => (subs[ev] || []).forEach(fn => { try { fn(); } catch (e) { console.error(e); } });

  /* ---------- router ---------- */
  App.routes = [];
  App.route = (re, fn) => App.routes.push({ re, fn });
  App.go = h => { location.hash = h; };
  App.render = function () {
    const raw = location.hash.replace(/^#/, "") || "/";
    const [path, qs] = raw.split("?");
    const params = new URLSearchParams(qs || "");
    const main = App.$("#main");
    for (const r of App.routes) {
      const m = path.match(r.re);
      if (m) {
        let out;
        try { out = r.fn(m, params) || {}; }
        catch (e) { console.error(e); out = { html: `<div class="notice red">Something went wrong showing this page. <a href="#/">Go home</a>.</div>` }; }
        main.innerHTML = out.html || "";
        document.title = (out.title ? out.title + " · " : "") + PD.meta.appName;
        App.$$(".sidebar a[data-nav], .bottomnav a[data-nav]").forEach(a => a.classList.toggle("active", path === a.dataset.nav || (a.dataset.nav !== "/" && path.startsWith(a.dataset.nav))));
        if (out.mount) out.mount(main);
        if (out.recent) App.pushRecent("#" + raw, out.recent);
        if (!App._noScroll) window.scrollTo(0, 0);
        App._noScroll = false;
        main.focus({ preventScroll: true });
        return;
      }
    }
    main.innerHTML = `<div class="empty">Page not found. <a href="#/">Home</a></div>`;
  };

  /* ---------- sheet (bottom sheet / modal) ---------- */
  App.openSheet = (html, label) => {
    const s = App.$("#sheet"), sc = App.$("#scrim");
    s.innerHTML = `<div class="grab"></div><div class="row between"><strong>${App.esc(label || "")}</strong><button class="iconbtn" data-close aria-label="Close">${App.icon("x")}</button></div><div class="sheet-body" style="margin-top:10px">${html}</div>`;
    s.setAttribute("aria-label", label || "Panel");
    s.classList.add("open"); sc.classList.add("open"); s.focus();
    App.$("[data-close]", s).onclick = App.closeSheet;
    return s;
  };
  /* In-page confirmation (works where browser confirm() dialogs are blocked). */
  App.confirm = (msg, yesLabel, onYes) => {
    const s = App.openSheet(`<p>${App.esc(msg)}</p><div class="row"><button class="btn danger" id="cyes">${App.esc(yesLabel)}</button><button class="btn" id="cno">Cancel</button></div>`, "Are you sure?");
    App.$("#cyes", s).onclick = () => { App.closeSheet(); onYes(); };
    App.$("#cno", s).onclick = App.closeSheet;
  };
  App.closeSheet = () => { App.$("#sheet").classList.remove("open"); App.$("#scrim").classList.remove("open"); };
})(window.App);
