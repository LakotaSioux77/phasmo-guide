/* =========================================================================
   engine.test.js — checks the rules engine, the game data and the site files.
   Run from the project folder:  node tests/engine.test.js
   Needs Node.js only; nothing to install. It never changes any files.

   It finds mistakes and contradictions, but it can't know the real game: a
   wrong fact entered consistently everywhere will still pass. Always check
   facts against the patch notes.
   ========================================================================= */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(ROOT, file), "utf8");
const exists = file => fs.existsSync(path.join(ROOT, file));

/* ---------- tiny test runner: each check returns a list of problems ---------- */
let passed = 0, failed = 0;
function check(name, fn) {
  let problems;
  try { problems = fn(); } catch (err) { problems = ["Crashed: " + err.message]; }
  if (problems.length) {
    failed++;
    console.log("FAIL  " + name);
    problems.slice(0, 15).forEach(p => console.log("        - " + p));
    if (problems.length > 15) console.log("        ...and " + (problems.length - 15) + " more");
  } else {
    passed++;
    console.log("PASS  " + name);
  }
}

/* ---------- load the scripts in the same order as the page ---------- */
const html = read("index.html");
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
const sandbox = {};
sandbox.window = sandbox;
vm.createContext(sandbox);
try {
  // Everything up to the engine; the later scripts need a real browser.
  for (const file of scripts.slice(0, scripts.indexOf("js/engine.js") + 1)) {
    vm.runInContext(read(file), sandbox, { filename: file });
  }
} catch (err) {
  console.log("FAIL  The data files could not be loaded");
  console.log("        - " + err.message);
  console.log("\nStopped early: fix this first, then run the tests again.");
  process.exit(1);
}
const { PD, PE } = sandbox;

/* ---------- helpers ---------- */
const THREE = "professional"; // a 3-evidence difficulty
const mimic = PD.ghosts.find(g => g.fakeOrbs);
const normalGhosts = PD.ghosts.filter(g => !g.fakeOrbs);
const yes = ids => Object.fromEntries(ids.map(id => [id, "yes"]));
const aliveIds = state => PE.analyse(Object.assign({ difficulty: THREE, ev: {}, obs: {} }, state)).alive.map(r => r.ghost.id);
const difficultyWith = n => PD.difficulties.find(d => d.evidence === n).id;
const duplicates = list => list.filter((x, i) => list.indexOf(x) !== i);
const decode = s => s.replace(/&#x27;/g, "'").replace(/&amp;/g, "&");

const evidenceIds = new Set(PD.evidence.map(e => e.id));
const ghostIds = new Set(PD.ghosts.map(g => g.id));
const obsIds = new Set(PD.observations.map(o => o.id));
const sourceIds = new Set(Object.keys(PD.sources));
const listFiles = dir => fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? listFiles(dir + "/" + e.name) : [dir + "/" + e.name]);
const siteScripts = listFiles("js").filter(f => f.endsWith(".js"));

/* ---------- ghost data ---------- */
console.log("\nGhost data");

check("Ghost ids and names are unique", () => [
  ...duplicates(PD.ghosts.map(g => g.id)).map(id => "Duplicate id: " + id),
  ...duplicates(PD.ghosts.map(g => g.name)).map(n => "Duplicate name: " + n),
]);

check("There is exactly one Mimic", () =>
  PD.ghosts.filter(g => g.fakeOrbs).length === 1 ? [] : ["Ghosts marked fakeOrbs: " + PD.ghosts.filter(g => g.fakeOrbs).length]);

check("Every ghost has three different, valid evidences", () => PD.ghosts.flatMap(g => {
  const out = [];
  if (!Array.isArray(g.ev) || g.ev.length !== 3) return [g.id + ": needs exactly 3 evidences"];
  if (new Set(g.ev).size !== 3) out.push(g.id + ": repeats an evidence");
  g.ev.filter(e => !evidenceIds.has(e)).forEach(e => out.push(g.id + ": unknown evidence '" + e + "'"));
  return out;
}));

check("No two ghosts share the same three evidences", () => {
  const seen = {};
  return PD.ghosts.flatMap(g => {
    const key = (g.ev || []).slice().sort().join("+");
    if (seen[key]) return [g.id + " and " + seen[key] + " both have " + key];
    seen[key] = g.id;
    return [];
  });
});

check("Forced evidence is one of the ghost's own evidences", () =>
  PD.ghosts.filter(g => g.forced && !g.ev.includes(g.forced)).map(g => g.id + ": forced '" + g.forced + "' is not in its evidences"));

