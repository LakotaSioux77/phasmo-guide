/* =========================================================================
   meta.js — game version, evidence types, difficulties, sources, changelog
   Edit this file first after every Phasmophobia patch (see README.md).
   ========================================================================= */
window.PD = window.PD || {};

PD.meta = {
  appName: "Phasmo Field Guide",
  gameVersion: "v0.19.1.0",
  gameVersionDate: "2026-10-07",
  lastVerified: "2026-11-02",
  appVersion: "1.0.1",
  note: "Unofficial fan-made companion. Not affiliated with or endorsed by Kinetic Games. Phasmophobia is a trademark of Kinetic Games."
};

/* The seven journal evidence types. `short` is used on compact chips. */
PD.evidence = [
  { id: "emf",  name: "EMF Level 5",          short: "EMF 5",  icon: "emf",
    how: "Hold an EMF Reader near ghost interactions. Only ghosts with this evidence can push it to level 5." },
  { id: "sb",   name: "Spirit Box",           short: "Box",    icon: "sb",
    how: "Turn lights off in the ghost room, turn the Spirit Box on and ask questions. Some ghosts only answer a player who is alone." },
  { id: "uv",   name: "Ultraviolet",          short: "UV",     icon: "uv",
    how: "Shine a UV light on doors, switches, windows, keyboards and salt footprints after the ghost touches them." },
  { id: "gw",   name: "Ghost Writing",        short: "Writing",icon: "gw",
    how: "Place a Ghost Writing Book in the ghost room. Any mark in the book counts." },
  { id: "dots", name: "D.O.T.S. Projector",   short: "D.O.T.S",icon: "dots",
    how: "Place a projector in the ghost room and watch the green field (in person or on a video camera)." },
  { id: "orbs", name: "Ghost Orbs",           short: "Orbs",   icon: "orbs",
    how: "Watch the ghost room through a video camera with night vision. Orbs are small drifting lights." },
  { id: "frz",  name: "Freezing Temperatures",short: "Freezing",icon: "frz",
    how: "Use a thermometer in the ghost room. Below 0 °C (32 °F) counts. Seeing your breath alone does not count." }
];

/* Difficulties. evidence = how many of the ghost's 3 evidences the journal can show.
   Speed/threshold notes are general; custom difficulty can change many values. */
PD.difficulties = [
  { id: "amateur",      name: "Amateur",       evidence: 3, setup: "5 min setup", note: "All three evidences available. Sanity drains slowly." },
  { id: "intermediate", name: "Intermediate",  evidence: 3, setup: "2 min setup", note: "All three evidences available." },
  { id: "professional", name: "Professional",  evidence: 3, setup: "No setup time", note: "All three evidences available; no setup time." },
  { id: "nightmare",    name: "Nightmare",     evidence: 2, setup: "No setup time", note: "One evidence hidden. Forced evidence (e.g. Deogen Spirit Box) is never the hidden one." },
  { id: "insanity",     name: "Insanity",      evidence: 1, setup: "No setup time", note: "Only one evidence available; it is the forced evidence for ghosts that have one." },
  { id: "apocalypse",   name: "Apocalypse",    evidence: 0, setup: "Challenge tier", note: "Zero evidence. Only The Mimic's fake Ghost Orbs can still appear." },
  { id: "custom0",      name: "Custom · 0 evidence", evidence: 0, setup: "Custom", note: "Zero evidence. Behaviour only (plus Mimic orbs)." },
  { id: "custom1",      name: "Custom · 1 evidence", evidence: 1, setup: "Custom", note: "Custom settings can also change ghost speed (shown speeds scale with the % you enter)." },
  { id: "custom2",      name: "Custom · 2 evidence", evidence: 2, setup: "Custom", note: "Custom settings can also change ghost speed." },
  { id: "custom3",      name: "Custom · 3 evidence", evidence: 3, setup: "Custom", note: "Custom settings can also change ghost speed." }
];

/* Source database. Every important fact in the data files carries one or more
   of these ids. `checked` is the date this guide last checked the source. */
