/* =========================================================================
   ghosts.js — the ghost database (30 ghosts, verified for v0.19.1.0)
   ev      = the ghost's three journal evidences (Mimic: its three real ones)
   forced  = evidence that can never be the hidden one on reduced-evidence difficulties
   thrMax  = highest average-sanity value at which this ghost can start a NORMAL hunt
             (null = depends on something other than average sanity, never used to rule out)
   speed.los: "yes" normal line-of-sight acceleration, "no" none, "partial" only in some states
   All descriptions are written in our own words. Sources: see meta.js.
   ========================================================================= */
window.PD = window.PD || {};

PD.LOS_NOTE = "Most ghosts gradually gain speed while they keep seeing a player during a hunt, up to about 1.65× their base speed (≈2.8 m/s for a 1.7 m/s ghost). Sources disagree on how long that takes (13 s vs 26 s), so treat timing as approximate.";

PD.ghosts = [
{
  id: "aswang", name: "Aswang", ev: ["dots","frz","gw"], forced: null, added: "May 2026 (Alan Wake event update)",
  desc: "A feral pursuer. It is slow until it locks eyes on you, then gains speed faster than any other ghost — but it will not kill a player inside an official hiding spot.",
  strength: "Accelerates with line of sight faster than any other ghost; can sometimes start a hunt with no grace period.",
  weakness: "Slower base hunt speed; cannot kill players in official hiding spots.",
  huntThr: "50%", thrMax: 50,
  speed: { base: 1.53, min: 1.53, max: 2.53, los: "yes",
    text: "1.53 m/s base. Line-of-sight speed builds at 1.5× the normal rate, reaching ~2.53 m/s in about two-thirds of the usual time." },
  traits: [
    "If it reaches an official hiding spot holding a player it has detected, the hunt ends immediately.",
    "After ending a hunt that way, its next hunt heads straight for that player's position — even during the grace period.",
    "Simply seeing you enter a hiding spot is not enough; it must actually reach the spot.",
    "Cursed-possession hunts shrink the grace period to 1 s, which makes the grace-period test harder."
  ],
  tests: {
    fastest: "Let it see you, then get into an official hiding spot (closet/locker). If it reaches the spot and the hunt ends on the spot, it is an Aswang.",
    safe: "Put salt or a motion sensor on the path from the ghost room. A trigger during the opening grace period of a hunt points to Aswang.",
    risky: "Loop it in the open and listen for unusually fast acceleration after only a few seconds of line of sight.",
    zero: "The hiding-spot hunt end is a full confirmation with no evidence needed."
  },
  confirm: ["Hunt ends the moment it reaches your official hiding spot.", "Moves during the hunt grace period after a hiding-spot hunt end."],
  exclude: ["Hunts above 50% average sanity (normal hunt).", "Kills a player inside an official hiding spot."],
  confused: [["revenant","Revenant jumps instantly to 3.0 m/s; Aswang builds up quickly but gradually from 1.53 m/s."],["yurei","Shares Freezing + D.O.T.S.; Yurei has normal speed and traps itself in its room after incense."]],
  src: ["dtoid_aswang","kukiz","keen_new"]
},
{
  id: "banshee", name: "Banshee", ev: ["orbs","uv","dots"], forced: null, added: "Original roster",
  desc: "A stalker that picks one target and only cares about them. Its hunt checks use the target's sanity, not the team average.",
  strength: "Targets one player; prefers singing ghost events; distinctive wails on the Parabolic Microphone / Sound Recorder.",
  weakness: "Only hunts its target while they are inside the investigation area.",
  huntThr: "50% of its target's sanity", thrMax: null, thrNote: "Because it uses the target's own sanity, team-average hunts can look as early as ~87% or as late as ~12% in multiplayer.",
  speed: { base: 1.7, min: 1.7, max: 2.8, los: "yes", text: "Normal 1.7 m/s with normal line-of-sight speed-up." },
  traits: [
    "Always female (model and name). A male name or model rules it out.",
    "About a 33% chance a Parabolic Microphone/Sound Recorder sound is its unique scream.",
    "Touching it during a singing event drains the target 15% instead of 10%.",
    "Often roams toward its target (about 66% of the time without leaving EMF); can head toward its target in a D.O.T.S. state.",
    "Target changes only when someone dies or the target leaves the game."
  ],
  tests: {
    fastest: "Listen with a Parabolic Microphone or Sound Recorder near the ghost room — the unique scream confirms it.",
    safe: "Check the ghost's name/gender on the whiteboard. Male = not a Banshee.",
    risky: "In multiplayer, if a non-target player can stand in its path during a hunt and is ignored, it is a Banshee.",
    zero: "Scream on the Parabolic Microphone, or hunts that ignore everyone but one player."
  },
  confirm: ["Unique Banshee scream on Parabolic Microphone / Sound Recorder.", "Ignores or cannot kill a non-target player during a hunt."],
  exclude: ["Male ghost name or model."],
  confused: [["kormos","Kormos may also walk past a still player, but because it cannot see — not because of targeting."],["dayan","Also always female; Dayan's speed depends on whether you move."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "dayan", name: "Dayan", ev: ["emf","orbs","sb"], forced: null, added: "Dec 16, 2025 (Winter's Jest update)",
  desc: "A ghost that reacts to movement. Move near it and it becomes fast and eager to hunt; stand still and it slows down.",
  strength: "Moves faster (and hunts earlier) when a nearby player is moving.",
  weakness: "Moves slower when nearby players stand still.",
  huntThr: "45–65% (65% if a nearby player is moving, 45% if standing still, 50% otherwise)", thrMax: 65,
  speed: { base: 1.7, min: 1.2, max: 2.8, los: "partial",
    text: "Within 10 m of a player: 2.25 m/s if the nearest player moves, 1.2 m/s if they stand still. Beyond 10 m of everyone: 1.7 m/s with normal line-of-sight speed-up (stored in the background)." },
  traits: [
    "Always female (model and name).",
    "Line-of-sight speed is not applied while within 10 m of a player, but it keeps building in the background.",
    "Hunt threshold shifts with player movement near it."
  ],
  tests: {
    fastest: "During a hunt, within 10 m: move, then freeze. Fast when you move and slow when you stop = Dayan.",
    safe: "Check the name/gender: male rules it out.",
    risky: "Stand still as it approaches from close range and listen for a sharp slow-down without line of sight.",
    zero: "The move/freeze speed switch inside 10 m is the defining tell."
  },
  confirm: ["Speeds up when you move nearby and slows when you stand still (within 10 m)."],
  exclude: ["Male ghost name or model.", "Hunts above 65% average sanity."],
  confused: [["deogen","Deogen slows when close to you no matter what you do; Dayan only slows if you stand still."],["gallu","Gallu also has variable speeds, but they follow its states, not your movement. Salt helps separate them."]],
  src: ["kukiz","filib_new"]
},
{
  id: "deildegast", name: "Deildegast", ev: ["emf","gw","dots"], forced: null, added: "Jul 21, 2026 (13 Willow Street rework update)",
  desc: "Starts every hunt cycle at full speed and gets slower the more unique objects the team handles before the next hunt.",
  strength: "Very fast at the start of an investigation and after every hunt (3.0 m/s).",
  weakness: "Each unique item players interact with between hunts slows its next hunt.",
  huntThr: "50%", thrMax: 50,
  speed: { base: 3.0, min: 0.4, max: 3.0, los: "no",
    text: "Starts at 3.0 m/s; each unique counted interaction before the next hunt removes 0.1 m/s, down to 0.4 m/s after 26. No line-of-sight speed-up. Speed is locked once the hunt starts." },
  traits: [
    "Counted: picking up non-equipment items, using objects (e.g. consoles, microwaves), light switches, the breaker, taps.",
    "Each unique item counts once per hunt cycle. Living AND dead players count. Interactions anywhere (even the truck) count.",
    "Objects the ghost itself moves do not slow it.",
    "After a hunt (or hunt attempt) it resets to 3.0 m/s."
  ],
  tests: {
    fastest: "Never gaining speed during long line of sight, at a fixed speed, narrows to non-LOS ghosts; then compare speed after many vs. no interactions.",
    safe: "Between hunts, have the team interact with 26+ unique non-equipment items. A next hunt at a crawl (~0.4 m/s) points to Deildegast.",
    risky: "Survive an early hunt with no interactions — it will be at 3.0 m/s with no acceleration.",
    zero: "A hunt speed that clearly drops after the team handled many items, with no line-of-sight gain."
  },
  confirm: ["Hunts at ~0.4 m/s after 26+ unique interactions, without proximity effects."],
  exclude: ["Gains speed from line of sight.", "Hunts above 50% average sanity."],
  confused: [["revenant","Revenant switches between 1.0 and 3.0 m/s within one hunt; Deildegast's speed is locked for the whole hunt."],["thaye","Thaye also lacks line-of-sight speed-up and starts fast, but slows by aging near players, not by item use."]],
  src: ["kukiz","gg_deild","dtoid_deild"]
},
{
  id: "demon", name: "Demon", ev: ["frz","uv","gw"], forced: null, added: "Original roster",
  desc: "The most aggressive hunter: it hunts early, recovers from protections faster and can start a hunt at any sanity with its ability.",
  strength: "Can rarely use its ability to start a hunt at any sanity; shorter waits after incense and after hunts.",
  weakness: "Crucifixes work 50% further against it.",
  huntThr: "70% (ability: any sanity)", thrMax: 100,
  speed: { base: 1.7, min: 1.7, max: 2.8, los: "yes", text: "Normal 1.7 m/s with normal line-of-sight speed-up." },
  traits: [
    "Can hunt 60 s after incense (others: 90 s).",
    "Can hunt 20 s after a hunt ends or a crucifix burns (others: 25 s).",
    "Crucifix range vs Demon: Tier 1 4.5 m, Tier 2 6 m, Tier 3 7.5 m."
  ],
  tests: {
    fastest: "Start a timer after a successful incense. A hunt before 90 s = Demon.",
    safe: "Time the gap between the end of one hunt and the start of the next: under 25 s = Demon.",
    risky: "A hunt above 80% average sanity with nobody below 50% and no flames lit (Onryo excluded) = Demon.",
    zero: "Incense and hunt-cooldown timing are reliable without evidence."
  },
  confirm: ["Hunts less than 90 s after being incensed.", "Hunts less than 25 s after the previous hunt ended."],
  exclude: [],
  confused: [["onryo","Onryo can also hunt at very high sanity after blowing out 3 flames; watch candles."],["spirit","Spirit waits 180 s after incense — the opposite extreme."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "deogen", name: "Deogen", ev: ["sb","gw","dots"], forced: "sb", added: "2022",
  desc: "Always knows where you are during a hunt. It rushes in fast from afar, then crawls once it is close.",
  strength: "Knows every player's location during a hunt — hiding does not work.",
  weakness: "Moves extremely slowly once near its victim.",
  huntThr: "40%", thrMax: 40,
  speed: { base: 3.0, min: 0.4, max: 3.0, los: "no", text: "3.0 m/s when far from its target, slowing to as low as 0.4 m/s when close. No line-of-sight speed-up." },
  traits: [
    "More visible during hunts than a normal ghost.",
    "About a 33% chance of a heavy-breathing Spirit Box reply when a player is within 1 m.",
    "Spirit Box is guaranteed (forced) evidence on reduced-evidence difficulties.",
    "Only appears for hosts at level 30+ (or any prestige)."
  ],
  tests: {
    fastest: "Spirit Box very close to the ghost (within 1 m) — the heavy-breathing response is unique.",
    safe: "On Nightmare/Insanity, no Spirit Box evidence after a thorough attempt rules it out.",
    risky: "Let it hunt you in an open loop: very fast approach, then a crawl near you = Deogen. Loop it around an object.",
    zero: "Fast-far / slow-near speed pattern and you cannot hide from it."
  },
  confirm: ["Very fast from far away, then extremely slow near you.", "Heavy-breathing Spirit Box response within 1 m."],
  exclude: ["Hunts above 40% average sanity.", "Spirit Box ruled out on 1–2 evidence difficulty."],
  confused: [["dayan","Dayan slows near you only if you stand still."],["revenant","Revenant is slow until it detects you, then fast — the reverse pattern."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "gallu", name: "Gallu", ev: ["emf","sb","uv"], forced: null, added: "Dec 16, 2025 (Winter's Jest update)",
  desc: "A demon that is provoked by protection. Salt, incense and crucifixes enrage it; after an enraged hunt it is weakened.",
  strength: "Becomes enraged when protective equipment is used against it.",
  weakness: "Becomes weakened (slower, later hunts) after a hunt.",
  huntThr: "40–60% (Normal 50%, Enraged 60%, Weakened 40%)", thrMax: 60,
  speed: { base: 1.7, min: 1.36, max: 3.2, los: "yes",
    text: "Normal 1.7 m/s, Enraged 1.96 m/s, Weakened 1.36 m/s, each with normal line-of-sight speed-up." },
  traits: [
    "Normal → Enraged when it steps in salt (2 s delay), is incensed or burns a crucifix.",
    "Enraged: does NOT disturb salt, incense blinds only 4 s, crucifix range −2 m, can hunt on a Tier 1 crucifix on the floor.",
    "Enraged lasts until the hunt ends, then it becomes Weakened.",
    "Weakened: incense blinds 6 s, crucifix +1 m, disturbs salt; salt (3 s delay)/incense/crucifix returns it to Normal.",
    "Only ghost that can take more than 4 audible steps right after stepping in salt."
  ],
  tests: {
    fastest: "Fast ghost walks through salt without disturbing it during a hunt = Gallu (Wraith never disturbs salt and is not sped up).",
    safe: "Place one salt pile while it is Normal. 5–6 audible steps after it steps in it = Gallu.",
    risky: "Row of Tier 2/3 salt piles 1–2 m apart; incense it after it disturbs the first. Skipping the rest = Gallu.",
    zero: "Speed jump 2–3 s after stepping in salt, or inconsistent salt disturbance."
  },
  confirm: ["Speeds up ~2–3 s after stepping in salt.", "5–6 audible steps after stepping in salt.", "Fast ghost passing salt without disturbing it."],
  exclude: ["Hunts above 60% average sanity."],
  confused: [["wraith","Wraith never disturbs salt at all and keeps normal speed."],["obambo","Obambo's states change on a 2-minute timer, not because of your equipment."]],
  src: ["kukiz","filib_new"]
},
{
  id: "goryo", name: "Goryo", ev: ["emf","uv","dots"], forced: "dots", added: "2021",
  desc: "A homebody that never changes its room. Its D.O.T.S. silhouette only shows on a video camera when nobody is in the room.",
  strength: "D.O.T.S. silhouette visible only through a video camera, and only when no player is in its room.",
  weakness: "Cannot wander far from its room or change favourite rooms.",
  huntThr: "50%", thrMax: 50,
  speed: { base: 1.7, min: 1.7, max: 2.8, los: "yes", text: "Normal 1.7 m/s with normal line-of-sight speed-up." },
  traits: [
    "Never changes favourite room; no long roams.",
    "Enters D.O.T.S. state more often than other ghosts.",
    "D.O.T.S. is guaranteed (forced) evidence on reduced-evidence difficulties.",
    "A bone in the ghost room is random — it does not indicate Goryo."
  ],
  tests: {
    fastest: "Watch D.O.T.S. on a video camera with everyone outside the room.",
    safe: "Track the ghost room over time. A room change rules out Goryo.",
    risky: "None needed.",
    zero: "Never changes room and stays close to it all game (suggestive only)."
  },
  confirm: [],
  exclude: ["Ghost changes its favourite room.", "D.O.T.S. ruled out on 1–2 evidence difficulty.", "D.O.T.S. silhouette seen with the naked eye."],
  confused: [["wraith","Shares EMF + D.O.T.S.; Wraith teleports to players and leaves EMF far from the room."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "hantu", name: "Hantu", ev: ["orbs","frz","uv"], forced: "frz", added: "2022",
  desc: "A cold-loving ghost: fast in freezing rooms and slow in warm ones. With the power off you can see its breath.",
  strength: "Faster in cold areas; freezing breath during hunts when the breaker is off.",
  weakness: "Slower in warm areas; never turns the breaker on.",
  huntThr: "50%", thrMax: 50,
  speed: { base: 1.7, min: 1.4, max: 2.7, los: "no", text: "1.4 m/s in warm rooms up to 2.7 m/s in freezing rooms; changes room by room. No line-of-sight speed-up." },
  traits: [
    "Visible freezing breath from the ghost during hunts when the breaker is off or broken.",
    "Cannot turn the breaker on; more likely to turn it off.",
    "Freezing Temperatures is guaranteed (forced) evidence on reduced difficulties.",
    "It does not chill rooms faster than other freezing ghosts."
  ],
  tests: {
    fastest: "Turn the breaker off and watch the ghost during a hunt for freezing breath.",
    safe: "If the ghost turns the breaker ON, it is not a Hantu.",
    risky: "Listen to speed changes as it moves between cold and warm rooms.",
    zero: "Freezing breath with power off, and no line-of-sight acceleration."
  },
  confirm: ["Freezing breath visible on the ghost during a hunt with breaker off.", "Speed changes with room temperature."],
  exclude: ["Ghost turns the breaker on.", "No breath during a hunt with breaker off.", "Gains speed from line of sight.", "Freezing ruled out on 1–2 evidence difficulty."],
  confused: [["mimic","The Mimic's real evidence includes Freezing + UV; its fake orbs can complete a 'Hantu' set. Check Spirit Box."],["aswang","Aswang's speed tracks line of sight, not temperature."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "jinn", name: "Jinn", ev: ["emf","frz","uv"], forced: null, added: "Original roster",
  desc: "A territorial ghost powered by electricity. With the breaker on it can dash toward distant players it sees.",
  strength: "Moves faster toward a distant player in sight while the breaker is on; can drain large amounts of sanity.",
  weakness: "Cannot use its ability with the breaker off; never turns the breaker off directly.",
  huntThr: "50%", thrMax: 50,
  speed: { base: 1.7, min: 1.7, max: 2.8, los: "yes",
    text: "1.7 m/s normally. With the breaker on and line of sight to a player more than 3 m away it instantly moves at 2.5 m/s, returning to normal within 3 m." },
  traits: [
    "Its sanity-drain ability takes 25% from a player within 3 m or in the same room, and leaves EMF at the breaker.",
    "Line-of-sight speed keeps building in the background while the 2.5 m/s boost is active."
  ],
  tests: {
    fastest: "Breaker on, let it see you from >3 m away during a hunt: instant jump to ~2.5 m/s that drops when it gets within 3 m.",
    safe: "If the ghost directly turns the breaker off, it is not a Jinn.",
    risky: "Same test as fastest — needs a hunt.",
    zero: "Instant 2.5 m/s jump from far away with power on; EMF reading at the breaker."
  },
  confirm: ["Instant speed boost when it sees you from >3 m with the breaker on, slowing within 3 m."],
  exclude: ["Ghost turns the breaker off directly."],
  confused: [["raiju","Raiju's boost comes from nearby active electronics, not distance or the breaker."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "kormos", name: "Kormos", ev: ["orbs","sb","uv"], forced: null, added: "May 2026 (Alan Wake event update)",
  desc: "A nearly blind ghost with superb hearing. Stay still and silent and it may walk right past you.",
  strength: "Hears movement from far away and rushes to where it heard you.",
  weakness: "Can only see a player who is moving within 5 m.",
  huntThr: "50% (up to 70% if a player sprints in its room)", thrMax: 70,
  speed: { base: 1.7, min: 1.7, max: 3.65, los: "partial",
    text: "1.7 m/s; 2.21 m/s while heading to a player it detected from more than 5 m away. Gains line-of-sight speed only while a player moves within 5 m; stored speed carries between states, so it can get very fast." },
  traits: [
    "Detects movement: crouch-walking 10 m, walking 15 m, sprinting 30 m. Voice and electronics at normal ranges.",
    "Goes to the last known location of the player it detected.",
    "Never performs Ghost Mist or Chasing ghost events.",
    "Its evidence (Orbs, Spirit Box, UV) can be faked by The Mimic (Spirit Box + UV + fake orbs) — test Freezing."
  ],
  tests: {
    fastest: "During a hunt, stand completely still and silent in its path. If it passes without noticing you, suspect Kormos.",
    safe: "Thoroughly test Freezing Temperatures: Freezing present means Mimic, not Kormos.",
    risky: "Sprint far away from it during a hunt and listen for a fast beeline (2.21 m/s) to where you were.",
    zero: "Ignores still, silent players at close range; no Ghost Mist/Chasing events ever."
  },
  confirm: [],
  exclude: ["Hunts above 70% average sanity.", "Performs a Ghost Mist or Chasing ghost event."],
  confused: [["mimic","Full Kormos evidence can be a Mimic: check Freezing."],["yokai","Yokai reacts weakly to voices; Kormos reacts strongly to movement."],["banshee","A Banshee also ignores non-target players."]],
  src: ["kukiz","dtoid_kormos","keen_new"]
},
{
  id: "mare", name: "Mare", ev: ["orbs","sb","gw"], forced: null, added: "2021",
  desc: "A creature of darkness. It hunts earlier in the dark and keeps switching lights off.",
  strength: "Hunts at higher sanity in the dark; can instantly switch off a light a player just turned on.",
  weakness: "Lower hunt threshold in the light; never turns a light on.",
  huntThr: "60% with the room's light off / 40% with it on", thrMax: 60,
  speed: { base: 1.7, min: 1.7, max: 2.8, los: "yes", text: "Normal 1.7 m/s with normal line-of-sight speed-up." },
  traits: [
    "Thresholds use the light switch in its current room, regardless of the breaker.",
    "Prefers light-off and light-breaking events; roams more often when its room is lit.",
    "Cannot turn on lights, TVs or computers (motion lights excepted).",
    "Never makes the light-flick interaction that leaves EMF 2 on a switch.",
    "Only ghost that can switch a light off during a ghost event."
  ],
  tests: {
    fastest: "During a ghost event, turn on a light within 4 m. If it snaps off while the event continues = Mare.",
    safe: "If the ghost ever turns a light ON, it is not a Mare.",
    risky: "Repeatedly turn on lights near it and see if they are instantly turned off (suggestive).",
    zero: "Never turns lights on; hunts around 60% in the dark."
  },
  confirm: ["Switches a light off during a ghost event."],
  exclude: ["Ghost turns a light switch on.", "Light flickers and the switch gives an EMF reading.", "Hunts above 60% average sanity."],
  confused: [["spirit","Shares Spirit Box + Writing."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "moroi", name: "Moroi", ev: ["sb","frz","gw"], forced: "sb", added: "2022",
  desc: "A curse-spreading ghost that grows faster as the team loses their minds.",
  strength: "Gets faster as average sanity drops; curses players who hear it so their sanity drains faster.",
  weakness: "Incense blinds it for longer (7 s instead of 5 s).",
  huntThr: "50%", thrMax: 50,
  speed: { base: 1.5, min: 1.5, max: 3.71, los: "yes",
    text: "1.5 m/s above 45% average sanity, rising to 2.25 m/s at 0–5%, plus normal line-of-sight speed-up (up to ~3.71 m/s)." },
  traits: [
    "Curse is applied after hearing a Spirit Box reply, a Parabolic Microphone paranormal sound, or a recorded Sound Recorder sound.",
    "Cursed players drain at double rate, even in the light.",
    "Spirit Box is guaranteed (forced) evidence on reduced difficulties.",
    "Taking sanity medication during a hunt slows it."
  ],
  tests: {
    fastest: "Incense it during a hunt while it can see you. Blind longer than 5 s = Moroi (Weakened Gallu: 6 s).",
    safe: "After hearing a qualifying sound, stand in a lit room — sanity still draining = Moroi curse.",
    risky: "Compare speed across hunts as sanity falls: clearly faster at low sanity = Moroi.",
    zero: "Speed rising across hunts as sanity falls, still with line-of-sight speed-up."
  },
  confirm: ["Faster at lower average sanity while still accelerating with line of sight.", "Incense blindness over 5 s (not a Weakened Gallu)."],
  exclude: ["Hunts above 50% average sanity.", "Spirit Box ruled out on 1–2 evidence difficulty."],
  confused: [["mare","Both hunt around 50%; Moroi has the speed-sanity link."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "myling", name: "Myling", ev: ["emf","uv","gw"], forced: null, added: "2022",
  desc: "A quiet hunter. You will hear it on the Parabolic Microphone often, but barely hear it coming in a hunt.",
  strength: "Its hunt footsteps and vocals are only audible from about 12 m (others ~20 m).",
  weakness: "Makes paranormal sounds more often on the Parabolic Microphone / Sound Recorder.",
  huntThr: "50%", thrMax: 50,
  speed: { base: 1.7, min: 1.7, max: 2.8, los: "yes", text: "Normal 1.7 m/s with normal line-of-sight speed-up." },
  traits: ["Paranormal sounds every 64–127 s instead of 80–127 s.", "Not silent — just audible from a shorter distance."],
  tests: {
    fastest: "Two Parabolic Microphone/Sound Recorder sounds within 80 s of each other = Myling.",
    safe: "Same as fastest — no hunt needed.",
    risky: "Stand 12–20 m from it during a hunt. If you can't hear footsteps or vocals there, it's a Myling.",
    zero: "Short hearing range during hunts; frequent paranormal sounds."
  },
  confirm: ["Two paranormal sounds within 80 s.", "Inaudible at 12–20 m during a hunt."],
  exclude: ["Footsteps clearly heard 12–20 m away during a hunt.", "Hunts above 50% average sanity."],
  confused: [["shade","Shares EMF + Writing; Shade hunts at 35% and is shy around players."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "obake", name: "Obake", ev: ["emf","orbs","uv"], forced: "uv", added: "2022",
  desc: "A shapeshifter. During hunts it briefly flips into a different model, and it leaves strange fingerprints.",
  strength: "May skip leaving fingerprints; makes prints fade faster; rare special prints.",
  weakness: "Can briefly shapeshift into another model during a hunt.",
  huntThr: "50%", thrMax: 50,
  speed: { base: 1.7, min: 1.7, max: 2.8, los: "yes", text: "Normal 1.7 m/s with normal line-of-sight speed-up." },
  traits: [
    "Shapeshifts for a single blink on set blink numbers (12, 27, 39, 54, 62, 80, 105, 120, 132); pattern carries over between hunts.",
    "Special prints: 6-fingered handprint (doors, windows, coolers), double fingerprint on light switches, 5 prints on keyboards/cell doors.",
    "25% chance not to leave UV when it normally would; 25% chance to skip a footstep after salt.",
    "UV is guaranteed (forced) evidence on reduced difficulties.",
    "Male models only change into male models, female into female."
  ],
  tests: {
    fastest: "Find a 6-fingered handprint or double switch fingerprint with UV.",
    safe: "Salt test: a missing step in the middle of the step sequence after salt = Obake.",
    risky: "Watch it in a hunt (loop it). A one-blink model change = Obake.",
    zero: "Shapeshift during a hunt; special UV prints."
  },
  confirm: ["One-blink model change during a hunt.", "6-fingered handprint / double switch fingerprint."],
  exclude: ["Hunts above 50% average sanity.", "UV ruled out on 1–2 evidence difficulty."],
  confused: [["raiju","Shares EMF + Orbs."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "obambo", name: "Obambo", ev: ["uv","gw","dots"], forced: null, added: "Dec 16, 2025 (Winter's Jest update)",
  desc: "A ghost with two moods on a timer: Calm (slow, late hunts) and Aggressive (fast, very early hunts).",
  strength: "Aggressive state: hunts early (65%) and moves faster.",
  weakness: "Calm state: hunts late (10%) and moves slower; aggressive-state hunts are 20% shorter.",
  huntThr: "10% (Calm) / 65% (Aggressive)", thrMax: 65,
  speed: { base: 1.45, min: 1.45, max: 3.2, los: "yes", text: "Calm 1.45 m/s, Aggressive 1.96 m/s, both with normal line-of-sight speed-up." },
  traits: [
    "Switches state every 2 minutes; the timer starts half-way through Calm when the front door first opens.",
    "Can switch state in the middle of a hunt, instantly changing speed."
  ],
  tests: {
    fastest: "Speed jumps between ~1.45 and ~1.96 m/s within one hunt = Obambo.",
    safe: "Time hunts: early hunts land in 2-minute windows.",
    risky: "Survive long hunts to hear a mid-hunt state change.",
    zero: "Mid-hunt speed change between the two values."
  },
  confirm: ["Speed changes between ~1.45 and ~1.96 m/s in the same hunt."],
  exclude: ["Hunts above 65% average sanity."],
  confused: [["twins","The Twins also alternate 1.5/1.9 m/s, but only between different hunts."],["gallu","Gallu's states change with your equipment use."]],
  src: ["kukiz","filib_new"]
},
{
  id: "oni", name: "Oni", ev: ["emf","frz","dots"], forced: null, added: "Original roster",
  desc: "A show-off. More active with players around and far more visible while hunting.",
  strength: "More active with people nearby; ghost events drain 20% sanity instead of 10%.",
  weakness: "More visible during hunts; cannot do the Ghost Mist ('airball') event.",
  huntThr: "50%", thrMax: 50,
  speed: { base: 1.7, min: 1.7, max: 2.8, los: "yes", text: "Normal 1.7 m/s with normal line-of-sight speed-up." },
  traits: ["Blinks visible for longer during hunts.", "More likely to use its full model in events.", "A hissing sound alone is not a Ghost Mist — see it."],
  tests: {
    fastest: "Watch it during a hunt: much more visible between blinks = Oni.",
    safe: "Sanity monitor: a ghost event that costs 20% = Oni.",
    risky: "Same as fastest.",
    zero: "High hunt visibility; no Ghost Mist ever."
  },
  confirm: ["Clearly more visible during hunts.", "Ghost event drains 20% sanity."],
  exclude: ["You actually see a Ghost Mist event.", "Hunts above 50% average sanity."],
  confused: [["deogen","Deogen is also more visible, but its speed pattern is unique."],["phantom","Phantom is the opposite — nearly invisible."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "onryo", name: "Onryo", ev: ["orbs","sb","frz"], forced: null, added: "2022",
  desc: "A fire-hating ghost. Flames protect you like a crucifix, but every third flame it blows out can trigger a hunt.",
  strength: "May hunt at any sanity after blowing out three flames.",
  weakness: "A lit flame nearby blocks its hunts like a crucifix.",
  huntThr: "60% (ability: any sanity)", thrMax: 100,
  speed: { base: 1.7, min: 1.7, max: 2.8, los: "yes", text: "Normal 1.7 m/s with normal line-of-sight speed-up." },
  traits: [
    "Only ghost that can blow out the same flame twice within 20 s.",
    "Cannot light fires. Prefers a flame over a crucifix when blocking a hunt (flame range ~4 m).",
    "More likely to blow out flames as players die.",
    "Ability hunts can be delayed by incense or hunt cooldown."
  ],
  tests: {
    fastest: "Same flame blown out twice within 20 s = Onryo.",
    safe: "Place a lit candle on a crucifix. If the crucifix burns while the candle is still lit and covering it, it is not an Onryo.",
    risky: "Above 75% sanity, light a candle on a crucifix and let it extinguish 3+ times (suggestive).",
    zero: "Hunts at high sanity right after flames go out."
  },
  confirm: ["Same flame extinguished twice within 20 s."],
  exclude: ["Ghost lights a fire source.", "Crucifix used while a lit candle covered it."],
  confused: [["demon","Both can hunt at very high sanity; track flames."],["mimic","Mimic can produce Onryo's full set with fake orbs: test Spirit Box vs UV."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "phantom", name: "Phantom", ev: ["sb","uv","dots"], forced: null, added: "Original roster",
  desc: "A ghost that hates cameras. A photo makes it vanish, and in hunts it is almost invisible.",
  strength: "Looking at it drains sanity; occasionally walks to a random player.",
  weakness: "A photo makes it disappear; less visible during hunts.",
  huntThr: "50%", thrMax: 50,
  speed: { base: 1.7, min: 1.7, max: 2.8, los: "yes", text: "Normal 1.7 m/s with normal line-of-sight speed-up." },
  traits: [
    "Never appears in a journal photo labelled 'Ghost' (event or D.O.T.S.).",
    "Drains 0.5% sanity per second while you are in its heartbeat range during hunts/events.",
    "Can roam to a random player and leave EMF 2 there.",
    "Still appears in translucent/shadow/D.O.T.S./hunting videos."
  ],
  tests: {
    fastest: "Photograph it during an event or D.O.T.S.: it vanishes, the event sound continues, no 'Ghost' photo = Phantom.",
    safe: "A clean 'Ghost' photo in the journal rules it out.",
    risky: "Watch it during a hunt: long invisible gaps between blinks = Phantom.",
    zero: "Photo vanish; near-invisible hunts."
  },
  confirm: ["Vanishes when photographed and no 'Ghost' photo is recorded.", "Nearly invisible during hunts."],
  exclude: ["Journal photo labelled 'Ghost' shows it.", "Normal or increased visibility while hunting.", "Hunts above 50% average sanity."],
  confused: [["oni","Oni is the most visible; Phantom the least."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "poltergeist", name: "Poltergeist", ev: ["sb","uv","gw"], forced: null, added: "Original roster",
  desc: "The thrower. It flings objects hard and can blast several at once.",
  strength: "Throws multiple objects at once and at high speed.",
  weakness: "Powerless with no throwables nearby.",
  huntThr: "50%", thrMax: 50,
  speed: { base: 1.7, min: 1.7, max: 2.8, los: "yes", text: "Normal 1.7 m/s with normal line-of-sight speed-up." },
  traits: [
    "Tries to throw an object every 0.5 s during hunts.",
    "'Poltergeist explosion' throws many nearby objects; 2% sanity per object to nearby players.",
    "Cannot throw the Ghost Writing Book. Only ghost that can throw while itself standing in a lit room."
  ],
  tests: {
    fastest: "Pile several objects (not stacked) in the ghost room. Many thrown at once = Poltergeist.",
    safe: "Same as fastest.",
    risky: "Line objects along its hunt path; all thrown hard as it passes = Poltergeist.",
    zero: "Multi-object explosions."
  },
  confirm: ["Several objects thrown at the same moment (explosion)."],
  exclude: ["Hunts above 50% average sanity."],
  confused: [["deildegast","Deildegast cares about players moving items, not throws."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "raiju", name: "Raiju", ev: ["emf","orbs","dots"], forced: null, added: "2022",
  desc: "Feeds on electronics. Near active equipment it is fast and hunts early.",
  strength: "Faster near active electronic equipment; can hunt at 65% near electronics.",
  weakness: "Disrupts electronics from further away (15 m), giving earlier warning.",
  huntThr: "50% (65% near active electronics)", thrMax: 65,
  speed: { base: 1.7, min: 1.7, max: 2.8, los: "yes",
    text: "1.7 m/s; fixed 2.5 m/s while near active electronic player equipment (6 m small / 8 m medium / 10 m large maps). Line-of-sight speed stored in the background." },
  traits: ["Held and placed electronics both count.", "Electronic interference radius 15 m (normal 10 m)."],
  tests: {
    fastest: "Turn a device on/off near its path during a hunt: speed flips to 2.5 m/s and back = Raiju.",
    safe: "Place active electronics and listen from a safe spot.",
    risky: "Carry an active device during a hunt.",
    zero: "Speed spikes near electronics; long-range flicker."
  },
  confirm: ["Speeds up near active electronics and slows when it leaves them."],
  exclude: ["No speed-up near active electronics in a hunt.", "Hunts above 65% average sanity."],
  confused: [["jinn","Jinn's boost comes from distance + breaker, not electronics."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "revenant", name: "Revenant", ev: ["orbs","frz","gw"], forced: null, added: "Original roster",
  desc: "Slow when searching, terrifying when it finds you.",
  strength: "Very fast (3.0 m/s) once it detects a player.",
  weakness: "Very slow (1.0 m/s) when it has not detected anyone.",
  huntThr: "50%", thrMax: 50,
  speed: { base: 1.0, min: 1.0, max: 3.0, los: "no",
    text: "1.0 m/s searching; instantly 3.0 m/s after detecting a player (sight, voice, electronics); slows back after reaching their last known location. No normal line-of-sight build-up." },
  traits: ["The jump to 3.0 m/s is instant, not gradual."],
  tests: {
    fastest: "Hide and listen: very slow footsteps that instantly become very fast when it detects someone = Revenant.",
    safe: "Listen from far away; Revenant's searching speed is unmistakably slow.",
    risky: "Let it detect you from a distance to hear the instant jump.",
    zero: "1.0 m/s ↔ 3.0 m/s switching."
  },
  confirm: ["Instant switch from ~1.0 to ~3.0 m/s on detection."],
  exclude: ["Hunt speed that is neither ~1.0 nor ~3.0 m/s in the right conditions.", "Hunts above 50% average sanity."],
  confused: [["aswang","Aswang ramps up quickly but gradually."],["deogen","Deogen is fast far away and slow near you."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "shade", name: "Shade", ev: ["emf","frz","gw"], forced: null, added: "Original roster",
  desc: "A shy ghost. It hides from groups and will not hunt while someone shares its room.",
  strength: "Shy — hard to find and less active.",
  weakness: "Will not hunt while a player is in the same room.",
  huntThr: "35%", thrMax: 35,
  speed: { base: 1.7, min: 1.7, max: 2.8, los: "yes", text: "Normal 1.7 m/s with normal line-of-sight speed-up." },
  traits: [
    "No events, hunts or EMF-producing interactions while sharing a room with a player.",
    "No singing events; no 'lift and throw at player' interaction; no events at 100% sanity.",
    "Only ghost that appears as a shadow in Summoning Circle, Music Box and Monkey Paw events."
  ],
  tests: {
    fastest: "Summoning Circle / Music Box / Monkey Paw event showing a shadow model = Shade.",
    safe: "A singing ghost event rules it out.",
    risky: "Stay in its room with crucifix cover and see if it does anything.",
    zero: "Late hunts (≤35%) and shyness."
  },
  confirm: ["Shadow model in a Summoning Circle, Music Box or Monkey Paw event."],
  exclude: ["Singing ghost event.", "Hunt or EMF interaction while in the same room as a player.", "Hunts above 35% average sanity.", "Ghost event at 100% sanity."],
  confused: [["myling","Shares EMF + Writing."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "spirit", name: "Spirit", ev: ["emf","sb","gw"], forced: null, added: "Original roster",
  desc: "The baseline ghost. Its only special trait is how long incense keeps it from hunting.",
  strength: "None.",
  weakness: "Incense stops it hunting for 180 s instead of 90 s.",
  huntThr: "50%", thrMax: 50,
  speed: { base: 1.7, min: 1.7, max: 2.8, los: "yes", text: "Normal 1.7 m/s with normal line-of-sight speed-up." },
  traits: ["Waiting 180 s alone is not proof — any ghost can wait that long."],
  tests: {
    fastest: "Incense it, start a timer. A hunt before 180 s rules it out.",
    safe: "Incense at ~150–170 s again; a hunt within 60 s of the second incense = Spirit.",
    risky: "None.",
    zero: "Incense timing test."
  },
  confirm: ["Hunts within 60 s after a second incense applied ~150–170 s after the first."],
  exclude: ["Hunts less than 180 s after being incensed.", "Hunts above 50% average sanity."],
  confused: [["mare","Shares Spirit Box + Writing."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "thaye", name: "Thaye", ev: ["orbs","gw","dots"], forced: null, added: "2022",
  desc: "A ghost that ages. Young, it is fast and hunts early; time spent near players makes it old and slow.",
  strength: "Very fast and active early in the contract.",
  weakness: "Becomes slower and less active as it ages near players.",
  huntThr: "75% (young) falling to 15% (old)", thrMax: 75,
  speed: { base: 2.75, min: 1.0, max: 2.75, los: "no", text: "2.75 m/s when young down to 1.0 m/s when old. Never gains line-of-sight speed." },
  traits: [
    "Tries to age every 1–2 minutes; it ages only if a player is in its room (otherwise retries after 30 s).",
    "Ouija Board age answer increases as it ages; only ghost that can answer 90+."
  ],
  tests: {
    fastest: "Ask the Ouija Board its age, spend time near it, ask again. Age went up (or 90+) = Thaye.",
    safe: "Compare hunt speeds across the game: getting slower without line-of-sight speed-up.",
    risky: "Early fast hunt with no acceleration.",
    zero: "Speed falls across hunts; never accelerates."
  },
  confirm: ["Ouija age increases over time, or is 90+."],
  exclude: ["Gains speed from line of sight.", "Hunts above 75% average sanity."],
  confused: [["deildegast","Both lack LOS and start fast; Deildegast resets to fast after every hunt."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "mimic", name: "The Mimic", ev: ["sb","frz","uv"], forced: null, fakeOrbs: true, added: "2022",
  desc: "A copycat that imitates other ghosts' behaviour and always shows fake Ghost Orbs.",
  strength: "Copies other ghosts' abilities and traits (changing every 30–120 s).",
  weakness: "Always shows Ghost Orbs as extra evidence — even on zero evidence.",
  huntThr: "Depends on the ghost it is copying", thrMax: null,
  speed: { base: 1.7, min: 0.4, max: 3.71, los: "partial", text: "Uses the speed rules of whichever ghost it is copying." },
  traits: [
    "Real evidence: Spirit Box, Freezing, UV. Fake orbs appear in the favourite room on top.",
    "Orbs come from its ability, so they appear even on 0-evidence difficulties.",
    "Almost any behaviour test can be faked by a Mimic — always check for orbs."
  ],
  tests: {
    fastest: "Check the ghost room on a video camera for orbs. On zero evidence, orbs = Mimic.",
    safe: "No orbs in the favourite room (checked properly) rules it out.",
    risky: "Compare very different hunt behaviour between hunts.",
    zero: "Orbs on 0 evidence."
  },
  confirm: ["Ghost Orbs on a zero-evidence difficulty.", "Four evidence types found (three + orbs)."],
  exclude: ["No Ghost Orbs after a thorough check."],
  confused: [["kormos","Kormos = Orbs + Spirit Box + UV; Mimic can match that with fake orbs."],["hantu","Orbs + Freezing + UV can be a Mimic."],["onryo","Orbs + Spirit Box + Freezing can be a Mimic."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "twins", name: "The Twins", ev: ["emf","sb","frz"], forced: null, added: "2022",
  desc: "One ghost with two reaches: a normal interaction range and a much longer one. Hunts from the far reach are faster.",
  strength: "Can interact in two places at almost the same time; either 'twin' can start a hunt.",
  weakness: "One 'twin' hunts slowly, the other fast.",
  huntThr: "50%", thrMax: 50,
  speed: { base: 1.7, min: 1.5, max: 3.0, los: "yes", text: "1.5 m/s from its normal range, 1.9 m/s from its extended range, with line-of-sight speed-up." },
  traits: [
    "Normal range 2.12 m (small/medium) or 4.24 m (large); extended 8.48 m or 16.97 m.",
    "Salt, motion sensors and Spirit Box only react at its real position.",
    "Simultaneous interaction graphs do not confirm Twins."
  ],
  tests: {
    fastest: "Compare hunt speeds: alternating ~1.5 vs ~1.9 m/s between hunts (suggestive).",
    safe: "Watch for frequent interactions unusually far from the ghost room.",
    risky: "None.",
    zero: "Alternating hunt speeds without a mid-hunt switch."
  },
  confirm: [],
  exclude: ["Hunts above 50% average sanity."],
  confused: [["obambo","Obambo can switch speed mid-hunt; Twins cannot."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "wraith", name: "Wraith", ev: ["emf","sb","dots"], forced: null, added: "Original roster",
  desc: "A ghost that never touches salt and can teleport to players.",
  strength: "Never disturbs salt; can teleport to a random player.",
  weakness: "Teleporting leaves EMF at the player's location.",
  huntThr: "50%", thrMax: 50,
  speed: { base: 1.7, min: 1.7, max: 2.8, los: "yes", text: "Normal 1.7 m/s with normal line-of-sight speed-up. Tier 3 salt does not slow it." },
  traits: [
    "Teleport leaves EMF 2 or EMF 5 at foot height near the player, then it walks back.",
    "Despite the journal, it cannot walk through walls."
  ],
  tests: {
    fastest: "Salt under a Tier 1/2 motion sensor's beam: sensor fires but salt untouched = Wraith.",
    safe: "Any disturbed salt rules it out.",
    risky: "Watch it walk through salt during a hunt or event.",
    zero: "Salt test."
  },
  confirm: ["Ghost passes through salt without disturbing it (and is not a fast, enraged Gallu)."],
  exclude: ["Ghost disturbs salt in any way.", "Hunts above 50% average sanity."],
  confused: [["gallu","Enraged Gallu also skips salt but is noticeably fast."],["goryo","Shares EMF + D.O.T.S."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "yokai", name: "Yokai", ev: ["orbs","sb","dots"], forced: null, added: "2021",
  desc: "Provoked by voices: talking near it lets it hunt very early, but in a hunt it barely hears you.",
  strength: "Talking in its room lets it hunt up to 80%.",
  weakness: "In a hunt it only hears voices/electronics within about 2.5 m.",
  huntThr: "50% (up to 80% when players talk in its room)", thrMax: 80,
  speed: { base: 1.7, min: 1.7, max: 2.8, los: "yes", text: "Normal 1.7 m/s with normal line-of-sight speed-up." },
  traits: ["Music Box: reacts at 2.5 m (not 5 m) and closes it at 0.5 m."],
  tests: {
    fastest: "During a hunt, talk from a distance a normal ghost would hear (but >2.5 m). Ignored = Yokai.",
    safe: "Same test from behind cover.",
    risky: "Music Box lingering test while crouching and holding it.",
    zero: "Early hunts after talking; deaf in hunts."
  },
  confirm: ["Does not react to voice/electronics beyond ~2.5 m during a hunt."],
  exclude: ["Detects you by voice from a distance during a hunt.", "Hunts above 80% average sanity."],
  confused: [["kormos","Kormos hears movement extremely well; Yokai hears poorly."]],
  src: ["kukiz","wiki_ghost"]
},
{
  id: "yurei", name: "Yurei", ev: ["orbs","frz","dots"], forced: null, added: "Original roster",
  desc: "A sanity-draining ghost tied to doors. Incense traps it in its room.",
  strength: "Its ability slams a door and drains 15% sanity from nearby players.",
  weakness: "Incense traps it in its current room for 90 s.",
  huntThr: "50%", thrMax: 50,
  speed: { base: 1.7, min: 1.7, max: 2.8, los: "yes", text: "Normal 1.7 m/s with normal line-of-sight speed-up." },
  traits: [
    "Only ghost that can close/move an exit door outside hunts and events.",
    "Outside hunts its door moves are always full open or full close.",
    "No D.O.T.S. state while trapped by incense."
  ],
  tests: {
    fastest: "Rule-out based: incense it and watch all exits. Leaving within 90 s = not Yurei.",
    safe: "A partial door move outside a hunt rules it out.",
    risky: "None; no single confirmation test is documented.",
    zero: "Exit-door interaction outside a hunt is a strong hint."
  },
  confirm: ["Moves the exit door outside a hunt (strong hint)."],
  exclude: ["Partial door move outside a hunt.", "Leaves its room within 90 s of incense.", "D.O.T.S. during the 90 s incense trap.", "Hunts above 50% average sanity."],
  confused: [["aswang","Shares Freezing + D.O.T.S."]],
  src: ["kukiz","wiki_ghost"]
}
];
