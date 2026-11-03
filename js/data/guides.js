/* =========================================================================
   guides.js — Hunt mechanics, no-evidence masterclass, expert guides
   Each section: { id, title, status, src, items: [ [heading, text], ... ] }
   ========================================================================= */
window.PD = window.PD || {};

PD.mechanics = [
{ id: "sanity", title: "Sanity", status: "likely", src: ["training","kukiz"], items: [
  ["Starting sanity", "Everyone starts at 100%. The truck monitor shows each player and the team average."],
  ["Average vs. personal", "Most hunt checks use the TEAM AVERAGE. Banshee uses its target's sanity instead."],
  ["Passive drain", "Sanity drains while you are inside the investigation area in the dark; light (lit room or a lit firelight) stops or slows it. Drain speed depends on difficulty and map size."],
  ["Events", "A ghost event that touches you drains 10% (Oni: 20%; Banshee singing event on its target: 15%)."],
  ["Ghost abilities", "Jinn drains 25%; Yurei door slam drains 15% nearby; Phantom drains 0.5%/s in heartbeat range; Moroi curse doubles drain; Poltergeist explosion drains 2% per object."],
  ["Restoring", "Sanity medication restores sanity. The Sun tarot card sets you to 100%; the Moon to 0%."]
]},
{ id: "hunts", title: "Hunts", status: "likely", src: ["kukiz","training"], items: [
  ["Thresholds", "Most ghosts can start a normal hunt at 50% average sanity. Early hunters: Demon 70% (any with ability), Thaye 75% young, Yokai 80% when talked to, Kormos 70% if sprinting nearby, Dayan/Obambo/Raiju 65%, Onryo/Mare/Gallu 60%. Late: Deogen 40%, Shade 35%, Thaye 15% old, Obambo 10% calm."],
  ["Warning signs", "Lights and electronics flicker within 10 m (15 m for Raiju), the exit doors lock, and you hear the ghost's hunting vocal. Each contract the ghost uses the same hunting sound every hunt — learn it to tell hunts from events."],
  ["Grace period", "A few seconds at the start of a hunt where the ghost cannot kill. Cursed hunts have only 1 s. An Aswang that ended its last hunt on your hiding spot can move toward you during the grace period."],
  ["Duration", "Depends on map size and difficulty. Cursed hunts are ~20 s longer. Obambo hunts that start while Aggressive are 20% shorter."],
  ["Cooldown", "After a hunt ends (or a crucifix burns) a ghost must wait 25 s before another hunt (Demon 20 s)."],
  ["Cursed hunts", "Forced by cursed possessions. They ignore sanity and cooldowns."]
]},
{ id: "detection", title: "Detection, line of sight & hiding", status: "likely", src: ["kukiz","wiki_ghost","training"], items: [
  ["What reveals you", "Being seen, your voice (voice chat), and active electronics you hold. Yokai only hears voice/electronics within ~2.5 m in hunts. Kormos is nearly blind but hears movement up to 30 m."],
  ["Line-of-sight speed-up", "Most ghosts accelerate the longer they keep seeing you (up to ~1.65× base). Break line of sight around corners and doors. No LOS speed-up: Deogen, Hantu, Revenant, Thaye, Deildegast. Aswang gains it 1.5× faster."],
  ["Heartbeat", "You hear your heartbeat when within ~10 m and in the ghost's view (ignoring furniture) — not exactly real line of sight."],
  ["Hiding", "Official hiding spots (closets, lockers) are safest. Turn off held electronics and stay silent. The ghost may check hiding spots it saw you enter. You cannot hide from a Deogen. An Aswang cannot kill you in an official hiding spot."],
  ["Doors", "During hunts ghosts can push doors; outside hunts only a Yurei can move the main exit door."]
]},
{ id: "protection", title: "Incense & crucifix", status: "verified", src: ["kukiz"], items: [
  ["Incense during a hunt", "Blinds the ghost for about 5 s (Moroi 7 s, Gallu 4 s Enraged / 6 s Weakened)."],
  ["Incense outside a hunt", "No hunt for 90 s (Demon 60 s, Spirit 180 s). Yurei is trapped in its room for 90 s. Incensing a Gallu enrages it."],
  ["Crucifix", "Prevents hunts starting in range: Tier 1 3 m, Tier 2 4 m, Tier 3 5 m (×1.5 vs Demon; −2 m Enraged Gallu, +1 m Weakened Gallu). Onryo: a lit flame blocks first."]
]},
{ id: "roaming", title: "Ghost room & roaming", status: "verified", src: ["wiki_ghost"], items: [
  ["Favourite room", "The ghost spawns in a room that is usually its favourite and keeps returning to it. Some ghosts change rooms; Goryo never does."],
  ["Roams", "Short roams up to 3 m, long roams up to 12 m. The long-roam share is 10/20/30% for Low/Medium/High roaming settings. Long roams start only from the favourite room (except Mare and Banshee)."],
  ["Activation", "The ghost becomes active when the exit door is first opened. Orbs can be seen before that."]
]},
{ id: "difficulty", title: "How difficulty changes things", status: "likely", src: ["training","kg_v01900"], items: [
  ["Evidence", "Amateur–Professional: 3 evidences. Nightmare: 2. Insanity: 1. Apocalypse/0-evidence custom: none (Mimic orbs still appear)."],
  ["Forced evidence", "On reduced evidence the hidden evidence is never: Deogen Spirit Box, Goryo D.O.T.S., Hantu Freezing, Moroi Spirit Box, Obake UV."],
  ["Setup & sanity", "Higher difficulties remove setup time and drain sanity faster; hunts last longer."],
  ["Custom", "Custom difficulty lets you change ghost speed, player speed, evidence count, sanity settings and more. Since v0.19.0.0 you can also choose the ghost type. A multiplier of 0 gives no progression."]
]}
];