PD.sources = {
  kg_v01910:  { title: "Kinetic Games — Phasmophobia v0.19.1.0 Patch Notes (Oct 7, 2026)", url: "https://kineticgames.co.uk/news/phasmophobia-v01910-patch-notes", type: "official", checked: "2026-11-02" },
  kg_v01900:  { title: "Kinetic Games — v0.19.0.0 Quality of Life Part 2 (Aug 25, 2026)", url: "https://kineticgames.co.uk/news/phasmophobia-v01900-quality-of-life-part-2", type: "official", checked: "2026-11-02" },
  kg_v01901:  { title: "Steam announcement — v0.19.0.1 Patch Notes (Sep 10, 2026)", url: "https://steamcommunity.com/games/739630/announcements/detail/712285688032134468", type: "official", checked: "2026-11-02" },
  wiki_ghost: { title: "Phasmophobia Wiki — Ghost (evidence table, strengths/weaknesses)", url: "https://phasmophobia.fandom.com/wiki/Ghost", type: "wiki", checked: "2026-11-02", caveat: "Roster on the page lists 27 ghosts; Aswang, Kormos and Deildegast verified from other sources." },
  wiki_map:   { title: "Phasmophobia Wiki — Map (17 maps; size classes; light limits)", url: "https://phasmophobia.fandom.com/wiki/Map", type: "wiki", checked: "2026-11-02" },
  kukiz:      { title: "Steam guide by Kukiz — Ghost Identification Guide (Deildegast added; updated Aug 24, 2026)", url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3635613545", type: "community", checked: "2026-11-02" },
  dtoid_aswang:{ title: "Destructoid — How to identify an Aswang (May 21, 2026)", url: "https://www.destructoid.com/how-to-identify-an-aswang-in-phasmophobia/", type: "press", checked: "2026-11-02" },
  dtoid_kormos:{ title: "Destructoid — How to identify a Kormos", url: "https://www.destructoid.com/how-to-identify-a-kormos-in-phasmophobia/", type: "press", checked: "2026-11-02" },
  gg_deild:   { title: "games.gg — How to identify a Deildegast (Jul 21, 2026)", url: "https://games.gg/phasmophobia/guides/phasmophobia-how-to-identify-a-deildegast/", type: "press", checked: "2026-11-02" },
  dtoid_deild:{ title: "Destructoid — How to identify a Deildegast", url: "https://www.destructoid.com/how-to-identify-a-deildegast-in-phasmophobia/", type: "press", checked: "2026-11-02" },
  keen_new:   { title: "KeenGamer — New ghosts guide: Kormos and Aswang", url: "https://www.keengamer.com/articles/guides/phasmophobia-new-ghosts-guide-how-to-identify-kormos-and-aswang/", type: "press", checked: "2026-11-02" },
  filib_new:  { title: "Filibuster Blog — Identifying Obambo, Dayan and Gallu (journal evidence)", url: "https://thefilibusterblog.com/guide-to-identifying-the-3-new-ghost-types-in-phasmophobia/", type: "press", checked: "2026-11-02" },
  tg_cursed:  { title: "TheGamer — All Cursed Object Locations (updated Aug 2026 for 13 Willow rework)", url: "https://www.thegamer.com/phasmophobia-all-cursed-object-locations/", type: "press", checked: "2026-11-02" },
  tg_restricted:{ title: "TheGamer — Restricted map cursed possession locations (Aug 27, 2026)", url: "https://www.thegamer.com/phasmophobia-restricted-maps-cursed-possession-locations/", type: "press", checked: "2026-11-02" },
  gg_ph_restricted:{ title: "games.gg — Point Hope Restricted cursed possession locations", url: "https://games.gg/phasmophobia/guides/phasmophobia-point-hope-restricted-all-cursed-possession-locations/", type: "press", checked: "2026-11-02" },
  vpe_restricted:{ title: "VPEsports — Restricted variant size classes", url: "https://vpesports.com/games/phasmophobia-reduces-large-maps-and-makes-ghost-clues-easier-to-read", type: "press", checked: "2026-11-02" },
  aotf_ouija: { title: "Attack of the Fanboy — Ouija Board phrases and costs", url: "https://attackofthefanboy.com/guides/all-phasmophobia-ouija-board-phrases-explained/", type: "press", checked: "2026-11-02" },
  prima_ouija:{ title: "Prima Games — Ouija Board questions guide", url: "https://primagames.com/tips/questions-to-ask-the-ouija-board-in-phasmophobia-ouija-board-questions-guide", type: "press", checked: "2026-11-02" },
  gs_ouija:   { title: "GameSpot — All Ouija Board questions and answers (Jul 2, 2026)", url: "https://tech.yahoo.com/gaming/articles/phasmophobia-ouija-board-questions-answers-121507517.html", type: "press", checked: "2026-11-02" },
  ath_paw:    { title: "AllThings.How — Monkey Paw: every wish, its penalty (updated Jun 25, 2026)", url: "https://allthings.how/phasmophobia-monkey-paw-every-wish-its-penalty-and-where-it-spawns/", type: "press", checked: "2026-11-02" },
  n13_tarot:  { title: "number13.de — Tarot card effects and odds", url: "https://en.number13.de/phasmophobia-tarot-cards-effects-and-meanings/", type: "community", checked: "2026-11-02" },
  wiki_tarot: { title: "Phasmophobia Wiki — Tarot Cards", url: "https://phasmophobia.fandom.com/wiki/Tarot_Cards", type: "wiki", checked: "2026-11-02" },
  wiki_paw:   { title: "Phasmophobia Wiki — Monkey Paw", url: "https://phasmophobia.fandom.com/wiki/Monkey_Paw", type: "wiki", checked: "2026-11-02" },
  pgg_paw:    { title: "Pro Game Guides — All Monkey Paw wishes", url: "https://progameguides.com/phasmophobia/all-monkey-paw-wishes-in-phasmophobia-and-what-they-do/", type: "press", checked: "2026-11-02" },
  training:   { title: "Long-standing mechanics documented on the community wiki before 2026 (not re-checked line by line this release)", url: "https://phasmophobia.fandom.com/wiki/Phasmophobia_Wiki", type: "wiki", checked: "2026-11-02", caveat: "Treat as 'likely current' rather than re-verified." }
};

/* App changelog — newest first. */
PD.changelog = [
  { version: "1.0.1", date: "2026-11-02", game: "v0.19.1.0",
    items: [
      "Ouija Board costs updated to the July 2026 GameSpot list: 20% for location, bone, shyness, proximity and headcount questions; 5% for the rest (older 40–50% figures removed).",
      "Monkey Paw: all 10 wishes with effects and penalties from a June 2026 guide (cross-checked with an older guide); wishes per contract by reward multiplier."
    ] },
  { version: "1.0.0", date: "2026-11-02", game: "v0.19.1.0",
    items: [
      "First release: 30 ghosts, evidence tracker, Quick Hunt engine, 17 maps (13 base + 4 Restricted) with cursed possession locations, cursed possession guide, equipment, mechanics, speed charts, timers, practice quiz.",
      "Game data checked against v0.19.1.0 (Crimson Eye event; no ghost mechanic changes listed in the patch notes)."
    ] }
];
