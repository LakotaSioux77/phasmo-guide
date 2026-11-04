# Phasmo Field Guide

An unofficial, offline-capable Phasmophobia companion for **game version v0.19.1.0** (checked 2 Nov 2026).
Not affiliated with Kinetic Games.

What's inside: 30 ghosts, an evidence tracker, **Quick Hunt** (behaviour-based identification with a guided decision tree), 17 maps with cursed possession locations, cursed possession rules, equipment, hunt mechanics, a speed chart with a footstep tapper, timers and a practice quiz.

---

## Put it online for free (GitHub Pages) — no coding

1. Create a free account at **github.com** and sign in.
2. Click **+** (top right) → **New repository**. Name it `phasmo-guide`, choose **Public**, click **Create repository**.
3. On the new page click **uploading an existing file**.
4. On your computer, open the `phasmo-field-guide` folder (the one containing this README), select **everything inside it** and drag it into the GitHub page. Click **Commit changes**.
5. Go to **Settings → Pages**. Under *Branch*, choose **main** and **/ (root)**, then **Save**.
6. Wait 1–2 minutes. Your link appears at the top of that page: <https://LakotaSioux77.github.io/phasmo-guide/>.

*Alternative:* Cloudflare Pages or Netlify — create a site and drag the `phasmo-field-guide` folder onto their upload page.

## Use it on your devices

- **iPhone:** open your link in **Safari** → tap **Share** (square with arrow) → **Add to Home Screen** → **Add**.
- **Android:** open the link in **Chrome** → **⋮** menu → **Install app** (or *Add to Home screen*).
- **Windows / Mac:** open the link in Chrome or Edge → click the **install** icon at the right of the address bar (or just bookmark it). Press **D** to pin the Quick Hunt panel beside any page.
- **Offline:** after opening it once online, the installed app works without internet.
- **Share:** send your website link to friends.

## Download a copy from GitHub

On a phone, use the website link and install it as described above, because opening downloaded files is unreliable on phones. On a computer, you can run the guide from your own copy without internet.

1. Go to <https://github.com/LakotaSioux77/phasmo-guide>.
2. Click the green **Code** button, then **Download ZIP**.
3. Find the ZIP in your Downloads folder, right-click it, choose **Extract All**, then click **Extract**.
4. Open the extracted folder, probably named `phasmo-guide-main`.
5. Double-click **`index.html`**. It opens in your browser and works without internet.

If you use Git, you can run `git clone https://github.com/LakotaSioux77/phasmo-guide.git` instead of steps 1–4, then open `index.html` from that folder.

**Want the ghost icon?** Installing the guide from the website link gives you the ghost icon automatically. A downloaded copy can't set its own icon, but on Windows you can add it to a desktop shortcut in a few clicks:

1. Right-click `index.html`, choose **Show more options** if you see it, then **Send to** and **Desktop (create shortcut)**.
2. On your desktop, right-click the new shortcut and choose **Properties**.
3. Click **Change Icon**, then **Browse**, and select `ghost.ico` in the guide's folder. Click **Open**, **OK** and **OK**.

Keep `ghost.ico` in that folder, as the shortcut needs it to keep showing the ghost. If you move the folder, you'll need to make the shortcut again.

**Common mistakes**

- **Opening `offline.html`:** it only shows a "You're offline" message, so always use `index.html`.
- **Not extracting the ZIP first:** opening `index.html` from inside the ZIP usually breaks the guide, because the browser can't find its other files.
- **Moving only `index.html`:** it needs the rest of the folder. To get to it from your desktop, make a shortcut rather than moving the file.

**Good to know**

- **Saved settings:** favourites and settings stay in that browser on that device, and they don't carry over between devices or browsers. They may also reset if you move the folder or open a new download.
- **Updates:** a downloaded copy doesn't update, so download the ZIP again to get a newer version. The website updates itself after changes are uploaded, though an installed copy may need opening a couple of times to catch up.
- **Files you can ignore:** `tests`, `package.json` and `eslint.config.mjs` are for maintaining the guide, and the guide doesn't use them.

## Keyboard shortcuts (PC)

`Q` Quick Hunt · `T` evidence tracker · `G` ghosts · `M` maps · `/` search · `U` undo · `D` pin Quick Hunt panel · `Esc` close

---

## Updating after a Phasmophobia patch

Almost all game facts live in plain data files in `js/data/`, so normal updates don't touch the app's code. The only other files to update are `index.html` and `sw.js` (steps 4 and 6).

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
3. Update `gameVersion`, `gameVersionDate`, `lastVerified` and `appVersion`, and add an entry to `PD.changelog` in `meta.js`. Adding a ghost: copy an existing entry in `ghosts.js`, then add its id to the right clues in `observations.js`.
4. Update `index.html` by hand, as it has its own copy of some facts: the game version and ghost count in the description near the top, and the version, ghost table and map list in the `<noscript>` section (shown when JavaScript is off).
5. Check your work. If you have [Node.js](https://nodejs.org) installed, open a terminal in this folder and run `node tests/engine.test.js`. There's nothing else to install. It checks the evidence and Mimic rules, every ghost against its clues, the maps, and whether `index.html`, `sw.js` and `meta.js` agree, and it lists anything to fix. Run it again after step 6, as it also expects the new version in the `CACHE` name. It can't tell whether a fact matches the real game, so also double-click `index.html`, look at what you changed, and try a few evidence combinations in the tracker.
6. In `sw.js`, change the `CACHE` name near the top (for example `pfg-1.0.1-a376b6ae` to `pfg-1.0.2`). This tells installed copies to drop their old saved files.
7. Upload the changed files to your host again, replacing the old ones.

*Optional code check:* with Node.js installed, open a terminal in this folder and run `npm install`, then `npm run lint`. This creates a `node_modules` folder, which you should not upload.

## How Quick Hunt decides (no guessing)

Each clue lists ghosts it **confirms**, ghosts it **fits**, and ghosts it **logically rules out** (with the reason). A ghost is only ruled out by a clue that is impossible for it — never because it "hasn't done" something. "Unsure" clues never rule anything out. The Mimic is never ruled out by behaviour (it copies others) — only by evidence. Evidence uses the real difficulty rules: on Nightmare/Insanity one or two evidences are hidden, forced evidence can't be hidden, and Mimic orbs always show. Conflicting clues are flagged.

## Honest limits (see the in-app "Still needs verification" list)

- No accurate overhead floor plans or location photos: no licence-free 2026 source; maps use a schematic board instead.
- Fuse box and hiding spot locations are marked *Unverified* rather than guessed.
- Ghost model images are not reproduced (copyrighted art).
- Music Box durations and some equipment tier ranges are not re-verified and are labelled.

## Project layout

```
index.html            the page that loads everything (double-click to open, or deploy this whole folder)
offline.html          the message shown when a page isn't available offline
sw.js                 the offline cache
manifest.webmanifest  app name and icons for installing on a device
.nojekyll             tells GitHub Pages to serve the files as they are
css/app.css           all styles and theme colours
icons/                app icons
ghost.ico             optional icon for a Windows desktop shortcut (not needed by the website)
js/                   the app's code
js/data/              the game facts (see the table above)
tests/engine.test.js  checks the rules, game data and site files (not needed by the website)
eslint.config.mjs     settings for the optional code check
package.json          the packages the optional code check needs
```