check("Hunt thresholds are between 0 and 100, or null", () =>
  PD.ghosts.filter(g => g.thrMax !== null && !(typeof g.thrMax === "number" && g.thrMax >= 0 && g.thrMax <= 100))
    .map(g => g.id + ": thrMax is " + g.thrMax));

check("Speeds are sensible (min <= base <= max, all above 0)", () => PD.ghosts.flatMap(g => {
  const s = g.speed || {};
  if (![s.base, s.min, s.max].every(v => typeof v === "number" && v > 0)) return [g.id + ": base, min and max must be numbers above 0"];
  if (!(s.min <= s.base && s.base <= s.max)) return [g.id + ": min " + s.min + ", base " + s.base + ", max " + s.max];
  return ["yes", "no", "partial"].includes(s.los) ? [] : [g.id + ": speed.los is '" + s.los + "'"];
}));

check("Ghost sources exist in meta.js", () => PD.ghosts.flatMap(g =>
  (g.src || []).filter(s => !sourceIds.has(s)).map(s => g.id + ": unknown source '" + s + "'")));

/* ---------- Quick Hunt clues ---------- */
console.log("\nQuick Hunt clues");

check("Clue ids are unique and clue categories are valid", () => {
  const cats = new Set(PD.observationCategories.map(c => c.id));
  return [
    ...duplicates(PD.observations.map(o => o.id)).map(id => "Duplicate clue id: " + id),
    ...PD.observations.filter(o => !cats.has(o.cat)).map(o => o.id + ": unknown category '" + o.cat + "'"),
  ];
});

check("Clues only name ghosts that exist", () => PD.observations.flatMap(o =>
  [...(o.confirm || []), ...(o.consistent || []), ...Object.keys(o.exclude || {}), ...Object.keys(o.why || {})]
    .filter(id => !ghostIds.has(id)).map(id => o.id + ": unknown ghost '" + id + "'")));

check("No clue both supports and rules out the same ghost", () => PD.observations.flatMap(o =>
  [...(o.confirm || []), ...(o.consistent || [])]
    .filter(id => o.exclude && o.exclude[id]).map(id => o.id + ": both supports and rules out " + id)));

check("Every 'rules out' entry gives a reason", () => PD.observations.flatMap(o =>
  Object.entries(o.exclude || {}).filter(([, why]) => !why || typeof why !== "string").map(([id]) => o.id + ": no reason for " + id)));

check("Clue tests have a valid safety level and instructions", () => PD.observations.filter(o => o.test).flatMap(o => [
  ...(["safe", "risky", "dangerous"].includes(o.test.safety) ? [] : [o.id + ": safety is '" + o.test.safety + "'"]),
  ...(o.test.how && o.test.watch ? [] : [o.id + ": test needs both 'how' and 'watch'"]),
]));

check("Opposite clues both exist", () => Object.entries(PD.obsOpposites).flatMap(([a, b]) =>
  [a, b].filter(id => !obsIds.has(id)).map(id => "Unknown clue in obsOpposites: " + id)));

/* ---------- evidence rules ---------- */
console.log("\nEvidence rules");

check("All ghosts are possible before anything is marked", () =>
  PD.difficulties.flatMap(d => {
    const n = aliveIds({ difficulty: d.id }).length;
    return n === PD.ghosts.length ? [] : [d.id + ": only " + n + " ghosts possible"];
  }));

check("A ghost's three evidences identify that ghost", () => PD.ghosts.flatMap(g => {
  const alive = aliveIds({ ev: yes(g.ev) });
  const out = [];
  if (!alive.includes(g.id)) out.push(g.id + ": ruled out by its own evidence");
  alive.filter(id => id !== g.id && id !== mimic.id).forEach(id => out.push(g.id + ": " + id + " also stays possible"));
  // Orbs can be the Mimic's fake orbs, so the Mimic stays possible only if the rest are its real evidences.
  if (g !== mimic && alive.includes(mimic.id) !== g.ev.filter(e => e !== "orbs").every(e => mimic.ev.includes(e))) {
    out.push(g.id + ": wrong answer about whether The Mimic is still possible");
  }
  return out;
}));

check("Ruling out a ghost's evidence removes it (3-evidence difficulty)", () => PD.ghosts.flatMap(g =>
  g.ev.filter(e => aliveIds({ ev: { [e]: "no" } }).includes(g.id)).map(e => g.id + ": still possible with " + e + " ruled out")));

