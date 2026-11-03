/* =========================================================================
   cursed.js — the seven cursed possessions
   status: "verified" (checked against 2026 sources), "likely" (long-standing,
   not re-checked line by line this release), "unverified" (conflicting or
   unconfirmed — shown with a warning badge in the app).
   ========================================================================= */
window.PD = window.PD || {};

PD.cursedGeneral = {
  spawn: "Exactly one cursed possession can appear per contract. Each possession type has one fixed spawn spot per map (listed on every map page). On the biggest maps all seven spots are grouped near the entrance.",
  cursedHunt: "A cursed hunt is a hunt forced by a cursed possession. It ignores sanity and hunt cooldowns, lasts about 20 seconds longer than a normal hunt, and has only a 1-second grace period.",
  availability: "Cursed possessions can spawn on every standard difficulty. Custom difficulty and some weekly challenges can change how many appear or turn them off.",
  src: ["tg_cursed","tg_restricted","training"], status: "likely"
};

PD.cursed = [
{
  id: "ouija", name: "Ouija Board", icon: "ouija",
  look: "A wooden spirit board with a planchette.",
  purpose: "Ask the ghost questions by voice (or text input) at a sanity cost.",
  use: [
    "Pick up or click the board while in the investigation area to light it up.",
    "Ask a recognised question out loud. The planchette spells the answer.",
    "Say \"Goodbye\" when finished to close the board safely."
  ],
  activation: "Must be activated inside the investigation area. Voice (or text) recognition must hear a valid question.",
  sanity: "5% for most questions; 20% for information questions (location, bone, shyness, proximity, headcount). Hide and seek costs nothing but ends in a cursed hunt.",
  hunt: [
    "Asking \"Hide and seek?\" → the ghost counts down from 5, the board breaks and a cursed hunt starts (no sanity cost).",
    "Asking a question you cannot afford breaks the board and starts a cursed hunt.",
    "Walking away (no player within ~5 m) without saying goodbye breaks it and starts a cursed hunt."
  ],
  risks: "A broken board means a cursed hunt — about 20 s longer than normal with a 1 s grace period.",
  safe: ["Ask the most valuable question first while sanity is high.", "Always say \"Goodbye\".", "Take sanity medication before expensive questions.", "Have a hiding spot planned before asking anything."],
  advanced: ["\"Where is the bone?\" saves time on photo objectives.", "Thaye: ask its age twice — it rises as it ages and can be 90+.", "\"Where are you?\" pinpoints the room quickly on big maps."],
  ghostNotes: [["thaye","Only ghost whose age answer increases over time / reaches 90+."]],
  broken: "Breaks permanently and triggers a cursed hunt.",
  questions: [
    { cat: "Location", examples: "Where are you?", answer: "The ghost's current room", cost: "20%", status: "verified" },
    { cat: "Bone", examples: "Where is the bone?", answer: "Room holding the bone", cost: "20%", status: "verified" },
    { cat: "Shyness", examples: "Do you speak to everyone?", answer: "Yes / No (Spirit Box: alone or everyone)", cost: "20%", status: "verified" },
    { cat: "Proximity", examples: "Are you here? (voice only)", answer: "Yes / No — is it in your room", cost: "20%", status: "verified" },
    { cat: "Headcount", examples: "How many people are in this room? (voice only)", answer: "A number", cost: "20%", status: "verified" },
    { cat: "Sanity", examples: "Am I insane? / How sane am I? / How insane am I? (voice only)", answer: "A sanity band (e.g. Healthy, Average, Awful)", cost: "5%", status: "verified" },
    { cat: "Age", examples: "How old are you?", answer: "A number (Thaye: rises as it ages)", cost: "5%", status: "verified" },
    { cat: "Cause of death", examples: "How did you die?", answer: "e.g. accident, fell, drowned", cost: "5%", status: "verified" },
    { cat: "Death", examples: "How long have you been dead? (voice only)", answer: "50–1,000 years", cost: "5%", status: "verified" },
    { cat: "Purpose", examples: "Why are you here? (voice only)", answer: "e.g. hatred, lonely", cost: "5%", status: "verified" },
    { cat: "Feelings", examples: "How do you feel? (voice only)", answer: "e.g. angry, cold", cost: "5%", status: "verified" },
    { cat: "Jokes", examples: "Knock knock / Marco", answer: "Who's there / Polo", cost: "5%", status: "verified" },
    { cat: "Hide and seek", examples: "Hide and seek?", answer: "Counts down from 5 → board breaks → cursed hunt", cost: "0%", status: "verified" },
    { cat: "Goodbye", examples: "Goodbye", answer: "Closes the board safely", cost: "0%", status: "likely" }
  ],
  src: ["gs_ouija","kg_v01901"], status: "verified",
  note: "v0.19.0.1 fixed Ouija animations breaking if the Journal was opened during an answer."
},
{
  id: "mirror", name: "Haunted Mirror", icon: "mirror",
  look: "A small hand mirror.",
  purpose: "Shows a live view of the ghost's favourite room.",
  use: ["Pick it up and use it inside the investigation area.", "Look for distinctive furniture, wall colour or your own placed equipment.", "Use it again to put it away."],
  activation: "Use while inside the investigation area.",
  sanity: "Drains sanity continuously while you look into it.",
  hunt: ["If the mirror drains you to the point of breaking, it shatters and a cursed hunt starts."],
  risks: "Overusing it breaks it and causes a cursed hunt.",
  safe: ["Use it in short bursts.", "Glance, put it away, compare with the map.", "Keep sanity above about 50% before using."],
  advanced: ["Place recognisable equipment in candidate rooms first, then check the mirror view.", "On big maps it saves several minutes of searching."],
  ghostNotes: [],
  broken: "Shatters and triggers a cursed hunt.",
  src: ["training"], status: "likely"
},
{
  id: "musicbox", name: "Music Box", icon: "music",
  look: "A small wind-up box that plays a melody.",
  purpose: "Lures the ghost into singing along and revealing itself.",
  use: ["Open it to play the tune.", "If the ghost is close, it sings and may walk toward the box and appear.", "Close it before the ghost reaches the holder."],
  activation: "Played inside the investigation area.",
  sanity: "Drains sanity from nearby players while it plays.",
  hunt: ["If the ghost reaches the box while a player holds it, or the tune completes in some conditions, a cursed hunt can start.", "Throwing or dropping the box while it plays can trigger a cursed hunt."],
  risks: "The ghost walks toward the box; a cursed hunt follows if it reaches you.",
  safe: ["Place it on the floor and step away rather than holding it.", "Close it early if the ghost is closing in."],
  advanced: ["Shade appears as a shadow in Music Box events (confirmation).", "Yokai reacts only within 2.5 m and closes it at 0.5 m (instead of 5 m / 1 m)."],
  ghostNotes: [["shade","Appears as a shadow in the event."],["yokai","Shorter reaction (2.5 m) and closing (0.5 m) distances."]],
  broken: "Breaks after its use; can trigger a cursed hunt as described.",
  src: ["kukiz","training"], status: "unverified",
  note: "Exact durations and sanity rates are not re-verified for v0.19.1.0."
},
{
  id: "circle", name: "Summoning Circle", icon: "circle",
  look: "A chalk circle on the floor with five candles.",
  purpose: "Summons the ghost into the circle and traps it briefly, showing its model.",
  use: ["Light all five candles with an igniter.", "The ghost appears inside the circle for a few seconds.", "Take photos — the ghost is visible."],
  activation: "Each candle must be lit; lighting the last one performs the summon.",
  sanity: "Each candle lit costs sanity (large total cost).",
  hunt: ["After the summon, the ghost starts a cursed hunt.", "Lighting candles without enough sanity can summon immediately into a hunt."],
  risks: "Guaranteed dangerous: it ends in a cursed hunt.",
  safe: ["Plan an escape route before lighting the last candle.", "One person lights, everyone else hides."],
  advanced: ["Great for ghost photos.", "Shade appears as a shadow in the circle (confirmation)."],
  ghostNotes: [["shade","Appears as a shadow model in the circle."],["onryo","Lit candles near an Onryo also act like crucifixes."]],
  broken: "Used up after the summon.",
  src: ["kukiz","training"], status: "likely"
},
{
  id: "voodoo", name: "Voodoo Doll", icon: "doll",
  look: "A stitched doll with ten pins.",
  purpose: "Forces the ghost to interact or perform activity.",
  use: ["Pick it up and use it to push in one pin at a time.", "Each pin forces a ghost interaction somewhere near the ghost."],
  activation: "Usable inside the investigation area.",
  sanity: "Each pin costs a small amount of sanity; the heart pin costs more.",
  hunt: ["If the heart pin is pushed, a cursed hunt starts."],
  risks: "Any pin can be the heart pin.",
  safe: ["Use only while near a hiding spot.", "Stop early if you already got what you need."],
  advanced: ["Shade test: in the same room as a Shade, pins produce no interaction or EMF.", "Useful to produce fingerprints for UV evidence quickly."],
  ghostNotes: [["shade","No interaction while sharing a room with a player."]],
  broken: "Disappears after the last pin.",
  src: ["kukiz","training"], status: "likely"
},
{
  id: "tarot", name: "Tarot Cards", icon: "tarot",
  look: "A deck of ten cards.",
  purpose: "Each card drawn triggers a random effect on you or the ghost.",
  use: ["Pick up the deck.", "Draw one card at a time (only inside the investigation area).", "The card burns with a coloured flame and its effect happens."],
  activation: "Draw inside the investigation area. A deck holds 10 random cards; duplicates are possible.",
  sanity: "Depends on the card (Wheel of Fortune, Sun, Moon).",
  hunt: ["Death card → cursed hunt."],
  risks: "The Hanged Man kills the drawer.",
  safe: ["Draw near a hiding spot.", "Don't draw during a hunt or right before leaving."],
  advanced: ["The Hermit pins the ghost in its room — a safe window for evidence.", "The High Priestess revives a teammate."],
  ghostNotes: [],
  broken: "Deck is used up after 10 draws.",
  cards: [
    { name: "The Tower",          chance: "20%", effect: "Forces a ghost interaction.", color: "blue" },
    { name: "The Wheel of Fortune",chance: "20%", effect: "Burns green: +25% sanity. Burns red: −25% sanity.", color: "green/red" },
    { name: "The Fool",           chance: "17%", effect: "Pretends to be another card, then does nothing.", color: "—" },
    { name: "The Devil",          chance: "10%", effect: "Ghost event targeting the nearest player.", color: "—" },
    { name: "Death",              chance: "10%", effect: "Starts a cursed hunt.", color: "purple" },
    { name: "The Hermit",         chance: "10%", effect: "Teleports the ghost to its room and traps it there for a while (about a minute).", color: "—" },
    { name: "The Sun",            chance: "5%",  effect: "Restores your sanity to 100%.", color: "—" },
    { name: "The Moon",           chance: "5%",  effect: "Drops your sanity to 0%.", color: "—" },
    { name: "The High Priestess", chance: "2%",  effect: "Revives a dead teammate (or protects you if nobody is dead).", color: "—" },
    { name: "The Hanged Man",     chance: "1%",  effect: "Kills the player who drew it.", color: "—" }
  ],
  src: ["n13_tarot","wiki_tarot","training"], status: "likely",
  note: "Card odds are long-standing community figures; not re-verified for v0.19.1.0."
},
{
  id: "paw", name: "Monkey Paw", icon: "paw",
  look: "A shrivelled mummified hand.",
  purpose: "Grants spoken wishes — each with a downside.",
  use: ["Hold the paw and speak a wish by voice.", "Wishes per contract depend on the reward multiplier: 5 (below 2×), 4 (2×–2.99×), 3 (3× or higher)."],
  activation: "Hold and speak a recognised wish inside the investigation area.",
  sanity: "Weather wish costs 25%; the sanity wish sets everyone to 50%. Others cost no sanity directly.",
  hunt: ["\"See the ghost\" and \"knowledge\" end in a cursed hunt; \"trap the ghost\" ends in a normal hunt after 1 minute."],
  risks: "Some wishes can kill you (e.g. reviving a friend has a 50% chance to kill you).",
  safe: ["Lowest-risk wishes: weather (above 25% sanity) and \"leave\" when you are ready to exit.", "Avoid \"activity\" if you still need the lights; it breaks the fuse box.", "Make hunt-triggering wishes next to a hiding spot."],
  advanced: ["\"I wish for knowledge\" crosses out one wrong evidence — only worth it with an escape plan, since a cursed hunt follows.", "Shade appears as a shadow in Monkey Paw ghost events."],
  ghostNotes: [["shade","Appears as a shadow in Monkey Paw events."]],
  broken: "Crumbles after its last wish.",
  wishes: [
    { wish: "I wish to see the ghost", effect: "Forces a ghost event where the ghost is and locks the exit doors.", downside: "5 s later a cursed hunt starts; your vision is fogged until it ends.", status: "verified" },
    { wish: "I wish for activity", effect: "Doubles ghost activity for 2 minutes.", downside: "Fuse box breaks permanently; exit doors lock for 2 minutes.", status: "verified" },
    { wish: "I wish to trap the ghost", effect: "Moves the ghost to its favourite room and traps it there for 1 minute.", downside: "Your room's doors lock for 1 minute, then a normal hunt starts (25% chance doors stay locked until the grace period ends).", status: "verified" },
    { wish: "I wish for sanity", effect: "Sets every player's sanity to 50%.", downside: "Passive sanity drain ×1.5 for the rest of the contract; the ghost may move to a new favourite room.", status: "verified" },
    { wish: "I wish to be safe", effect: "Unblocks the nearest blocked hiding spot.", downside: "Your room's lights shatter; the ghost can hear you and sense your electronics from any distance.", status: "verified" },
    { wish: "I wish to leave", effect: "Unlocks all exit doors, even mid-hunt.", downside: "Speed and vision drop for ~5 s, then slowly recover.", status: "verified" },
    { wish: "I wish for life / to revive my friend", effect: "Revives the first dead player (only usable if someone is dead).", downside: "50% chance the wisher dies.", status: "verified" },
    { wish: "I wish for knowledge", effect: "Crosses out one wrong evidence (and its ghosts) in the journal.", downside: "The ghost appears near you and starts a cursed hunt; vision fogged and hearing muffled.", status: "verified" },
    { wish: "I wish for (clear sky / fog / rain / snow / sunrise)", effect: "Changes the weather.", downside: "Brief blindness and −25% sanity; can't be used below 25% sanity.", status: "verified" },
    { wish: "I wish for anything", effect: "Grants a random unused wish.", downside: "You get that wish's penalty.", status: "verified" }
  ],
  src: ["ath_paw","pgg_paw","kg_v01901"], status: "verified",
  note: "Effects and penalties match across a June 2026 guide and an older guide; v0.19.0.1 fixed the knowledge wish crossing out correct evidence."
}
];
