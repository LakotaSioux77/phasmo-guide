/* =========================================================================
   app.js — boot: navigation shell, keyboard shortcuts, preferences,
   offline service worker registration
   ========================================================================= */
(function (App) {
  "use strict";
  const { icon, esc } = App;

  App.applyPrefs = () => {
    const r = document.documentElement;
    r.dataset.theme = App.store.get("theme", "dark");
    r.dataset.contrast = App.store.get("contrast", "normal");
    r.dataset.size = App.store.get("size", "normal");
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = r.dataset.theme === "light" ? "#f3f5f4" : "#0b0d0c";
  };

  const nav = [
    ["Investigate", [["/quick","bolt","Quick Hunt","Q"],["/tracker","list","Evidence tracker","T"],["/ghosts","ghost","Ghosts","G"],["/compare","compare","Compare",""],["/speeds","chart","Speed chart",""],["/timers","timer","Timers",""]]],
    ["Reference", [["/maps","map","Maps","M"],["/cursed","cards","Cursed objects",""],["/equipment","wrench","Equipment",""],["/mechanics","skull","Hunt mechanics",""],["/guides","book","Advanced guides",""],["/models","eye","Ghost models",""],["/practice","quiz","Practice",""]]],
    ["App", [["/settings","gear","Settings",""],["/about","info","Sources & changelog",""]]]
  ];

  function shell() {
    document.body.insertAdjacentHTML("afterbegin", `
      <a href="#main" class="sr">Skip to content</a>
      <header class="topbar">
        <a class="brand" href="#/">${App.logo()}<span>${esc(PD.meta.appName)}</span></a><span class="vchip" title="Game version this guide was checked against">${esc(PD.meta.gameVersion)}</span>
        <span class="spacer"></span>
        <button class="iconbtn" id="searchbtn" aria-label="Search (/)" title="Search ( / )">${icon("search")}</button>
        <button class="iconbtn" id="dockbtn" data-dockbtn aria-label="Pin Quick Hunt panel (D)" title="Pin Quick Hunt beside pages ( D )" style="display:none">${icon("dock")}</button>
      </header>
      <div class="layout">
        <nav class="sidebar" aria-label="Main">
          <a class="qhside" href="#/quick" data-nav="/quick">${icon("bolt", 18)} QUICK HUNT <kbd>Q</kbd></a>
          <a href="#/" data-nav="/">${icon("home", 18)} Home</a>
          ${nav.map(([g, items]) => `<div class="grp">${g}</div>` + items.filter(i => i[0] !== "/quick").map(([h, ic, l, k]) => `<a href="#${h}" data-nav="${h}">${icon(ic, 18)} <span style="flex:1">${l}</span>${k ? `<kbd>${k}</kbd>` : ""}</a>`).join("")).join("")}
          <p class="tiny faint" style="margin:16px 12px">Keys: <kbd>/</kbd> search · <kbd>D</kbd> pin panel · <kbd>U</kbd> undo · <kbd>Esc</kbd> close</p>
        </nav>
        <main id="main" tabindex="-1"><div class="loading">Loading…</div></main>
        <aside class="dock" id="dock" aria-label="Quick Hunt panel"></aside>
      </div>
      <nav class="bottomnav" aria-label="Main">
        <a href="#/ghosts" data-nav="/ghosts">${icon("ghost", 22)}<span>Ghosts</span></a>
        <a href="#/tracker" data-nav="/tracker">${icon("list", 22)}<span>Evidence</span></a>
        <a href="#/quick" class="qh" data-nav="/quick" aria-label="Quick Hunt"><span class="qhbtn">${icon("bolt", 28)}</span><span class="lbl">Quick Hunt</span></a>
        <a href="#/maps" data-nav="/maps">${icon("map", 22)}<span>Maps</span></a>
        <a href="#more" id="morebtn">${icon("more", 22)}<span>More</span></a>
      </nav>
      <div class="scrim" id="scrim"></div><div class="sheet" id="sheet" role="dialog" aria-modal="true" tabindex="-1"></div>`);
    App.$("#scrim").onclick = App.closeSheet;
    App.$("#searchbtn").onclick = App.openSearch;
    App.$("#morebtn").onclick = e => { e.preventDefault(); openMore(); };
    const db = App.$("#dockbtn");
    const mq = window.matchMedia("(min-width: 960px)");
    const dockVis = () => { db.style.display = mq.matches ? "" : "none"; if (!mq.matches) App.$(".layout").classList.remove("docked"); else if (App.store.get("dock", false)) App.toggleDock(true); };
    mq.addEventListener ? mq.addEventListener("change", dockVis) : mq.addListener(dockVis); dockVis();
    db.onclick = () => App.toggleDock();
  }

  function openMore() {
    const items = nav.flatMap(g => g[1]).filter(i => !["/quick","/tracker","/ghosts","/maps"].includes(i[0]));
    const recent = App.store.get("recent", []);
    const s = App.openSheet(`<div class="morelist">${[["/","home","Home"]].concat(items).map(([h, ic, l]) => `<a href="#${h}">${icon(ic, 22)} ${l}</a>`).join("")}</div>
      ${recent.length ? `<p class="small muted" style="margin-top:12px">Recently viewed</p><div class="mini-list">${recent.map(r => `<a class="chip" href="${esc(r.route)}">${esc(r.title)}</a>`).join("")}</div>` : ""}`, "More");
    App.$$("a", s).forEach(a => a.addEventListener("click", App.closeSheet));
  }

  function keys(e) {
    const t = e.target; if (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || e.metaKey || e.ctrlKey || e.altKey) { if (e.key === "Escape") App.closeSheet(); return; }
    const k = e.key.toLowerCase();
    if (k === "escape") App.closeSheet();
    else if (k === "/") { e.preventDefault(); App.openSearch(); }
    else if (k === "q") App.go("/quick");
    else if (k === "t") App.go("/tracker");
    else if (k === "g") App.go("/ghosts");
    else if (k === "m") App.go("/maps");
    else if (k === "u") App.undo();
    else if (k === "d" && window.matchMedia("(min-width: 960px)").matches) App.toggleDock();
  }

  function boot() {
    if (!window.PD || !window.PE) { document.body.innerHTML = '<p style="padding:20px">The guide data failed to load. Please reload the page.</p>'; return; }
    App.applyPrefs();
    shell();
    window.addEventListener("hashchange", App.render);
    document.addEventListener("keydown", keys);
    App.render();
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol) && !window.PFG_STANDALONE) {
      navigator.serviceWorker.register("sw.js").catch(err => console.warn("Offline cache unavailable:", err));
    }
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
})(window.App);