check("Reduced-evidence difficulties follow the forced-evidence rule", () => {
  const out = [];
  for (const n of [1, 2]) {
    const difficulty = difficultyWith(n);
    for (const g of normalGhosts) {
      for (const shown of PE.subsets(g.ev, n)) {
        const expected = !g.forced || shown.includes(g.forced);
        if (aliveIds({ difficulty, ev: yes(shown) }).includes(g.id) !== expected) {
          out.push(g.id + " on " + n + "-evidence showing " + shown.join("+") + ": should be " + (expected ? "possible" : "ruled out"));
        }
      }
      if (g.forced && aliveIds({ difficulty, ev: { [g.forced]: "no" } }).includes(g.id)) {
        out.push(g.id + " on " + n + "-evidence: still possible with its forced evidence ruled out");
      }
      if (n === 1 && aliveIds({ difficulty, ev: yes(g.ev.slice(0, 2)) }).includes(g.id)) {
        out.push(g.id + " on 1-evidence: still possible with 2 evidences confirmed");
      }
    }
  }
  return out;
});

check("Zero-evidence difficulties: any real evidence rules a ghost out", () => {
  const difficulty = difficultyWith(0);
  return normalGhosts.flatMap(g => g.ev.filter(e => aliveIds({ difficulty, ev: { [e]: "yes" } }).includes(g.id))
    .map(e => g.id + ": still possible with " + e + " on zero evidence"));
});

check("Contradictory evidence is flagged as a conflict", () => {
  const all = PD.evidence.map(e => e.id);
  return PE.analyse({ difficulty: THREE, ev: yes(all), obs: {} }).conflicts.length ? [] : ["All 7 evidences confirmed, but no conflict was shown"];
});

check("A single remaining ghost gets a verdict", () => normalGhosts.flatMap(g => {
  const r = PE.analyse({ difficulty: THREE, ev: yes(g.ev), obs: {} });
  if (r.alive.length !== 1) return []; // The Mimic is still possible for this one
  return r.verdict && r.verdict.id === g.id ? [] : [g.id + ": no 'only this ghost' verdict"];
}));

/* ---------- The Mimic ---------- */
console.log("\nThe Mimic");

check("Orbs are never one of its real evidences", () => mimic.ev.includes("orbs") ? [mimic.id + " lists orbs in ev"] : []);

check("Its evidence plus orbs leaves only The Mimic", () => {
  const alive = aliveIds({ ev: yes([...mimic.ev, "orbs"]) });
  return alive.length === 1 && alive[0] === mimic.id ? [] : ["Possible: " + alive.join(", ")];
});

check("Ruling out orbs rules it out, on every difficulty", () => PD.difficulties
  .filter(d => aliveIds({ difficulty: d.id, ev: { orbs: "no" } }).includes(mimic.id)).map(d => "Still possible on " + d.id));

check("Orbs keep it possible on zero evidence, and rule out everyone else", () => {
  const alive = aliveIds({ difficulty: difficultyWith(0), ev: { orbs: "yes" } });
  return alive.length === 1 && alive[0] === mimic.id ? [] : ["Possible: " + alive.join(", ")];
});

check("No clue or hunt sanity can rule it out", () => [
  ...PD.observations.filter(o => !aliveIds({ obs: { [o.id]: "yes" } }).includes(mimic.id)).map(o => "Ruled out by clue: " + o.id),
  ...(aliveIds({ huntSanity: 100 }).includes(mimic.id) ? [] : ["Ruled out by hunt sanity"]),
]);

check("The engine ignores a clue that tries to rule it out", () => {
  // No real clue does this today, so add a temporary one to exercise the rule.
  const id = "__test_clue";
  PD.observations.push({ id, cat: "hunt", label: "Test", consistent: [], exclude: { [mimic.id]: "Test" } });
  try {
    return aliveIds({ obs: { [id]: "yes" } }).includes(mimic.id) ? [] : ["The Mimic was ruled out by behaviour"];
  } finally {
    PD.observations.pop();
  }
});

/* ---------- behaviour rules ---------- */
console.log("\nBehaviour rules");

check("A seen clue rules out exactly the ghosts it lists", () => PD.observations.flatMap(o => {
  const alive = new Set(aliveIds({ obs: { [o.id]: "yes" } }));
  const listed = o.exclude || {};
  return normalGhosts.filter(g => alive.has(g.id) === Boolean(listed[g.id]))
    .map(g => o.id + ": wrong result for " + g.id);
}));

check("Unsure clues never rule anything out", () => {
  const obs = Object.fromEntries(PD.observations.map(o => [o.id, "unsure"]));
  const n = aliveIds({ obs }).length;
  return n === PD.ghosts.length ? [] : ["Only " + n + " ghosts possible with every clue unsure"];
});