PD.masterclass = [
  ["1 · Hunt speed", "Listen before it sees anyone: 1.0 (Revenant searching / old Thaye), ~1.4–1.55 (Calm Obambo, Weakened Gallu, Twins slow, Moroi high sanity, Aswang, warm Hantu), 1.7 (most ghosts), very fast from the start (Deildegast, young Thaye, cold Hantu, Deogen far)."],
  ["2 · Footstep rhythm", "Footsteps are a rhythm, not a speedometer — animation and audio vary. Compare against a ghost you know is 1.7 m/s. Use the cadence tapper on the Speed page to compare hunts."],
  ["3 · Line of sight", "Loop in a circle with clear sight. Speeding up = normal LOS ghost. Flat speed = Deogen, Hantu, Revenant, Thaye, Deildegast (or Dayan within 10 m, Jinn/Raiju during fixed boosts, Kormos if you are still)."],
  ["4 · Hunt timing", "Write down the average sanity at every hunt. A hunt above 50% excludes many ghosts; above 70% leaves only Demon, Onryo, Thaye, Yokai, Banshee and the Mimic."],
  ["5 · Blinking", "Oni and Deogen are visible more; Phantom barely. Obake swaps model for one blink."],
  ["6 · Cooldowns & incense", "Time incense: hunt before 90 s = Demon; before 180 s = not Spirit. Hunt within 25 s of the last = Demon."],
  ["7 · Ghost room movement", "Goryo never changes rooms; Yurei can't leave its room for 90 s after incense."],
  ["8 · Environment", "Breaker on by the ghost → not Hantu; breaker off by the ghost → not Jinn; light on → not Mare; fire lit → not Onryo; salt touched → not Wraith."],
  ["9 · Always check for the Mimic", "On zero evidence, Ghost Orbs = Mimic. With evidence, orbs + 3 others = Mimic."]
];

PD.expert = [
{ id: "investigation", title: "Investigation mastery", items: [
  ["Finding the room", "Use the thermometer room-to-room, sound sensors per floor on big maps, the Parabolic Microphone through walls, and the Haunted Mirror / Ouija Board if spawned."],
  ["Room vs. roaming", "A single interaction is not the ghost room. Look for repeated cold, orbs, EMF and D.O.T.S. in one place."],
  ["Event vs. hunt", "Hunts lock the exit door and use the same hunting sound each time; events don't lock the door."],
  ["False evidence", "Seeing breath is not Freezing. EMF 4 is not EMF 5. Dust is not orbs. Untouched salt means nothing unless the ghost crossed it."],
  ["Perfect investigation", "Correct ghost type plus all evidence that the difficulty can show."],
  ["Bone", "A bone spawns somewhere in the map; photograph or pick it up. A bone in the ghost room is random."]
]},
{ id: "survival", title: "Survival", items: [
  ["Solo", "Know your loop and your hiding spot before testing. Keep incense and a crucifix ready."],
  ["Team", "Assign one tester; others stay quiet and hidden. Turn off held electronics."],
  ["Looping", "Circle around tables/rooms breaking line of sight each lap. Not effective vs. fast LOS ghosts for long."],
  ["When hiding fails", "Incense it, break line of sight, keep moving to a different loop."],
  ["Early warning", "Flickering flashlight, heartbeat, falling sanity under 70% with a Demon or under 50% generally."]
]},
{ id: "progression", title: "Progression (overview)", status: "unverified", items: [
  ["XP & money", "Earned from identifying the ghost, objectives, media and photos; scaled by the difficulty multiplier."],
  ["Equipment tiers", "Unlock with levels and buy upgrades in the lobby."],
  ["Prestige", "Reset level for prestige rewards. Deogen requires level 30 or any prestige on the host."],
  ["Note", "Exact XP numbers, unlock levels and badges change often and were not re-verified for v0.19.1.0 — check the in-game menus."]
]}
];

/* Opposite pairs used by guided questions: answering "No" adds the opposite. */
PD.obsOpposites = { los: "nolos", nosalt: "salt", invis: "normalvis", quiet: "loud", photovanish: "photook", breath: "nobreath", deafhunt: "heardvoice", hidingend: "hiddenkill" };
