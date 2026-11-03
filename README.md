# Phasmo Field Guide

An unofficial, offline-capable Phasmophobia companion for **game version v0.19.1.0** (checked 2 Nov 2026).
Not affiliated with Kinetic Games.

What's inside: 30 ghosts, an evidence tracker, **Quick Hunt** (behaviour-based identification with a guided decision tree), 17 maps with cursed possession locations, cursed possession rules, equipment, hunt mechanics, a speed chart with a footstep tapper, timers and a practice quiz.

---

## Put it online for free (GitHub Pages) — no coding

1. Create a free account at **github.com** and sign in.
2. Click **+** (top right) → **New repository**. Name it `phasmo-guide`, choose **Public**, click **Create repository**.
3. On the new page click **uploading an existing file**.
4. Unzip `phasmo-field-guide-site.zip` on your computer. Open the `phasmo-field-guide` folder, select **everything inside it** and drag it into the GitHub page. Click **Commit changes**.
5. Go to **Settings → Pages**. Under *Branch*, choose **main** and **/ (root)**, then **Save**.
6. Wait 1–2 minutes. Your link appears at the top of that page, like `https://YOURNAME.github.io/phasmo-guide/`.

*Alternative:* Cloudflare Pages or Netlify — create a site and drag the unzipped folder onto their upload page.

## Use it on your devices

- **iPhone:** open your link in **Safari** → tap **Share** (square with arrow) → **Add to Home Screen** → **Add**.
- **Android:** open the link in **Chrome** → **⋮** menu → **Install app** (or *Add to Home screen*).
- **Windows / Mac:** open the link in Chrome or Edge → click the **install** icon at the right of the address bar (or just bookmark it). Press **D** to pin the Quick Hunt panel beside any page.
- **Offline:** after opening it once online, the installed app works without internet.
- **No website at all:** `phasmo-field-guide-offline.html` is a single file with everything in it. Double-click it on a computer, or save it to your phone's Files app and open it. (Settings and favourites save in that browser.)
- **Share:** send your website link to friends.

## Keyboard shortcuts (PC)

`Q` Quick Hunt · `T` evidence tracker · `G` ghosts · `M` maps · `/` search · `U` undo · `D` pin Quick Hunt panel · `Esc` close

---

## Updating after a Phasmophobia patch

All game facts live in plain data files in `site/js/data/` — no other code needs to change for normal updates.

| File | What it holds |
|---|---|
| `meta.js` | game version, last-checked date, evidence types, difficulties, **sources**, changelog |
| `ghosts.js` | every ghost: evidence, forced evidence, hunt threshold (`thrMax`), speeds, traits, tests |
| `observations.js` | Quick Hunt clues and which ghosts each clue **confirms / fits / rules out** |
| `maps.js` | maps, levels and cursed possession spots |
| `cursed.js`, `equipment.js`, `guides.js` | cursed items, equipment, mechanics text |

Steps:
1. Read the patch notes at kineticgames.co.uk/news.
2. Edit the matching file (e.g. a ghost's `speed` or `thrMax`). Keep the `src` list and `status` (`verified` / `likely` / `unverified`) honest.
3. Update `gameVersion`, `lastVerified` and add a `changelog` entry in `meta.js`.
4. Adding a ghost: copy an existing entry in `ghosts.js`, then add its id to the right clues in `observations.js`.
5. Run the checks: `node tests/engine.test.js` (validates evidence combinations, Mimic rules, every ghost against its own clues, maps).
6. Rebuild: `python3 build.py` → upload `dist/site` again. The offline cache updates automatically.

## How Quick Hunt decides (no guessing)

Each clue lists ghosts it **confirms**, ghosts it **fits**, and ghosts it **logically rules out** (with the reason). A ghost is only ruled out by a clue that is impossible for it — never because it "hasn't done" something. "Unsure" clues never rule anything out. The Mimic is never ruled out by behaviour (it copies others) — only by evidence. Evidence uses the real difficulty rules: on Nightmare/Insanity one or two evidences are hidden, forced evidence can't be hidden, and Mimic orbs always show. Conflicting clues are flagged.

## Honest limits (see the in-app "Still needs verification" list)

- No accurate overhead floor plans or location photos: no licence-free 2026 source; maps use a schematic board instead.
- Fuse box and hiding spot locations are marked *Unverified* rather than guessed.
- Ghost model images are not reproduced (copyrighted art).
- Music Box durations and some equipment tier ranges are not re-verified and are labelled.

## Project layout

```
site/            the website (open site/index.html via a local server, or deploy it)
tests/           node tests for the rules engine and data
build.py         makes icons, the offline cache, the single-file version, the ZIP and the PDF
dist/            build output
```