check("Each ghost survives all the clues that define it", () => normalGhosts.flatMap(g => {
  const own = PD.observations.filter(o => (o.confirm || []).includes(g.id)).map(o => o.id);
  if (!own.length) return [];
  const r = PE.analyse({ difficulty: THREE, ev: {}, obs: yes(own) });
  return r.most.some(x => x.ghost.id === g.id) ? [] : [g.id + ": doesn't fit its own defining clues (" + own.join(", ") + ")"];
}));

check("Hunt sanity uses each ghost's threshold", () => normalGhosts.flatMap(g => {
  const out = [];
  if (g.thrMax === null) {
    if (!aliveIds({ huntSanity: 100 }).includes(g.id)) out.push(g.id + ": no threshold, but hunt sanity ruled it out");
    return out;
  }
  if (!aliveIds({ huntSanity: g.thrMax }).includes(g.id)) out.push(g.id + ": ruled out at its own threshold");
  if (g.thrMax < 100 && aliveIds({ huntSanity: g.thrMax + 1 }).includes(g.id)) out.push(g.id + ": still possible above its threshold");
  return out;
}));

check("Guided mode runs to the end without repeating a question", () => {
  const out = [];
  const state = { difficulty: THREE, ev: {}, obs: {}, asked: [] };
  const seen = new Set();
  for (let i = 0; i <= PD.observations.length; i++) {
    const q = PE.nextQuestion(state, PE.analyse(state));
    if (!q) return out;
    if (seen.has(q.id)) return ["Asked twice: " + q.id];
    seen.add(q.id);
    state.asked.push(q.id);
  }
  return ["Never ran out of questions"];
});

check("Next-test advice works for every ghost", () => PD.ghosts.flatMap(g => {
  const state = { difficulty: THREE, ev: yes(g.ev.slice(0, 2)), obs: {} };
  const tests = PE.nextTests(state, PE.analyse(state), 3);
  return tests.filter(t => !t.title || !t.how).map(t => g.id + ": incomplete test '" + t.id + "'");
}));

/* ---------- maps and cursed possessions ---------- */
console.log("\nMaps and cursed possessions");

const cursedIds = PD.cursed.map(c => c.id);

check("Cursed possession lists match", () => {
  const names = Object.keys(PD.cursedNames);
  return [
    ...cursedIds.filter(id => !names.includes(id)).map(id => id + ": missing from cursedNames"),
    ...names.filter(id => !cursedIds.includes(id)).map(id => id + ": in cursedNames but not in cursed.js"),
  ];
});

check("Map ids and names are unique", () => [
  ...duplicates(PD.maps.map(m => m.id)).map(id => "Duplicate map id: " + id),
  ...duplicates(PD.maps.map(m => m.name)).map(n => "Duplicate map name: " + n),
]);

check("Every map has its levels and all cursed possessions", () => PD.maps.flatMap(m => {
  if (!Array.isArray(m.levels) || !m.levels.length) return [m.id + ": has no levels"];
  return [
    ...cursedIds.filter(id => !m.cursed || !m.cursed[id]).map(id => m.id + ": missing " + id),
    ...Object.keys(m.cursed || {}).filter(id => !cursedIds.includes(id)).map(id => m.id + ": unknown possession '" + id + "'"),
  ];
}));

check("Cursed possession spots are complete and on a real level", () => PD.maps.flatMap(m =>
  Object.entries(m.cursed || {}).flatMap(([id, spot]) => [
    ...(m.levels.includes(spot.floor) ? [] : [m.id + "/" + id + ": level '" + spot.floor + "' isn't in this map's levels"]),
    ...(spot.room && spot.dir ? [] : [m.id + "/" + id + ": needs a room and directions"]),
  ])));

check("Restricted maps point to a real parent map", () => {
  const ids = new Set(PD.maps.map(m => m.id));
  return PD.maps.filter(m => m.parent && !ids.has(m.parent)).map(m => m.id + ": unknown parent '" + m.parent + "'");
});

check("Map sources exist in meta.js", () => PD.maps.flatMap(m =>
  (m.src || []).filter(s => !sourceIds.has(s)).map(s => m.id + ": unknown source '" + s + "'")));

/* ---------- version details and site files ---------- */
console.log("\nVersion details and site files");

check("Dates in meta.js are real YYYY-MM-DD dates", () => ["gameVersionDate", "lastVerified"]
  .filter(k => !/^\d{4}-\d{2}-\d{2}$/.test(PD.meta[k]) || isNaN(Date.parse(PD.meta[k])))
  .map(k => k + " is '" + PD.meta[k] + "'"));

