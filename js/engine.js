/* =========================================================================
   engine.js — explainable rules engine (evidence + behaviour)
   No probabilities: every ghost ends up "ruled out" (with reasons),
   "most consistent" (fits every positive clue) or "still possible".
   Works in the browser (window.PE) and in Node for tests (module.exports).
   ========================================================================= */
(function (root) {
  "use strict";

  function getPD() { return root.PD; }
  function ghostById(id) { return getPD().ghosts.find(g => g.id === id); }
  function obsById(id) { return getPD().observations.find(o => o.id === id); }
  function evName(id) { const e = getPD().evidence.find(x => x.id === id); return e ? e.name : id; }

  /* All k-subsets of an array. */
  function subsets(arr, k) {
    const out = [];
    (function rec(start, cur) {
      if (cur.length === k) { out.push(cur.slice()); return; }
      for (let i = start; i < arr.length; i++) { cur.push(arr[i]); rec(i + 1, cur); cur.pop(); }
    })(0, []);
    return out;
  }

  /* ---------- EVIDENCE ----------
     ev: { emf: "yes" | "no" | undefined, ... }  n: evidence shown on this difficulty (0–3)
     Returns { possible: bool, reasons: [string] } for one ghost. */
  function evidenceCheck(g, ev, n) {
    const yes = Object.keys(ev).filter(k => ev[k] === "yes");
    const no  = Object.keys(ev).filter(k => ev[k] === "no");
    const reasons = [];
    let confirmed = yes.slice();

    if (g.fakeOrbs) {
      // The Mimic always shows orbs (its ability), even on 0 evidence.
      if (no.includes("orbs")) reasons.push("Ghost Orbs ruled out — The Mimic always shows Ghost Orbs.");
      confirmed = confirmed.filter(e => e !== "orbs");
    }
    for (const e of confirmed) if (!g.ev.includes(e)) reasons.push(evName(e) + " is not one of its evidences.");
    if (reasons.length) return { possible: false, reasons };

    if (n === 0) {
      if (confirmed.length) return { possible: false, reasons: ["Zero-evidence difficulty: it cannot show " + confirmed.map(evName).join(", ") + "."] };
      return { possible: true, reasons: [] };
    }
    if (confirmed.length > n) return { possible: false, reasons: ["More evidence confirmed (" + confirmed.length + ") than this difficulty shows (" + n + ")."] };

    // Is there a shown-subset S (size n) of its evidences that contains all
    // confirmed, contains the forced evidence, and avoids every ruled-out one?
    const options = subsets(g.ev, Math.min(n, 3)).filter(S =>
      confirmed.every(e => S.includes(e)) &&
      (!g.forced || n >= 3 || S.includes(g.forced)) &&
      S.every(e => !no.includes(e)));
    if (options.length) return { possible: true, reasons: [] };

    const blocked = g.ev.filter(e => no.includes(e));
    if (g.forced && no.includes(g.forced) && n < 3)
      return { possible: false, reasons: [evName(g.forced) + " was ruled out, but it is guaranteed (forced) evidence for this ghost on reduced-evidence difficulties."] };
    if (n >= 3) return { possible: false, reasons: [blocked.map(evName).join(", ") + " ruled out, but " + (blocked.length > 1 ? "they are" : "it is") + " one of its evidences."] };
    return { possible: false, reasons: ["Too many of its evidences ruled out (" + blocked.map(evName).join(", ") + ") for a " + n + "-evidence difficulty."] };
  }

  /* ---------- BEHAVIOUR ----------
     obs: { obsId: "yes" | "unsure" }  huntSanity: number|null */
  function behaviourCheck(g, obs, huntSanity) {
    const out = { excluded: [], confirms: [], matches: [], neutral: [], unsureMatches: [] };
    for (const id of Object.keys(obs)) {
      const o = obsById(id); if (!o) continue;
      const certain = obs[id] === "yes";
      const conf = (o.confirm || []).includes(g.id);
      const cons = (o.consistent || []).includes(g.id);
      const exc = o.exclude && o.exclude[g.id];
      if (g.fakeOrbs) { // The Mimic can copy any behaviour: never excluded by behaviour.
        if (hasPositive(o)) out.matches.push({ id, text: "could be copying another ghost's trait" });
        continue;
      }
      if (exc) {
        if (certain) out.excluded.push({ id, text: exc });
        else out.unsureMatches.push({ id, text: "(unsure) would rule it out: " + exc, negative: true });
        continue;
      }
      const why = (o.why && o.why[g.id]) || null;
      if (conf) (certain ? out.confirms : out.unsureMatches).push({ id, text: why || "defining trait" });
      else if (cons) (certain ? out.matches : out.unsureMatches).push({ id, text: why || "allowed by its rules" });
      else if (hasPositive(o) && certain) out.neutral.push({ id });
    }
    if (huntSanity != null && huntSanity !== "" && g.thrMax != null && !g.fakeOrbs) {
      const v = Number(huntSanity);
      if (v > g.thrMax) out.excluded.push({ id: "huntSanity", text: "A normal hunt started at " + v + "% average sanity, above its highest threshold (" + g.thrMax + "%)." });
      else out.matches.push({ id: "huntSanity", text: "can hunt at " + v + "% (max " + g.thrMax + "%)" });
    }
    return out;
  }
  function hasPositive(o) { return (o.confirm && o.confirm.length) || (o.consistent && o.consistent.length); }

  /* ---------- FULL ANALYSIS ---------- */
  function analyse(state) {
    const PD = getPD();
    const n = difficultyEvidence(state.difficulty);
    const obs = state.obs || {};
    const positiveIds = Object.keys(obs).filter(id => obs[id] === "yes" && obsById(id) && hasPositive(obsById(id)));
    const results = PD.ghosts.map(g => {
      const e = evidenceCheck(g, state.ev || {}, n);
      const b = behaviourCheck(g, obs, state.huntSanity);
      const excludedBy = e.reasons.map(t => ({ id: "evidence", text: t })).concat(b.excluded);
      const fitsAll = positiveIds.length > 0 && !g.fakeOrbs && positiveIds.every(id => b.confirms.some(c => c.id === id) || b.matches.some(c => c.id === id));
      const score = b.confirms.length * 3 + b.matches.filter(m => m.id !== "huntSanity").length + b.unsureMatches.filter(u => !u.negative).length * 0.5;
      return { ghost: g, excluded: excludedBy.length > 0, excludedBy, confirms: b.confirms, matches: b.matches, unsure: b.unsureMatches, neutral: b.neutral, fitsAll, score };
    });

    const alive = results.filter(r => !r.excluded);
    let most = [], still;
    if (positiveIds.length) {
      most = alive.filter(r => r.fitsAll).sort((a, b) => b.score - a.score);
      still = alive.filter(r => !r.fitsAll).sort((a, b) => b.score - a.score);
    } else {
      still = alive.slice().sort((a, b) => b.score - a.score || a.ghost.name.localeCompare(b.ghost.name));
    }
    // Mimic is always shown last in "still possible" unless evidence points to it.
    still.sort((a, b) => (a.ghost.fakeOrbs ? 1 : 0) - (b.ghost.fakeOrbs ? 1 : 0));
    const out = results.filter(r => r.excluded);

    const conflicts = [];
    const realAlive = alive.filter(r => !r.ghost.fakeOrbs);
    if (realAlive.length === 0) conflicts.push("Every ghost except possibly The Mimic is ruled out. One of your clues or evidence marks is probably wrong — try marking doubtful clues as 'unsure'.");
    if (positiveIds.length > 1 && most.length === 0 && realAlive.length > 0) conflicts.push("No single ghost explains all of your positive clues together. One clue may be misjudged, or the ghost is The Mimic.");

    let verdict = null;
    const confirmed = most.filter(r => r.confirms.length);
    if (realAlive.length === 1 && !alive.some(r => r.ghost.fakeOrbs)) verdict = { id: realAlive[0].ghost.id, kind: "only", text: "Only " + realAlive[0].ghost.name + " fits everything." };
    else if (alive.length === 1) verdict = { id: alive[0].ghost.id, kind: "only", text: "Only " + alive[0].ghost.name + " fits everything." };
    else if (confirmed.length === 1 && most.length >= 1) verdict = { id: confirmed[0].ghost.id, kind: "strong", text: confirmed[0].ghost.name + " — you saw one of its defining traits. Still rule out The Mimic (check for orbs)." };

    return { n, most, still, out, conflicts, verdict, alive, positiveIds };
  }

  function difficultyEvidence(id) {
    const d = getPD().difficulties.find(x => x.id === id);
    return d ? d.evidence : 3;
  }

  /* ---------- NEXT TEST ----------
     Ranks tests that split the remaining candidates. Safe, no-hunt tests win ties. */
  function nextTests(state, analysis, limit) {
    const PD = getPD();
    // Focus on the "most consistent" ghosts when there are any.
    const pool = (analysis.most.length ? analysis.most : analysis.alive).map(r => r.ghost).filter(g => !g.fakeOrbs);
    if (pool.length === 1) return confirmTests(state, analysis, pool[0], limit);
    const cands = pool;
    const ids = cands.map(g => g.id);
    if (cands.length <= 1) return [];
    const tests = [];
    const n = analysis.n;
    const ev = state.ev || {};

    if (n > 0) {
      const yesCount = Object.values(ev).filter(v => v === "yes").length;
      if (yesCount < n) for (const e of PD.evidence) {
        if (ev[e.id]) continue;
        const has = cands.filter(g => g.ev.includes(e.id)).map(g => g.id);
        if (!has.length || has.length === cands.length) continue;
        tests.push({ kind: "evidence", id: e.id, title: "Test for " + e.name,
          how: e.how, watch: "Whether " + e.name + " shows up.", safety: "safe", hunt: false,
          yesKeeps: has, noKeeps: n === 3 ? ids.filter(i => !has.includes(i)) : ids,
          value: Math.min(has.length, cands.length - has.length) * 1.6 + 0.5 });
      }
    }
    const opp = PD.obsOpposites || {};
    for (const o of PD.observations) {
      if (!o.test) continue;
      if ((state.obs || {})[o.id] || (state.asked || []).includes(o.id)) continue;
      const oppId = opp[o.id] || Object.keys(opp).find(k => opp[k] === o.id);
      if (oppId && (state.obs || {})[oppId]) continue;
      const pos = ids.filter(i => (o.confirm || []).includes(i) || (o.consistent || []).includes(i));
      const exc = ids.filter(i => o.exclude && o.exclude[i]);
      const confirmHit = ids.some(i => (o.confirm || []).includes(i));
      if (!pos.length && !exc.length) continue;
      if (pos.length === cands.length && !exc.length) continue;
      let value = Math.min(pos.length, cands.length - pos.length) + exc.length * 0.8 + (confirmHit ? 0.75 : 0);
      value *= o.test.safety === "safe" ? 1.5 : o.test.safety === "risky" ? 1.0 : 0.6;
      if (!o.test.hunt) value += 0.3;
      tests.push({ kind: "obs", id: o.id, title: o.label, how: o.test.how, watch: o.test.watch,
        safety: o.test.safety, hunt: o.test.hunt,
        yesKeeps: exc.length ? ids.filter(i => !exc.includes(i)) : pos, yesPoints: pos, ruledOutIfYes: exc,
        value });
    }
    tests.sort((a, b) => b.value - a.value);
    return tests.slice(0, limit || 3);
  }

  /* Only one ghost fits: suggest tests that confirm it or would rule it out. */
  function confirmTests(state, analysis, g, limit) {
    const PD = getPD(); const tests = []; const ev = state.ev || {}; const n = analysis.n;
    const others = analysis.alive.map(r => r.ghost.id).filter(i => i !== g.id);
    if (n > 0) for (const e of g.ev) if (!ev[e]) {
      const def = PD.evidence.find(x => x.id === e);
      tests.push({ kind: "evidence", id: e, title: "Confirm with " + def.name, how: def.how, watch: def.name + " appearing supports " + g.name + "; on 3-evidence difficulty its absence rules it out.", safety: "safe", hunt: false, yesKeeps: [g.id], noKeeps: others, value: 3 });
    }
    if (others.includes("mimic") || analysis.alive.some(r => r.ghost.fakeOrbs)) {
      if (!ev.orbs) tests.push({ kind: "evidence", id: "orbs", title: "Rule out The Mimic: check for Ghost Orbs", how: PD.evidence.find(x => x.id === "orbs").how, watch: g.ev.includes("orbs") ? "Orbs are also one of " + g.name + "'s evidences, so test Spirit Box/Freezing/UV against its set too." : "Orbs here would mean The Mimic, not " + g.name + ".", safety: "safe", hunt: false, yesKeeps: ["mimic"], noKeeps: [g.id], value: 2.8 });
    }
    for (const o of PD.observations) {
      if (!o.test || (state.obs || {})[o.id]) continue;
      const conf = (o.confirm || []).includes(g.id); const exc = o.exclude && o.exclude[g.id];
      if (!conf && !exc) continue;
      let value = (conf ? 2 : 1.5) * (o.test.safety === "safe" ? 1.5 : o.test.safety === "risky" ? 1 : 0.6) + (o.test.hunt ? 0 : 0.3);
      tests.push({ kind: "obs", id: o.id, title: o.label, how: o.test.how, watch: o.test.watch, safety: o.test.safety, hunt: o.test.hunt,
        yesPoints: conf ? [g.id] : [], ruledOutIfYes: exc ? [g.id] : [], yesKeeps: conf ? [g.id] : others, value });
    }
    tests.sort((a, b) => b.value - a.value);
    return tests.slice(0, limit || 3);
  }

  /* Guided flowchart: the single best observation question to ask next. */
  function nextQuestion(state, analysis) {
    // Prefer questions you can answer without risking a hunt; split power second.
    const rank = { safe: 3, risky: 1.6, dangerous: 1 };
    const t = nextTests(state, analysis, 40).filter(x => x.kind === "obs")
      .map(x => ({ x, s: x.value * (rank[x.safety] || 1) * (x.hunt ? 1 : 1.4) })).sort((a, b) => b.s - a.s);
    return t.length ? t[0].x : null;
  }

  const PE = { evidenceCheck, behaviourCheck, analyse, nextTests, nextQuestion, difficultyEvidence, ghostById, obsById, subsets };
  root.PE = PE;
  if (typeof module !== "undefined" && module.exports) module.exports = PE;
})(typeof window !== "undefined" ? window : globalThis);