check("The newest changelog entry matches meta.js", () => {
  const latest = PD.changelog[0] || {};
  return [
    ...(latest.version === PD.meta.appVersion ? [] : ["Changelog says " + latest.version + ", appVersion says " + PD.meta.appVersion]),
    ...(latest.game === PD.meta.gameVersion ? [] : ["Changelog says " + latest.game + ", gameVersion says " + PD.meta.gameVersion]),
  ];
});

const noscript = (html.match(/<noscript>([\s\S]*?)<\/noscript>/) || [])[1] || "";

check("index.html description matches the data", () => {
  const d = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  return [
    ...(d.includes(PD.meta.gameVersion) ? [] : ["Doesn't mention " + PD.meta.gameVersion]),
    ...(d.includes("all " + PD.ghosts.length + " ghosts") ? [] : ["Should say 'all " + PD.ghosts.length + " ghosts'"]),
    ...(d.includes("all " + PD.maps.length + " maps") ? [] : ["Should say 'all " + PD.maps.length + " maps'"]),
  ];
});

check("index.html <noscript> ghost table matches ghosts.js", () => {
  const rows = [...noscript.matchAll(/<tr><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><\/tr>/g)]
    .map(m => m.slice(1).map(decode));
  const evName = id => PD.evidence.find(e => e.id === id).name;
  const out = [];
  if (!noscript.includes(PD.meta.gameVersion)) out.push("Doesn't mention " + PD.meta.gameVersion);
  for (const g of PD.ghosts) {
    const row = rows.find(r => r[0] === g.name);
    if (!row) { out.push(g.name + ": missing from the table"); continue; }
    const listed = row[1].split(", ").sort().join("|");
    if (listed !== g.ev.map(evName).sort().join("|")) out.push(g.name + ": table says " + row[1]);
    if (row[2] !== g.huntThr) out.push(g.name + ": table says hunt sanity '" + row[2] + "', ghosts.js says '" + g.huntThr + "'");
    if (row[3] !== g.speed.base + " m/s") out.push(g.name + ": table says speed " + row[3] + ", ghosts.js says " + g.speed.base + " m/s");
  }
  rows.filter(r => !PD.ghosts.some(g => g.name === r[0])).forEach(r => out.push(r[0] + ": in the table but not in ghosts.js"));
  return out;
});

check("index.html <noscript> map list matches maps.js", () => {
  const list = decode((noscript.match(/Maps covered: (.*?)\.<\/p>/) || [])[1] || "").split(", ");
  return [
    ...PD.maps.filter(m => !list.includes(m.name)).map(m => m.name + ": missing from the list"),
    ...list.filter(n => !PD.maps.some(m => m.name === n)).map(n => n + ": in the list but not in maps.js"),
  ];
});

check("Files named in index.html exist", () => {
  const refs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m => m[1]).filter(r => !/^[a-z]+:/i.test(r));
  return refs.filter(r => !exists(r)).map(r => "Missing: " + r);
});

const sw = read("sw.js");
const swFiles = JSON.parse((sw.match(/const FILES = (\[[\s\S]*?\]);/) || [])[1] || "[]");

check("The offline cache is named after the current version", () => {
  const name = (sw.match(/const CACHE = "([^"]+)"/) || [])[1] || "";
  return name.includes(PD.meta.appVersion) ? [] : ["CACHE is '" + name + "', but appVersion is " + PD.meta.appVersion + ". Update the name in sw.js"];
});

check("The offline cache lists real files and everything the site needs", () => {
  const needed = ["index.html", "offline.html", "manifest.webmanifest", ...listFiles("js"), ...listFiles("css"), ...listFiles("icons")];
  return [
    ...swFiles.filter(f => f !== "./" && !exists(f)).map(f => "Listed but missing: " + f),
    ...needed.filter(f => !swFiles.includes(f)).map(f => "Not in the sw.js FILES list, so it won't work offline: " + f),
  ];
});

check("App icons named in the manifest exist", () => JSON.parse(read("manifest.webmanifest")).icons
  .filter(i => !exists(i.src)).map(i => "Missing: " + i.src));

check("Every JavaScript file is free of syntax errors", () => [...siteScripts, "sw.js"].flatMap(file => {
  try { new vm.Script(read(file), { filename: file }); return []; }
  catch (err) { return [file + ": " + err.message]; }
}));

check("Every script file in js/ is loaded by index.html", () =>
  siteScripts.filter(f => !scripts.includes(f)).map(f => "Not loaded: " + f));

/* ---------- summary ---------- */
console.log("\n" + passed + " passed, " + failed + " failed");
if (failed) console.log("Fix the items marked FAIL, then run the tests again.");
process.exit(failed ? 1 : 0);
